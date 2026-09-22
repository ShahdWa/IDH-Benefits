'use client';

// app/page.js
// Main entry point — renders AuthGate when logged out, or the full dashboard when logged in.

import { useState, useMemo, useEffect } from 'react';

import Header           from '../components/Header';
import HeroSection      from '../components/HeroSection';
import CategoryGrid     from '../components/CategoryGrid';
import DealsList        from '../components/DealsList';
import CategoryDetailView from '../components/CategoryDetailView';
import AuthGate         from '../components/AuthGate';
import AuthModal        from '../components/AuthModal';
import BenefitDetailModal from '../components/BenefitDetailModal';
import BookingModal     from '../components/BookingModal';
import Footer           from '../components/Footer';

import { getBenefits, getCategories } from '../lib/api';
import { useAuth }                    from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────
// Home page
// ─────────────────────────────────────────────────────────────

export default function Home() {
  const { isLoggedIn, login, signup } = useAuth();

  // ── Data state ──────────────────────────────────────────────
  const [categories,   setCategories]   = useState([]);
  const [allBenefits,  setAllBenefits]  = useState([]);
  const [dataLoading,  setDataLoading]  = useState(true);

  // ── Dashboard navigation state ───────────────────────────────
  const [activeTab,         setActiveTab]         = useState('home');
  const [searchTerm,        setSearchTerm]        = useState('');
  const [selectedCategory,  setSelectedCategory]  = useState('all');

  // ── Modal state ──────────────────────────────────────────────
  const [authModalOpen,       setAuthModalOpen]       = useState(false);
  const [authMode,            setAuthMode]            = useState('login');
  const [selectedBenefit,     setSelectedBenefit]     = useState(null);
  const [bookingModalOpen,    setBookingModalOpen]     = useState(false);
  const [bookingBenefit,      setBookingBenefit]      = useState(null);

  // ── Data fetching ────────────────────────────────────────────

  useEffect(() => {
    Promise.all([getCategories(), getBenefits()]).then(([cats, bens]) => {
      if (cats?.length) setCategories(cats);
      if (bens?.length) setAllBenefits(bens);
      setDataLoading(false);
    });
  }, []);

  // ── Derived / filtered data ──────────────────────────────────

  const filteredBenefits = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allBenefits.filter((b) => {
      const matchCat    = selectedCategory === 'all' || b.category === selectedCategory;
      const matchSearch = !term ||
        b.titleEn.toLowerCase().includes(term)    ||
        b.titleAr.toLowerCase().includes(term)    ||
        b.brandName.toLowerCase().includes(term)  ||
        b.code.toLowerCase().includes(term)       ||
        b.category.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchTerm, allBenefits]);

  const totalMatchCount = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return (categories.length || 6) + allBenefits.length;

    const catMatches = categories.filter((c) =>
      `${c.nameEn || ''} ${c.subtitleEn || ''} ${c.id}`.toLowerCase().includes(term)
    ).length;

    return catMatches + filteredBenefits.length;
  }, [searchTerm, filteredBenefits, allBenefits, categories]);

  // ── Event handlers ───────────────────────────────────────────

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setSelectedCategory('all');
      setSearchTerm('');
    } else {
      setSelectedCategory(tab);
    }
  };

  const handleOpenAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenBooking = (benefit = null) => {
    setBookingBenefit(benefit);
    setBookingModalOpen(true);
  };

  const handleResetCategory = () => {
    setSelectedCategory('all');
    setActiveTab('home');
  };

  const handleFooterNavigate = (cat) => {
    setSelectedCategory(cat);
    setActiveTab(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Render: unauthenticated ──────────────────────────────────

  if (!isLoggedIn) {
    return (
      <AuthGate
        login={login}
        signup={signup}
        categoriesCount={categories.length}
        benefitsCount={allBenefits.length}
      />
    );
  }

  // ── Render: authenticated dashboard ─────────────────────────

  return (
    <div className="min-h-screen bg-[#FAF5F3] text-[#23161A] flex flex-col font-sans selection:bg-[#FCEEEE] selection:text-[#A50D1A]">

      <Header
        onOpenAuthModal={handleOpenAuthModal}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      <main className="flex-1 space-y-2">
        {selectedCategory !== 'all' ? (
          <CategoryDetailView
            categoryId={selectedCategory}
            categories={categories}
            benefits={allBenefits}
            onSelectBenefit={setSelectedBenefit}
            onResetCategory={handleResetCategory}
          />
        ) : (
          <>
            <HeroSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              matchCount={totalMatchCount}
            />
            <CategoryGrid
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
            />
            <DealsList
              benefits={filteredBenefits}
              onSelectBenefit={setSelectedBenefit}
              onOpenBooking={handleOpenBooking}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />

      {selectedBenefit && (
        <BenefitDetailModal
          benefit={selectedBenefit}
          onClose={() => setSelectedBenefit(null)}
          onOpenBooking={handleOpenBooking}
        />
      )}

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedBenefit={bookingBenefit}
      />

      <Footer onNavigate={handleFooterNavigate} />
    </div>
  );
}
