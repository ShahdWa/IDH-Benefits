'use client';

// components/AuthGate.jsx
// Full-screen authentication landing page (shown when user is not logged in).
// Extracted from app/page.js to keep the main page file clean.

import { useState } from 'react';
import Link from 'next/link';
import IdhLogo from './IdhLogo';
import { EyeOpenIcon, EyeOffIcon, SpinnerIcon, AlertCircleIcon, ShieldIcon } from './icons/EyeIcon';

// ─────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────

/** Left branding panel (crimson, 65% width) */
function BrandPanel({ categoriesCount, benefitsCount }) {
  return (
    <div className="hidden md:flex md:w-[65%] bg-[#A50D1A] text-white p-8 md:p-12 lg:p-16 flex-col justify-between relative overflow-hidden h-full">

      {/* Decorative background rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-white/10 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] border border-white/5 rounded-full pointer-events-none" />

      {/* Logo + "employees only" badge */}
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

      {/* Stats counter */}
      <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-white/15 max-w-lg">
        <StatItem value={categoriesCount || 6} label="categories" />
        <StatItem value={benefitsCount ? `${benefitsCount}+` : '40+'} label="benefits" />
        <StatItem value="7,000" label="employees" />
      </div>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">{value}</div>
      <div className="text-xs sm:text-sm text-white/70 font-medium mt-0.5">{label}</div>
    </div>
  );
}

/** Tab switcher pill (Login / Sign up) */
function AuthTabs({ activeTab, onSwitch }) {
  const tabClass = (tab) =>
    `px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
      activeTab === tab
        ? 'bg-white text-[#23161A] shadow-sm'
        : 'text-zinc-500 hover:text-[#23161A]'
    }`;

  return (
    <div className="bg-[#FAF5F3] p-1 rounded-full flex items-center border border-[#ECE1DE] ml-auto">
      <button type="button" onClick={() => onSwitch('login')} className={tabClass('login')}>
        Login
      </button>
      <button type="button" onClick={() => onSwitch('signup')} className={tabClass('signup')}>
        Sign up
      </button>
    </div>
  );
}

/** Inline error banner */
function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
      <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
      {message}
    </div>
  );
}

/** Password input with show/hide toggle */
function PasswordInput({ value, onChange, placeholder, label }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-xs font-bold text-[#23161A] mb-1.5">{label}</label>
      <div className="relative">
        <input
          required
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-3.5 py-3 pr-11 rounded-xl border border-zinc-200 focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-xs sm:text-sm bg-white"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOffIcon /> : <EyeOpenIcon />}
        </button>
      </div>
    </div>
  );
}

/** Primary submit button with loading spinner */
function SubmitButton({ loading, label, loadingLabel }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 rounded-full bg-[#A50D1A] hover:bg-[#880a15] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold shadow-md shadow-[#A50D1A]/25 transition-all hover:scale-[1.01] mt-2 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <SpinnerIcon />
          {loadingLabel}
        </>
      ) : label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Login form
// ─────────────────────────────────────────────────────────────

function LoginForm({ email, setEmail, password, setPassword, setError, onSubmit, loading, error }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(''); }}
      />

      <div className="flex items-center justify-end pt-0.5">
        <Link href="/forgot-password" className="font-extrabold text-sm text-[#A50D1A] hover:underline">
          Forgot password?
        </Link>
      </div>

      <ErrorBanner message={error} />

      <SubmitButton loading={loading} label="Login" loadingLabel="Signing in..." />
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// Signup form
// ─────────────────────────────────────────────────────────────

function SignupForm({ fullName, setFullName, email, setEmail, password, setPassword, setError, onSubmit, loading, error }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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

      <PasswordInput
        label="Password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(''); }}
      />

      <ErrorBanner message={error} />

      <SubmitButton loading={loading} label="Create account" loadingLabel="Creating account..." />
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

/**
 * Full-screen auth gate rendered when the user is not logged in.
 *
 * @param {{ login, signup, categoriesCount, benefitsCount }} props
 */
export default function AuthGate({ login, signup, categoriesCount, benefitsCount }) {
  const [activeTab, setActiveTab] = useState('signup');

  const [fullName,  setFullName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res?.success) {
      setError(res?.error || 'Invalid email or password. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signup({ fullName, email, password });
    setLoading(false);
    if (!res?.success) {
      setError(res?.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen md:h-screen w-screen bg-white flex flex-col md:flex-row overflow-y-auto md:overflow-hidden font-sans selection:bg-[#FCEEEE] selection:text-[#A50D1A]">

      <BrandPanel categoriesCount={categoriesCount} benefitsCount={benefitsCount} />

      {/* Right panel — auth form (35% width) */}
      <div className="w-full md:w-[35%] bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center min-h-screen md:h-full overflow-y-auto">
        <div className="w-full max-w-sm space-y-5">

          {/* Logo (mobile only) + tab switcher */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="md:hidden inline-block focus:outline-none">
              <IdhLogo />
            </Link>
            <AuthTabs activeTab={activeTab} onSwitch={handleTabSwitch} />
          </div>

          {/* Form heading */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23161A]">
              {activeTab === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              {activeTab === 'signup'
                ? 'Sign up with your IDH work email'
                : 'Login to access your benefits'}
            </p>
          </div>

          {/* Active form */}
          {activeTab === 'signup' ? (
            <SignupForm
              fullName={fullName}  setFullName={setFullName}
              email={email}        setEmail={setEmail}
              password={password}  setPassword={setPassword}
              setError={setError}  onSubmit={handleSignup}
              loading={loading}    error={error}
            />
          ) : (
            <LoginForm
              email={email}        setEmail={setEmail}
              password={password}  setPassword={setPassword}
              setError={setError}  onSubmit={handleLogin}
              loading={loading}    error={error}
            />
          )}

          {/* Account switcher footer */}
          <div className="text-center pt-3 text-sm text-zinc-600 font-medium">
            {activeTab === 'signup' ? (
              <>
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="font-extrabold text-[#A50D1A] text-sm sm:text-base hover:underline ml-0.5"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <span>New here? </span>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('signup')}
                  className="font-extrabold text-[#A50D1A] text-sm sm:text-base hover:underline ml-0.5"
                >
                  Create an account
                </button>
              </>
            )}
          </div>

          {/* Admin link */}
          <div className="pt-3 text-center text-xs text-zinc-400">
            <span>Are you an admin? </span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 font-semibold text-[#23161A] hover:underline transition-all"
            >
              <ShieldIcon />
              Go to admin dashboard
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
