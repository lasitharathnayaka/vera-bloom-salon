import { createContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ROLES } from '../utils/constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authUser) => {
    if (!supabase || !authUser) {
      setProfile(null);
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
      return data;
    }
    return null;
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const prof = await fetchProfile(session.user);
        setUser({
          id: session.user.id,
          email: session.user.email,
          name:
            prof?.full_name ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split('@')[0],
          role: prof?.role || session.user.user_metadata?.role || ROLES.CUSTOMER,
        });
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const prof = await fetchProfile(session.user);
        setUser({
          id: session.user.id,
          email: session.user.email,
          name:
            prof?.full_name ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split('@')[0],
          role: prof?.role || session.user.user_metadata?.role || ROLES.CUSTOMER,
        });
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({ email, password, fullName, phone, role }) => {
    if (!supabase) {
      const demo = { id: `demo-${Date.now()}`, email, name: fullName, role };
      setUser(demo);
      return { data: { user: demo }, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role: role === ROLES.STYLIST ? ROLES.STYLIST : ROLES.CUSTOMER,
        },
      },
    });

    return { data, error };
  };

  const signIn = async ({ email, password }) => {
    if (!supabase) {
      const demo = {
        id: `demo-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: ROLES.CUSTOMER,
      };
      setUser(demo);
      return { data: { user: demo }, profile: null, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      return { data, profile: null, error };
    }

    const prof = await fetchProfile(data.user);
    return { data, profile: prof, error: null };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  // Compatibility helpers for quick demo/role switching
  const login = (userData) => setUser(userData);
  const logout = signOut;
  const switchRole = (role) =>
    setUser((prev) => ({
      ...(prev || { id: 'demo-user', name: 'Demo User' }),
      role,
    }));

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        login,
        logout,
        switchRole,
        refreshProfile: () => (user ? fetchProfile({ id: user.id }) : null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
