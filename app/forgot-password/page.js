'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import IdhLogo from '../../components/IdhLogo';
import { Mail, CheckCircle2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail]               = useState('');
  const [step, setStep]                 = useState(1); // 1: Email, 2: OTP, 3: Success
  const [otp, setOtp]                   = useState(['', '', '', '']);
  const [newPassword, setNewPassword]   = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSendEmail = (e) => {
    e.preventDefault();
    resetPassword(email);
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setStep(4);
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
              Secure Employee Account Recovery
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white mb-4">
            Reset your password securely in seconds.
          </h1>
          <p className="text-white/80 text-base sm:text-lg font-normal leading-relaxed">
            Enter your corporate email or employee ID to receive a verification code and restore full access to your perks.
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-white/15">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">24/7</div>
            <div className="text-xs sm:text-sm text-white/70 font-medium">auto recovery</div>
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

      {/* RIGHT PANEL - Recovery Steps */}
      <div className="md:w-1/2 bg-white p-8 md:p-16 lg:p-20 flex flex-col justify-center items-center relative">
        
        {/* Navigation Shortcut */}
        <div className="w-full max-w-md flex justify-between items-center mb-8">
          <Link href="/login" className="text-xs font-semibold text-zinc-500 hover:text-[#A50D1A] transition-colors">
            ← Back to login
          </Link>
          
          <span className="text-xs font-bold text-[#A50D1A] bg-[#FCEEEE] px-3 py-1 rounded-full">
            Step {step > 3 ? 3 : step} of 3
          </span>
        </div>

        <div className="w-full max-w-md space-y-6">

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23161A]">Forgot password?</h2>
                <p className="text-sm text-zinc-500 mt-1">No worries! Enter your work email or employee ID.</p>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#23161A] mb-1.5">Work email or Employee ID</label>
                  <input
                    required
                    type="text"
                    placeholder="you@idh.com or IDH-9842"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#A50D1A] outline-none text-sm bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#A50D1A] hover:bg-[#880a15] text-white text-sm font-bold shadow-lg shadow-[#A50D1A]/30 transition-all hover:scale-[1.01]"
                >
                  Send Verification Code
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Enter OTP Code */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23161A]">Enter OTP Code</h2>
                <p className="text-sm text-zinc-500 mt-1">We sent a 4-digit code to <span className="font-bold text-[#23161A]">{email || 'your email'}</span></p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="flex justify-between gap-3 max-w-xs mx-auto">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      defaultValue={idx === 0 ? '9' : idx === 1 ? '8' : idx === 2 ? '4' : '2'}
                      className="w-14 h-14 text-center text-xl font-bold rounded-xl border-2 border-zinc-200 focus:border-[#A50D1A] outline-none bg-[#FAF5F3]"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#A50D1A] hover:bg-[#880a15] text-white text-sm font-bold shadow-lg shadow-[#A50D1A]/30 transition-all hover:scale-[1.01]"
                >
                  Verify & Continue
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23161A]">Set new password</h2>
                <p className="text-sm text-zinc-500 mt-1">Must be at least 8 characters long.</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#23161A] mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-zinc-200 focus:border-[#A50D1A] outline-none text-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#A50D1A] hover:bg-[#880a15] text-white text-sm font-bold shadow-lg shadow-[#A50D1A]/30 transition-all hover:scale-[1.01]"
                >
                  Reset Password
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#FCEEEE] text-[#A50D1A] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#23161A]">Password Changed!</h3>
              <p className="text-sm text-zinc-500">Your password has been reset successfully.</p>
              
              <Link
                href="/login"
                className="inline-block px-8 py-3.5 rounded-full bg-[#A50D1A] text-white text-sm font-bold shadow-lg shadow-[#A50D1A]/30"
              >
                Proceed to Login
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
