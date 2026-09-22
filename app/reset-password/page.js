'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import IdhLogo from '../../components/IdhLogo';
import { CheckCircle2, ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  
  const [loading, setLoading]                 = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [success, setSuccess]                 = useState(false);
  const [error, setError]                     = useState('');

  // 1. Verify recovery session on mount
  useEffect(() => {
    async function checkRecoverySession() {
      try {
        // Check if there is an active session (Supabase sets session from URL hash token)
        const { data: { session }, error: sessError } = await supabase.auth.getSession();
        
        if (session && !sessError) {
          setHasValidSession(true);
        } else {
          // Check hash in URL for access_token/type=recovery
          if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
            setHasValidSession(true);
          } else {
            setHasValidSession(false);
          }
        }
      } catch (err) {
        console.error('[checkRecoverySession]', err);
        setHasValidSession(false);
      } finally {
        setSessionChecking(false);
      }
    }

    checkRecoverySession();

    // Also listen for PASSWORD_RECOVERY auth event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && event === 'SIGNED_IN')) {
        setHasValidSession(true);
        setSessionChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Handle Password Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message || 'Failed to update password. Please request a new link.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-[#FCEEEE] selection:text-[#A50D1A]">
      
      {/* LEFT PANEL - Crimson IDH Brand Showcase */}
      <div className="md:w-1/2 bg-[#A50D1A] text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden min-h-[400px] md:min-h-screen">
        
        {/* Background Decorative Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/5 rounded-full pointer-events-none"></div>
        
        {/* Top Header & Badge */}
        <div className="relative z-10 space-y-6">
          <Link href="/" className="inline-block focus:outline-none">
            <IdhLogo light />
          </Link>

          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-white" />
              Secure IDH Account Recovery
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white mb-4">
            Create your new password.
          </h1>
          <p className="text-white/80 text-base sm:text-lg font-normal leading-relaxed">
            Ensure your account is protected with a strong password to continue enjoying your corporate benefits.
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-white/15">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">24/7</div>
            <div className="text-xs sm:text-sm text-white/70 font-medium">security guard</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
            <div className="text-xs sm:text-sm text-white/70 font-medium">encrypted</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">IDH</div>
            <div className="text-xs sm:text-sm text-white/70 font-medium">SSO system</div>
          </div>
        </div>

      </div>

      {/* RIGHT PANEL - Reset Password Form or State */}
      <div className="md:w-1/2 bg-white p-8 md:p-16 lg:p-20 flex flex-col justify-center items-center relative">
        
        {/* Navigation Shortcut */}
        <div className="w-full max-w-md flex justify-between items-center mb-8">
          <Link href="/login" className="text-xs font-semibold text-zinc-500 hover:text-[#A50D1A] transition-colors">
            ← Back to login
          </Link>
          
          <span className="text-xs font-bold text-[#A50D1A] bg-[#FCEEEE] px-3 py-1 rounded-full">
            Password Reset
          </span>
        </div>

        <div className="w-full max-w-md space-y-6">

          {/* 1. Loading State while checking session */}
          {sessionChecking ? (
            <div className="py-16 text-center space-y-3 animate-fadeIn">
              <div className="w-10 h-10 border-4 border-[#A50D1A]/20 border-t-[#A50D1A] rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-[#23161A]">Verifying your reset link...</p>
            </div>
          ) : success ? (
            /* 2. Success State */
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#FCEEEE] text-[#A50D1A] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#23161A]">Password Changed!</h2>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Your password has been reset successfully. You can now log in with your new credentials.
              </p>
              
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#A50D1A] hover:bg-[#880a15] text-white text-sm font-bold shadow-lg shadow-[#A50D1A]/30 transition-all hover:scale-[1.01]"
                >
                  <span>Proceed to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : !hasValidSession ? (
            /* 3. Expired or Invalid Link State */
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#23161A]">Reset Link Expired or Invalid</h2>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
                This password reset link has expired or was already used. Please request a new recovery link.
              </p>
              
              <div className="pt-2">
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#A50D1A] hover:bg-[#880a15] text-white text-sm font-bold shadow-lg shadow-[#A50D1A]/30 transition-all hover:scale-[1.01]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Request a New Reset Link</span>
                </Link>
              </div>
            </div>
          ) : (
            /* 4. Active Reset Password Form */
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23161A]">Reset your password</h2>
                <p className="text-sm text-zinc-500 mt-1">Enter your new password below (at least 6 characters).</p>
              </div>

              {/* Error banner */}
              {error && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                  <Link 
                    href="/forgot-password" 
                    className="inline-block text-xs font-bold text-[#A50D1A] hover:underline"
                  >
                    Need a new reset link? Click here.
                  </Link>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-[#23161A] mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute top-3.5 left-3.5" />
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-zinc-200 focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-[#23161A] mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute top-3.5 left-3.5" />
                    <input
                      required
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-zinc-200 focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-[#A50D1A] hover:bg-[#880a15] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-[#A50D1A]/30 transition-all hover:scale-[1.01] mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Updating password...
                    </>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
