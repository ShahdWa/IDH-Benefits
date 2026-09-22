'use client';

// app/signup/page.js
// Standalone signup page — mirrors the auth gate UI but as a dedicated route.

import { useState } from 'react';
import Link         from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth }   from '../../context/AuthContext';
import IdhLogo       from '../../components/IdhLogo';
import {
  EyeOpenIcon,
  EyeOffIcon,
  SpinnerIcon,
  AlertCircleIcon,
} from '../../components/icons/EyeIcon';

// ─────────────────────────────────────────────────────────────
// Signup page
// ─────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router        = useRouter();
  const { signup }    = useAuth();

  const [fullName,     setFullName]     = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [confirmed,    setConfirmed]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signup({ fullName, email, password });

    if (result?.success) {
      if (result.requiresConfirmation) {
        setConfirmed(true);
      } else {
        router.push('/');
      }
    } else {
      setError(result?.error ?? 'Signup failed. Please try again.');
    }

    setLoading(false);
  };

  // ── "Check your email" confirmation screen ───────────────────
  if (confirmed) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center font-sans">
        <div className="max-w-sm text-center space-y-4 px-6">
          <h2 className="text-2xl font-extrabold text-[#23161A]">Check your inbox</h2>
          <p className="text-sm text-zinc-500">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/" className="inline-block text-sm font-bold text-[#A50D1A] hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // ── Main layout ──────────────────────────────────────────────

  return (
    <div className="min-h-screen md:h-screen w-screen bg-white flex flex-col md:flex-row overflow-y-auto md:overflow-hidden font-sans selection:bg-[#FCEEEE] selection:text-[#A50D1A]">

      {/* Left panel — crimson brand showcase (65%) */}
      <div className="hidden md:flex md:w-[65%] bg-[#A50D1A] text-white p-8 md:p-12 lg:p-16 flex-col justify-between relative overflow-hidden h-full">

        {/* Decorative background rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-white/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] border border-white/5 rounded-full pointer-events-none" />

        {/* Logo + badge */}
        <div className="relative z-10 space-y-5">
          <Link href="/" className="inline-block focus:outline-none">
            <IdhLogo light />
          </Link>
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              For IDH employees only
            </span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 my-auto py-6 max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.14] text-white mb-4">
            Every perk of working here, in one place.
          </h1>
          <p className="text-white/80 text-base sm:text-lg font-normal leading-relaxed max-w-lg">
            Sign in to browse discounts on restaurants, travel, health, and more picked for you.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-white/15 max-w-lg">
          {[
            { value: '7',     label: 'categories' },
            { value: '40+',   label: 'partners'   },
            { value: '7,000', label: 'employees'  },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">{value}</div>
              <div className="text-xs sm:text-sm text-white/70 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — signup form (35%) */}
      <div className="w-full md:w-[35%] bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center min-h-screen md:h-full overflow-y-auto">
        <div className="w-full max-w-sm space-y-5">

          {/* Logo (mobile) + tab switcher */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="md:hidden inline-block focus:outline-none">
              <IdhLogo />
            </Link>
            <div className="bg-[#FAF5F3] p-1 rounded-full flex items-center border border-[#ECE1DE] ml-auto">
              <Link href="/login" className="px-5 py-1.5 rounded-full text-xs font-bold text-zinc-500 hover:text-[#23161A] transition-all">
                Login
              </Link>
              <Link href="/signup" className="px-5 py-1.5 rounded-full text-xs font-bold bg-white text-[#23161A] shadow-sm transition-all">
                Sign up
              </Link>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23161A]">Create your account</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">Sign up with your IDH work email</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name */}
            <div>
              <label className="block text-xs font-bold text-[#23161A] mb-1.5">Full name</label>
              <input
                required
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setError(''); }}
                className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-xs sm:text-sm bg-white"
              />
            </div>

            {/* Work email */}
            <div>
              <label className="block text-xs font-bold text-[#23161A] mb-1.5">Work email</label>
              <input
                required
                type="email"
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
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-3.5 py-3 pr-11 rounded-xl border border-zinc-200 focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-xs sm:text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#A50D1A] hover:bg-[#880a15] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold shadow-md shadow-[#A50D1A]/25 transition-all hover:scale-[1.01] mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Creating account...
                </>
              ) : 'Create account'}
            </button>
          </form>

          {/* Login link */}
          <div className="text-center pt-3 text-sm text-zinc-600 font-medium">
            <span>Already have an account? </span>
            <Link href="/login" className="font-extrabold text-[#A50D1A] text-sm sm:text-base hover:underline ml-0.5">
              Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
