import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Calendar,
  CalendarClock,
  CheckCheck,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

function formatRelativeTime(isoString) {
  if (!isoString) return 'Just now';
  const diffSec = Math.max(
    0,
    Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  );
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

function getTypeIcon(type) {
  if (type === 'booking') return Calendar;
  if (type === 'bridal') return Heart;
  if (type === 'shift') return CalendarClock;
  return Sparkles;
}

export default function NotificationBell() {
  const ctx = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (!ctx) return null;

  const {
    notifications,
    unreadCount,
    connected,
    markAsRead,
    markAllAsRead,
    sendLiveTestNotification,
  } = ctx;

  const handleItemClick = (item) => {
    if (!item.is_read) markAsRead(item.id);
    setOpen(false);
    if (item.link) navigate(item.link);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E5E1D8] bg-[#FAF8F5] text-[#4A5B4B] transition-colors hover:bg-[#EFECE6]"
      >
        <Bell className="h-4 w-4" strokeWidth={1.7} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C85A4E] px-1 text-[9.5px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2.5 w-80 overflow-hidden rounded-[22px] border border-[#E5E1D8] bg-[#FAF8F5] shadow-2xl sm:w-96">
          {/* Dark-Sage Header */}
          <div className="flex items-center justify-between bg-[#253026] px-5 py-4 text-[#FAF8F5]">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-serif text-[17px] font-medium">
                  Notifications
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[9.5px] font-semibold text-[#EFE0C6]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      connected ? 'bg-[#57A764]' : 'bg-[#C8A870]'
                    }`}
                  />
                  {connected ? 'Live' : 'Syncing'}
                </span>
              </div>
              <p className="mt-0.5 text-[10.5px] text-[#A8B8AA]">
                {unreadCount > 0
                  ? `${unreadCount} unread sanctuary update${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up'}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[10.5px] font-medium text-[#EFE0C6] transition-colors hover:bg-white/12"
              >
                <CheckCheck className="h-3 w-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 divide-y divide-[#EFECE5] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Bell className="mx-auto h-6 w-6 text-[#C8A870]" />
                <p className="mt-2 font-serif text-base text-[#222B23]">
                  No notifications yet
                </p>
                <p className="mt-0.5 text-[11px] text-[#7A766E]">
                  Live booking, bridal, and status alerts appear here instantly.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#F3F0EA] ${
                      !item.is_read ? 'bg-[#F7F4EE]' : 'bg-[#FAF8F5]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        !item.is_read
                          ? 'bg-[#253026] text-[#EFE0C6]'
                          : 'bg-[#EFECE5] text-[#6C6961]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12.5px] font-semibold text-[#222B23]">
                          {item.title}
                        </p>
                        {!item.is_read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#C8A870]" />
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-relaxed text-[#6C6961]">
                        {item.message}
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-[#928D84]">
                        {formatRelativeTime(item.created_at)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Test Trigger */}
          <div className="flex items-center justify-between border-t border-[#EFECE5] bg-[#F5F2EC] px-4 py-2.5 text-[11px]">
            <span className="text-[#7A766E]">Supabase Realtime</span>
            <button
              type="button"
              onClick={sendLiveTestNotification}
              className="cursor-pointer font-semibold text-[#253026] hover:underline"
            >
              Send Test Alert →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
