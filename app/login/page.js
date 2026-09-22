'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import IdhLogo from '../../components/IdhLogo';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result?.success) {
      router.push('/');
    } else {
      setError(result?.error ?? 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };


  return (
    <div className="h-screen w-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans selection:bg-[#FCEEEE] selection:text-[#A50D1A]">

      {/* LEFT PANEL - Crimson IDH Brand Showcase (65% Width) */}
      <div className="w-full md:w-[65%] lg:w-[65%] bg-[#A50D1A] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden h-full">

        {/* Background Decorative Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-white/10 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] border border-white/5 rounded-full pointer-events-none"></div>

        {/* Top Header & Badge */}
        <div className="relative z-10 space-y-5">
          <Link href="/" className="inline-block focus:outline-none">
            <IdhLogo light />
          </Link>

          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              For IDH employees only
            </span>
          </div>
        </div>

        {/* Hero Title & Description */}
        <div className="relative z-10 my-auto py-6 max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.14] text-white mb-4">
            Every perk of working here, in one place.
          </h1>
          <p className="text-white/80 text-base sm:text-lg font-normal leading-relaxed max-w-lg">
            Sign in to browse discounts on restaurants, travel, health, and more picked for you.
          </p>
        </div>

        {/* Bottom Stats Counter (7,000 employees) */}
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

      {/* RIGHT PANEL - Login Form (35% Width) */}
      <div className="w-full md:w-[35%] lg:w-[35%] bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center h-full relative overflow-hidden">

        <div className="w-full max-w-sm space-y-5">

          {/* Login / Sign up Pills Switcher */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="md:hidden inline-block focus:outline-none">
              <IdhLogo />
            </Link>
            <div className="bg-[#FAF5F3] p-1 rounded-full flex items-center border border-[#ECE1DE] ml-auto">
              <Link
                href="/login"
                className="px-5 py-1.5 rounded-full text-xs font-bold bg-white text-[#23161A] shadow-sm transition-all"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-1.5 rounded-full text-xs font-bold text-zinc-500 hover:text-[#23161A] transition-all"
              >
                Sign up
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23161A]">Welcome back</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">Login to access your benefits</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Work email */}
            <div>
              <label className="block text-xs font-bold text-[#23161A] mb-1.5">Work email</label>
              <input
                required
                type="text"
                placeholder="you@idh.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-xs sm:text-sm bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#23161A] mb-1.5">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-3.5 py-3 pr-11 rounded-xl border border-zinc-200 focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-xs sm:text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
              </div>
            )}

            {/* Forgot password */}
            <div className="flex items-center justify-end pt-0.5 text-xs">
              <Link href="/forgot-password" className="font-extrabold text-sm text-[#A50D1A] hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Login button */}
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
                  Signing in...
                </>
              ) : 'Login'}
            </button>

          </form>

          {/* New here? Create an account */}
          <div className="text-center pt-3 text-sm text-zinc-600 font-medium">
            <span>New here? </span>
            <Link href="/signup" className="font-extrabold text-[#A50D1A] text-sm sm:text-base hover:underline ml-0.5">
              Create an account
            </Link>
          </div>

          {/* Admin Dashboard Link */}
          <div className="pt-3 text-center text-xs text-zinc-400">
            <span>Are you an admin? </span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 font-semibold text-[#23161A] hover:underline transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Go to admin dashboard
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
