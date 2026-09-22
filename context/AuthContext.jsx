'use client';

// context/AuthContext.jsx
// Real Supabase authentication — provides login, signup, logout, demoLogin, and resetPassword.

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────────────────────
// Context definition
// ─────────────────────────────────────────────────────────────

const AuthContext = createContext({
  user:          null,
  profile:       null,
  isLoggedIn:    false,
  isLoaded:      false,
  login:         async () => {},
  signup:        async () => {},
  logout:        async () => {},
  demoLogin:     async () => {},
  resetPassword: async () => {},
});

// ─────────────────────────────────────────────────────────────
// Demo user (used by demoLogin — no real account needed)
// ─────────────────────────────────────────────────────────────

export const DEMO_USER = {
  name:               'IDH Team Member',
  employeeId:         'IDH-9842',
  email:              'employee@idh.com',
  department:         'Al Mokhtabar - Medical Analysis',
  role:               'Senior Specialist',
  tier:               'Gold Member',
  avatar:             'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  savedBenefitsCount: 5,
};

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user,     setUser]     = useState(null);   // Supabase auth user object
  const [profile,  setProfile]  = useState(null);   // profiles table row
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────

  /** Fetch the profiles row for a given auth user and update state. */
  async function fetchProfile(authUser) {
    if (!authUser) { setProfile(null); return; }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    setProfile(data ?? null);
  }

  // ── Auth state listener ──────────────────────────────────────

  useEffect(() => {
    // Resolve the initial session, then unblock the UI immediately.
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setIsLoaded(true);   // unblock UI
      fetchProfile(u);     // load profile in background
    });

    // Subscribe to future auth changes (login / logout / token refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      fetchProfile(u);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Auth actions ─────────────────────────────────────────────

  /**
   * Sign in with email + password.
   * @returns {{ success: boolean, error?: string }}
   */
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  };

  /**
   * Create a new account then sign in.
   * @param {{ email: string, password: string, fullName: string, employeeId?: string, department?: string }} formData
   * @returns {{ success: boolean, requiresConfirmation?: boolean, error?: string }}
   */
  const signup = async ({ email, password, fullName, employeeId, department }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name:   fullName    ?? '',
          employee_id: employeeId ?? '',
          department:  department ?? '',
        },
      },
    });

    if (error) return { success: false, error: error.message };

    // Supabase may require email confirmation before creating a session.
    if (data.user && !data.session) {
      return { success: true, requiresConfirmation: true };
    }

    return { success: true, user: data.user };
  };

  /**
   * Sign out the current user and clear local state.
   */
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  /**
   * Sign in as the demo user.
   * Uses real Supabase credentials if env vars are provided,
   * otherwise falls back to a local-only mock session.
   */
  const demoLogin = async () => {
    const demoEmail    = process.env.NEXT_PUBLIC_DEMO_EMAIL;
    const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

    if (demoEmail && demoPassword) {
      return login(demoEmail, demoPassword);
    }

    // Fallback: mock session (no Supabase round-trip)
    setUser({ id: 'demo', email: DEMO_USER.email });
    setProfile(DEMO_USER);
    return { success: true, user: DEMO_USER };
  };

  /**
   * Send a password reset email.
   * @param {string} email
   * @returns {{ success: boolean, message?: string, error?: string }}
   */
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, message: `Password reset link sent to ${email}` };
  };

  // ── Derived state ────────────────────────────────────────────

  /** Compose a display-friendly user object from auth + profile data. */
  const displayUser = user
    ? {
        name:       profile?.full_name  ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Employee',
        email:      user.email,
        department: profile?.department ?? user.user_metadata?.department ?? 'IDH Corporate',
        role:       profile?.role       ?? 'Employee',
        isAdmin:    profile?.role === 'admin',
      }
    : null;

  // ── Provider ─────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        user:       displayUser,
        profile,
        isLoggedIn: !!user,
        isLoaded,
        login,
        signup,
        logout,
        demoLogin,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
