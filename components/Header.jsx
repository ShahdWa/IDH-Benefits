'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import IdhLogo from './IdhLogo';
import MyFamilySection from './MyFamilySection';
import { Menu, X, LogOut, ChevronDown, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onOpenAuthModal, activeTab, setActiveTab }) {
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen]           = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [familyPanelOpen, setFamilyPanelOpen]         = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
        setFamilyPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#ECE1DE] px-6 sm:px-12 py-4 flex items-center justify-between">
      
      {/* LOGO */}
      <div className="flex items-center">
        <button onClick={() => setActiveTab('home')} className="text-left group focus:outline-none">
          <IdhLogo />
        </button>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8 font-semibold text-[#6B6B6B] text-[15px]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`hover:text-[#A50D1A] transition-colors ${activeTab === 'home' ? 'text-[#A50D1A] font-bold' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab('restaurants')}
          className={`hover:text-[#A50D1A] transition-colors ${activeTab === 'restaurants' ? 'text-[#A50D1A] font-bold' : ''}`}
        >
          Restaurants
        </button>
        <button 
          onClick={() => {
            setActiveTab('home');
            setTimeout(() => {
              document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          }}
          className="hover:text-[#A50D1A] transition-colors"
        >
          More
        </button>
      </nav>

      {/* Header Actions */}
      <div className="hidden sm:flex items-center gap-3">
        {isLoggedIn ? (
          /* Logged In Profile Menu */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); setFamilyPanelOpen(false); }}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-[#ECE1DE] hover:border-[#A50D1A] bg-[#FAF5F3] transition-all group"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-[#A50D1A]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#A50D1A] text-white flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-[#23161A] line-clamp-1">{user?.name || 'IDH Employee'}</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* ── Main Dropdown Menu ── */}
            {profileDropdownOpen && !familyPanelOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#ECE1DE] p-3 space-y-2 z-50 animate-fadeIn">
                {/* User info card */}
                <div className="p-3 bg-[#FAF5F3] rounded-xl border border-[#ECE1DE] space-y-0.5">
                  <div className="text-xs font-bold text-[#23161A]">{user?.name || 'IDH Employee'}</div>
                  <div className="text-xs text-zinc-600">{user?.department || 'IDH Corporate'}</div>
                  <div className="text-[11px] text-zinc-400 truncate">{user?.email}</div>
                </div>

                <div className="space-y-1">
                  {/* My Family */}
                  <button
                    onClick={() => setFamilyPanelOpen(true)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#23161A] hover:bg-[#FAF5F3] flex items-center gap-2 transition-colors"
                  >
                    <Users className="w-4 h-4 text-[#A50D1A]" />
                    <span>My Family</span>
                  </button>

                  {/* Admin Dashboard */}
                  {user?.isAdmin && (
                    <Link 
                      href="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#A50D1A] hover:bg-[#FCEEEE] flex items-center gap-2 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#A50D1A]" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                </div>

                <div className="border-t border-[#ECE1DE] pt-1">
                  <button 
                    onClick={() => { logout(); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}


          </div>
        ) : (
          /* Logged Out Buttons */
          <>
            <button 
              onClick={() => onOpenAuthModal('login')}
              className="px-5 py-2.5 rounded-full font-semibold text-sm border border-[#ECE1DE] text-[#23161A] hover:border-[#A50D1A] hover:text-[#A50D1A] transition-all"
            >
              Login
            </button>
            <button 
              onClick={() => onOpenAuthModal('signup')}
              className="px-6 py-2.5 rounded-full font-semibold text-sm bg-[#A50D1A] text-white shadow-lg shadow-[#A50D1A]/30 hover:scale-[1.02] transition-all"
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 rounded-xl bg-zinc-100 text-zinc-700"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-[#ECE1DE] p-4 flex flex-col gap-3 font-semibold text-sm md:hidden z-50">
          <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className="text-left py-2 hover:text-[#A50D1A]">Home</button>
          <button onClick={() => { setActiveTab('restaurants'); setMobileMenuOpen(false); }} className="text-left py-2 hover:text-[#A50D1A]">Restaurants</button>
          <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); setTimeout(() => { document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }} className="text-left py-2 hover:text-[#A50D1A]">More</button>
          
          <div className="pt-2 border-t border-[#ECE1DE]">
            {isLoggedIn ? (
              <div className="space-y-3">
                {/* Mobile Profile Card */}
                <div className="p-3 bg-[#FAF5F3] rounded-xl border border-[#ECE1DE] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#A50D1A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#23161A] truncate">{user?.name || 'IDH Employee'}</div>
                    <div className="text-[11px] text-zinc-600 truncate">{user?.department || 'IDH Corporate'}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{user?.email}</div>
                  </div>
                </div>

                {/* Mobile My Family Button */}
                <button
                  onClick={() => { setFamilyPanelOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#23161A] bg-[#FAF5F3] hover:bg-[#FCEEEE] flex items-center justify-between transition-colors border border-[#ECE1DE]"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#A50D1A]" />
                    <span>My Family (إدارة العائلة)</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 -rotate-90" />
                </button>

                {/* Admin Link if Admin */}
                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#A50D1A] bg-[#FCEEEE] flex items-center gap-2 transition-colors border border-[#D97E85]/30"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#A50D1A]" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { onOpenAuthModal('login'); setMobileMenuOpen(false); }} className="flex-1 py-2 text-center rounded-full border border-[#ECE1DE] text-xs font-bold">Login</button>
                <button onClick={() => { onOpenAuthModal('signup'); setMobileMenuOpen(false); }} className="flex-1 py-2 text-center rounded-full bg-[#A50D1A] text-white text-xs font-bold">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── My Family Modal (Responsive on Mobile & Desktop) ── */}
      {familyPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#23161A]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-2xl border border-[#ECE1DE] overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECE1DE] bg-[#FAF5F3]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#A50D1A]" />
                <h3 className="text-sm font-extrabold text-[#23161A]">My Family (أفراد العائلة)</h3>
              </div>
              <button
                onClick={() => setFamilyPanelOpen(false)}
                className="p-1.5 rounded-full bg-white text-zinc-400 hover:text-[#A50D1A] transition-colors shadow-sm border border-[#ECE1DE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[72vh]">
              <MyFamilySection />
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
