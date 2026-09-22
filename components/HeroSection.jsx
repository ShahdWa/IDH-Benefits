'use client';

import { Search } from 'lucide-react';

export default function HeroSection({ searchTerm, setSearchTerm, matchCount = 6 }) {
  return (
    <section className="max-w-[1100px] mx-auto pt-16 pb-8 px-6 text-center">
      
      {/* Eyebrow Pill */}
      <div className="eyebrow">
        For IDH employees only
      </div>

      {/* Hero Headline */}
      <h1 className="display text-4xl sm:text-5xl md:text-[52px] font-bold tracking-tight leading-[1.15] mb-4 mt-6 text-[#23161A]">
        More perks for our team, <br />
        <span className="text-[#A50D1A]">all in one place</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-[18px] text-[#6B6B6B] max-w-[520px] mx-auto font-normal">
        Exclusive discounts on restaurants, travel, health and more — built around you.
      </p>

      {/* Search Wrap */}
      <div className="max-w-[640px] mx-auto mt-9 animate-rise">
        <div className="flex items-center gap-3 bg-white border-[1.5px] border-[#ECE1DE] focus-within:border-[#A50D1A] focus-within:ring-4 focus-within:ring-[#A50D1A]/10 rounded-full px-5 py-3.5 transition-all shadow-sm">
          <Search className="w-5 h-5 text-[#6B6B6B] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search benefits — try 'travel' or 'health'"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-none outline-none text-[15px] bg-transparent text-[#23161A] placeholder-[#A79A97]"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-xs font-bold text-[#6B6B6B] hover:text-[#A50D1A] px-2"
            >
              Clear
            </button>
          )}
        </div>

        <div className="text-[13px] text-[#6B6B6B] text-center mt-3 min-h-[18px]">
          Showing <b className="text-[#A50D1A] font-bold">{matchCount}</b> benefits
        </div>
      </div>

    </section>
  );
}
