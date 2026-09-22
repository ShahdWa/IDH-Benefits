'use client';

import { useState, useEffect } from 'react';
import IdhLogo from './IdhLogo';
import { X, CheckCircle2, Eye, EyeOff, Building2, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, mode = 'login' }) {
  const { login, signup, demoLogin, resetPassword } = useAuth();
  
  const [authTab, setAuthTab] = useState(mode); // 'login' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: 'Al Mokhtabar',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setAuthTab(mode);
    setSubmitted(false);
    setLoggedInUser(null);
    setAuthError('');
  }, [mode, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authTab === 'login') {
        const res = await login(formData.email, formData.password);
        if (!res?.success) {
          setAuthError(res?.error || 'Invalid email or password. Please try again.');
          setAuthLoading(false);
          return;
        }
        setAuthLoading(false);
        onClose();
      } else if (authTab === 'signup') {
        const res = await signup(formData);
        if (!res?.success) {
          setAuthError(res?.error || 'Signup failed. Please try again.');
          setAuthLoading(false);
          return;
        }
        setAuthLoading(false);
        onClose();
      } else if (authTab === 'forgot') {
        const res = await resetPassword(formData.email);
        if (!res?.success) {
          setAuthError(res?.error || 'Failed to send reset link.');
          setAuthLoading(false);
          return;
        }
        setAuthLoading(false);
        setSubmitted(true);
      }
    } catch (err) {
      setAuthError(err.message || 'An unexpected error occurred.');
      setAuthLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setLoggedInUser(null);
    setAuthError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#23161A]/60 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-white w-full max-w-[460px] rounded-[24px] p-6 sm:p-8 relative shadow-2xl border border-[#ECE1DE] transition-all">
        
        {/* Header Bar: Close */}
        <div className="flex items-center justify-end mb-4">
          <button 
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-[#FAF5F3] text-[#6B6B6B] hover:text-[#A50D1A] hover:bg-[#FCEEEE] flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Logo */}
        <div className="flex justify-center mb-4">
          <IdhLogo />
        </div>

        {/* Modal Title & Subtitle */}
        {!submitted && (
          <div className="text-center mb-5">
            <h3 className="text-[22px] font-extrabold text-[#23161A]">
              {authTab === 'login' && 'Welcome back'}
              {authTab === 'signup' && 'Create your account'}
              {authTab === 'forgot' && 'Reset your password'}
            </h3>
            <p className="text-[13px] text-[#6B6B6B] mt-1">
              {authTab === 'login' && 'Access your exclusive IDH employee perks'}
              {authTab === 'signup' && 'Unlock every IDH perk in under a minute'}
              {authTab === 'forgot' && 'Enter your corporate email or employee ID'}
            </p>
          </div>
        )}

        {/* Tabs switcher */}
        {!submitted && authTab !== 'forgot' && (
          <div className="flex bg-[#FAF5F3] rounded-xl p-1 mb-5 border border-[#ECE1DE]">
            <button
              type="button"
              onClick={() => { setAuthTab('login'); setSubmitted(false); setAuthError(''); }}
              className={`flex-1 py-2 rounded-lg font-bold text-[13px] transition-all ${
                authTab === 'login' 
                  ? 'bg-white text-[#A50D1A] shadow-sm' 
                  : 'text-[#6B6B6B] hover:text-[#23161A]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setAuthTab('signup'); setSubmitted(false); setAuthError(''); }}
              className={`flex-1 py-2 rounded-lg font-bold text-[13px] transition-all ${
                authTab === 'signup' 
                  ? 'bg-white text-[#A50D1A] shadow-sm' 
                  : 'text-[#6B6B6B] hover:text-[#23161A]'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Error banner */}
        {authError && (() => {
          const isAlreadyRegistered = authError.toLowerCase().includes('already') || authError.toLowerCase().includes('registered') || authError.toLowerCase().includes('user already');
          return (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium animate-fadeIn overflow-hidden">
              <div className="flex items-center gap-2 px-3.5 py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{isAlreadyRegistered ? 'This email is already registered.' : authError}</span>
              </div>
              {isAlreadyRegistered && (
                <button
                  type="button"
                  onClick={() => { setAuthTab('login'); setAuthError(''); }}
                  className="w-full px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-t border-red-200"
                >
                  <span>Log in with this email instead</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })()}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* Signup Full Name */}
            {authTab === 'signup' && (
              <div>
                <label className="block text-[12px] font-bold text-[#23161A] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute top-3.5 left-3" />
                  <input
                    required
                    type="text"
                    placeholder="Employee full name"
                    value={formData.fullName}
                    onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); setAuthError(''); }}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#ECE1DE] focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-[13px] bg-[#FAF5F3]/30"
                  />
                </div>
              </div>
            )}

            {/* Department (Signup only) */}
            {authTab === 'signup' && (
              <div>
                <label className="block text-[12px] font-bold text-[#23161A] mb-1">
                  Department / Facility
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-400 absolute top-3.5 left-3" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#ECE1DE] focus:border-[#A50D1A] outline-none text-[13px] bg-[#FAF5F3]/30 appearance-none"
                  >
                    <option value="Al Mokhtabar">Al Mokhtabar</option>
                    <option value="Al Borg Laboratories">Al Borg Laboratories</option>
                    <option value="BioLab Jordan">BioLab</option>
                    <option value="IDH Corporate HQ">IDH Corporate HQ</option>
                  </select>
                </div>
              </div>
            )}

            {/* Work Email */}
            <div>
              <label className="block text-[12px] font-bold text-[#23161A] mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute top-3.5 left-3" />
                <input
                  required
                  type="email"
                  placeholder="name@idh.com"
                  value={formData.email}
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setAuthError(''); }}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#ECE1DE] focus:border-[#A50D1A] outline-none text-[13px] bg-[#FAF5F3]/30"
                />
              </div>
            </div>

            {/* Password Field (Login & Signup) */}
            {authTab !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[12px] font-bold text-[#23161A]">
                    Password
                  </label>
                  {authTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setAuthTab('forgot'); setAuthError(''); }}
                      className="text-[11px] font-bold text-[#A50D1A] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute top-3.5 left-3" />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setAuthError(''); }}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#ECE1DE] focus:border-[#A50D1A] outline-none text-[13px] bg-[#FAF5F3]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 mt-2 rounded-xl bg-[#A50D1A] hover:bg-[#880a15] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[14px] shadow-lg shadow-[#A50D1A]/30 transition-all flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {authTab === 'login' && 'Log In'}
                    {authTab === 'signup' && 'Create Account'}
                    {authTab === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {authTab === 'forgot' && (
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
                className="w-full text-center text-xs text-[#6B6B6B] hover:text-[#A50D1A] font-semibold mt-2"
              >
                ← Back to Login
              </button>
            )}

          </form>
        ) : (
          /* SUCCESS STATE */
          <div className="py-4 text-center space-y-4 animate-scaleUp">
            
            <div className="w-14 h-14 rounded-full bg-[#FCEEEE] text-[#A50D1A] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-extrabold text-[18px] text-[#23161A]">
                {authTab === 'forgot' ? 'Reset Link Sent!' : 'Authenticated Successfully!'}
              </h4>
              <p className="text-[13px] text-[#6B6B6B] mt-1">
                {authTab === 'forgot'
                  ? 'Please check your corporate email inbox to reset your password.'
                  : 'Welcome to your IDH exclusive perks dashboard.'}
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl bg-[#23161A] hover:bg-[#A50D1A] text-white text-[13px] font-bold transition-all shadow-md"
            >
              Explore IDH Benefits Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
