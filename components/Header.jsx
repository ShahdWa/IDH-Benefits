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

            {/* ── My Family Panel ── */}
            {familyPanelOpen && (
              <div className="absolute right-0 top-full mt-2 w-[380px] z-50 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-xl border border-[#ECE1DE] overflow-hidden">
                  {/* Panel mini-header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#ECE1DE] bg-[#FAF5F3]">
                    <button
                      onClick={() => setFamilyPanelOpen(false)}
                      className="text-[11px] text-zinc-500 hover:text-[#A50D1A] font-semibold flex items-center gap-1 transition-colors"
                    >
                      ← Back
                    </button>
                    <p className="text-xs font-bold text-[#23161A]">My Family</p>
                    <button
                      onClick={() => { setFamilyPanelOpen(false); setProfileDropdownOpen(false); }}
                      className="text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Scrollable family list */}
                  <div className="max-h-[420px] overflow-y-auto">
                    <MyFamilySection />
                  </div>
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
          
          <div className="flex gap-2 pt-2 border-t border-[#ECE1DE]">
            {isLoggedIn ? (
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full py-2 text-center rounded-full bg-red-100 text-red-700 font-bold">Log Out ({user?.name})</button>
            ) : (
              <>
                <button onClick={() => { onOpenAuthModal('login'); setMobileMenuOpen(false); }} className="flex-1 py-2 text-center rounded-full border border-[#ECE1DE]">Login</button>
                <button onClick={() => { onOpenAuthModal('signup'); setMobileMenuOpen(false); }} className="flex-1 py-2 text-center rounded-full bg-[#A50D1A] text-white">Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
