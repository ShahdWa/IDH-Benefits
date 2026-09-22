'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IdhLogo from '../../../components/IdhLogo';
import { supabase } from '../../../lib/supabase';
import { checkIsAdmin } from '../../../lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Sign in with Supabase Auth
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      return;
    }

    // 2. Verify the user has admin role via DB function
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      await supabase.auth.signOut();
      setError('Access denied. This account does not have admin privileges.');
      setLoading(false);
      return;
    }

    // 3. All good — go to dashboard
    router.push('/admin');
  };

  return (
    <div className="min-h-screen md:h-screen w-screen bg-white flex flex-col md:flex-row overflow-y-auto md:overflow-hidden font-sans selection:bg-[#FCEEEE] selection:text-[#A50D1A]">

      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-[65%] bg-[#A50D1A] text-white p-8 md:p-12 lg:p-16 flex-col justify-between relative overflow-hidden h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-white/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] border border-white/5 rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <Link href="/" className="inline-block focus:outline-none">
            <IdhLogo light />
          </Link>
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Admin Access Only
            </span>
          </div>
        </div>

        <div className="relative z-10 my-auto py-6 max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.14] text-white mb-4">
            Manage benefits,<br />all from one place.
          </h1>
          <p className="text-white/80 text-base sm:text-lg font-normal leading-relaxed max-w-lg">
            Sign in with your admin credentials to manage partners, benefits, and employee perks.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-white/15 max-w-lg">
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">7</div>
            <div className="text-xs sm:text-sm text-white/70 font-medium mt-0.5">categories</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">40+</div>
            <div className="text-xs sm:text-sm text-white/70 font-medium mt-0.5">partners</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">7,000</div>
            <div className="text-xs sm:text-sm text-white/70 font-medium mt-0.5">employees</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[35%] bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center min-h-screen md:h-full relative overflow-y-auto">
        <div className="w-full max-w-sm space-y-5">

          {/* Admin pill */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="md:hidden inline-block focus:outline-none">
              <IdhLogo />
            </Link>
            <div className="bg-[#FAF5F3] p-1 rounded-full flex items-center border border-[#ECE1DE] ml-auto">
              <span className="px-5 py-1.5 rounded-full text-xs font-bold bg-white text-[#23161A] shadow-sm flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#A50D1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Admin
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23161A]">Admin Sign In</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">Restricted to authorized administrators</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#23161A] mb-1.5">Admin email</label>
              <input
                required
                type="email"
                placeholder="admin@idh.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-xs sm:text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#23161A] mb-1.5">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-3.5 py-3 pr-11 rounded-xl border border-zinc-200 focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-xs sm:text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPass ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#A50D1A] hover:bg-[#880a15] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold shadow-md shadow-[#A50D1A]/25 transition-all hover:scale-[1.01] mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying...
                </>
              ) : 'Sign in as Admin'}
            </button>
          </form>

          <div className="text-center pt-3 text-sm text-zinc-600 font-medium">
            <span>Not an admin? </span>
            <Link href="/login" className="font-extrabold text-[#A50D1A] text-sm hover:underline ml-0.5">
              Employee login
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
