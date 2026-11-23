import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Heart, Sparkles, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const NotificationContext = createContext(null);

function matchesCurrentUser(row, user) {
  if (!row || !user) return false;
  if (row.recipient_user_id) {
    return row.recipient_user_id === user.id;
  }
  return row.recipient_role === user.role;
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [connected, setConnected] = useState(false);
  const seenIdsRef = useRef(new Set());
  const initialLoadedRef = useRef(false);

  const pushToast = useCallback((item) => {
    const toastId = `${item.id}-${Date.now()}`;
    setToasts((prev) => {
      if (prev.some((t) => t.id === item.id)) return prev;
      return [{ ...item, toastId }, ...prev].slice(0, 3);
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, 6000);
  }, []);

  const dismissToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  }, []);

  const ingestIncoming = useCallback(
    (row, showToast = true) => {
      if (!row?.id) return;
      const isNew = !seenIdsRef.current.has(row.id);
      seenIdsRef.current.add(row.id);

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === row.id);
        if (exists) {
          return prev.map((n) => (n.id === row.id ? row : n));
        }
        return [row, ...prev].slice(0, 30);
      });

      if (isNew && showToast && !row.is_read) {
        pushToast(row);
      }
    },
    [pushToast]
  );

  // Load initial notifications, authenticate Realtime JWT, subscribe + live fallback sync
  useEffect(() => {
    if (!supabase || !user) {
      setNotifications([]);
      setConnected(false);
      seenIdsRef.current = new Set();
      initialLoadedRef.current = false;
      return;
    }

    let active = true;
    let channel = null;

    const fetchLatest = async (announceNew = false) => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);

      if (!active || !Array.isArray(data)) return;

      if (!initialLoadedRef.current) {
        data.forEach((n) => seenIdsRef.current.add(n.id));
        setNotifications(data);
        initialLoadedRef.current = true;
      } else {
        // Detect any brand-new rows arrived since last check
        const fresh = data.filter((n) => !seenIdsRef.current.has(n.id));
        if (fresh.length > 0) {
          fresh.forEach((n) => seenIdsRef.current.add(n.id));
          if (announceNew) {
            fresh
              .filter((n) => !n.is_read)
              .slice(0, 2)
              .forEach((n) => pushToast(n));
          }
        }
        setNotifications(data);
      }
    };

    const setupRealtime = async () => {
      // Ensure Realtime WebSocket uses the current user's JWT for RLS
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
      }

      await fetchLatest(false);
      if (!active) return;

      channel = supabase
        .channel(`live-notifications-${user.id}-${Date.now()}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          (payload) => {
            const row = payload.new;
            if (!matchesCurrentUser(row, user)) return;
            ingestIncoming(row, true);
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'notifications' },
          (payload) => {
            const row = payload.new;
            if (!matchesCurrentUser(row, user)) return;
            setNotifications((prev) =>
              prev.map((n) => (n.id === row.id ? row : n))
            );
          }
        )
        .subscribe((status) => {
          if (active) setConnected(status === 'SUBSCRIBED');
        });
    };

    setupRealtime();

    // Lightweight live sync safeguard every 4 seconds (guarantees instant delivery even if WS drops)
    const intervalId = setInterval(() => {
      fetchLatest(true);
    }, 4000);

    return () => {
      active = false;
      clearInterval(intervalId);
      if (channel) supabase.removeChannel(channel);
    };
  }, [user, ingestIncoming, pushToast]);

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    if (supabase) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    if (supabase) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', unreadIds);
    }
  }, [notifications]);

  const sendLiveTestNotification = useCallback(async () => {
    if (!supabase || !user) return;
    const roleLabel =
      user.role === 'admin'
        ? 'Admin Owner Console'
        : user.role === 'stylist'
          ? 'Specialist Portal'
          : 'Customer Account';
    const targetLink =
      user.role === 'admin'
        ? '/admin/appointments'
        : user.role === 'stylist'
          ? '/stylist'
          : '/booking';

    const { data } = await supabase
      .from('notifications')
      .insert({
        recipient_role: user.role,
        recipient_user_id: user.id,
        title: `Live Sanctuary Alert (${roleLabel})`,
        message:
          'Realtime sanctuary notifications are connected and delivering instant updates.',
        type: 'info',
        link: targetLink,
      })
      .select()
      .single();

    if (data) {
      ingestIncoming(data, true);
    }
  }, [user, ingestIncoming]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        connected,
        markAsRead,
        markAllAsRead,
        sendLiveTestNotification,
      }}
    >
      {children}

      {/* ================= FLOATING LIVE NOTIFICATION TOASTS ================= */}
      {toasts.length > 0 && (
        <div className="pointer-events-none fixed right-5 bottom-5 z-[100] flex w-full max-w-sm flex-col gap-2.5">
          {toasts.map((toast) => {
            const Icon =
              toast.type === 'booking'
                ? Calendar
                : toast.type === 'bridal'
                  ? Heart
                  : toast.type === 'status'
                    ? Sparkles
                    : Bell;

            return (
              <div
                key={toast.toastId}
                className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[#EFE0C6]/25 bg-[#253026] p-4 text-[#FAF8F5] shadow-2xl"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
                  <Icon className="h-4 w-4" />
                </span>

                <button
                  type="button"
                  onClick={() => {
                    markAsRead(toast.id);
                    dismissToast(toast.toastId);
                    if (toast.link) navigate(toast.link);
                  }}
                  className="min-w-0 flex-1 cursor-pointer text-left"
                >
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-[#EFE0C6] uppercase">
                    Live Update
                  </p>
                  <p className="mt-0.5 font-serif text-[15.5px] font-semibold leading-snug text-[#FAF8F5]">
                    {toast.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-relaxed text-[#C5D1C7]">
                    {toast.message}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => dismissToast(toast.toastId)}
                  aria-label="Dismiss notification"
                  className="cursor-pointer rounded-full p-1 text-[#A8B8AA] hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
