// components/CategoryDetailView.jsx
// Renders the full detail view for a selected category:
//   breadcrumb → hero title → search + filter row → partner card grid → (health) branch locator.

import { useState, useMemo } from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { getCategoryIcon } from '../lib/iconMap';
import { DEFAULT_CATEGORIES } from '../lib/api';
import BranchLocator from './BranchLocator';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const SUB_FILTERS = ['All', 'Cairo', 'Alexandria', 'Delivery only', 'Fine dining'];

const FALLBACK_CATEGORY = {
  id:         'new',
  nameEn:     'New Benefits',
  subtitleEn: 'Fresh offers and newly added corporate perks this week.',
  icon:       'Sparkles',
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Resolve category metadata from props or fall back to defaults. */
function resolveCategory(categoryId, categories) {
  if (categoryId === 'new') return FALLBACK_CATEGORY;

  const list = categories?.length ? categories : DEFAULT_CATEGORIES;
  return (
    list.find((c) => c.id === categoryId) ?? {
      id:         categoryId,
      nameEn:     categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Category',
      subtitleEn: 'Explore exclusive corporate discounts for IDH team.',
      icon:       'Sparkles',
    }
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function Breadcrumb({ categoryName, onHome }) {
  return (
    <nav className="flex items-center gap-2 text-xs font-semibold text-[#6B6B6B]">
      <button type="button" onClick={onHome} className="hover:text-[#A50D1A] transition-colors">
        Home
      </button>
      <span className="text-[#ECE1DE]">/</span>
      <span className="text-[#23161A] font-bold">{categoryName}</span>
    </nav>
  );
}

function CategoryHero({ category, IconComp }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[#FCEEEE] border border-[#A50D1A]/20 flex items-center justify-center text-[#A50D1A] shadow-sm flex-shrink-0">
        <IconComp className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#23161A] tracking-tight">
          {category.nameEn}
        </h1>
        <p className="text-sm text-[#6B6B6B] font-medium max-w-xl">
          {category.subtitleEn}
        </p>
      </div>
    </div>
  );
}

function SearchAndFilters({ search, onSearch, onClear, activeFilter, onFilter }) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

      {/* Search input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search partners"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#ECE1DE] focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none text-xs sm:text-sm bg-white shadow-xs"
        />
        {search && (
          <button
            onClick={onClear}
            className="absolute right-3 top-2.5 text-xs font-bold text-zinc-400 hover:text-[#A50D1A]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {SUB_FILTERS.map((sub) => (
          <button
            key={sub}
            type="button"
            onClick={() => onFilter(sub)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              activeFilter === sub
                ? 'bg-[#23161A] text-white border-[#23161A] shadow-sm'
                : 'bg-white text-[#6B6B6B] border-[#ECE1DE] hover:border-[#A50D1A] hover:text-[#A50D1A]'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}

function BenefitCard({ benefit, onSelect }) {
  const initials = benefit.badge || (benefit.brandName
    ? benefit.brandName.substring(0, 2).toUpperCase()
    : 'IDH');

  return (
    <div
      onClick={() => onSelect(benefit)}
      className="bg-white rounded-[22px] border border-[#ECE1DE] p-6 hover:border-[#A50D1A] hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4"
    >
      {/* Brand badge + discount pill */}
      <div className="flex items-center justify-between gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#A50D1A] text-white flex items-center justify-center font-extrabold text-sm shadow-md group-hover:scale-105 transition-transform">
          {initials}
        </div>
        <span className="px-3 py-1 rounded-full bg-[#FCEEEE] text-[#A50D1A] text-xs font-extrabold border border-[#D97E85]/20">
          {benefit.discount}
        </span>
      </div>

      {/* Title + description */}
      <div className="space-y-1.5 flex-1">
        <h3 className="text-lg font-extrabold text-[#23161A] group-hover:text-[#A50D1A] transition-colors leading-snug">
          {benefit.titleEn}
        </h3>
        <p className="text-xs text-[#6B6B6B] leading-relaxed line-clamp-2">
          {benefit.descriptionEn}
        </p>
      </div>

      {/* Footer: location + CTA */}
      <div className="pt-3 border-t border-[#ECE1DE] flex items-center justify-between gap-2 text-xs font-medium">
        <div className="flex items-center gap-1 text-[#6B6B6B]">
          <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          <span className="truncate">{benefit.location || 'Cairo, Egypt'}</span>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSelect(benefit); }}
          className="font-extrabold text-[#A50D1A] hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View offer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="col-span-full py-16 text-center space-y-3 bg-white rounded-3xl border border-[#ECE1DE] p-8">
      <div className="w-12 h-12 rounded-full bg-[#FAF5F3] text-zinc-400 flex items-center justify-center mx-auto">
        <Search className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-[#23161A]">No partner deals found</h3>
      <p className="text-xs text-[#6B6B6B]">
        Try adjusting your search query or selecting a different filter pill.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-5 py-2 rounded-full bg-[#A50D1A] text-white text-xs font-bold shadow-sm"
      >
        Reset Filters
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

export default function CategoryDetailView({
  categoryId,
  categories = [],
  benefits = [],
  onSelectBenefit,
  onResetCategory,
}) {
  const [partnerSearch,   setPartnerSearch]   = useState('');
  const [activeSubFilter, setActiveSubFilter] = useState('All');

  const currentCategory = useMemo(
    () => resolveCategory(categoryId, categories),
    [categoryId, categories],
  );

  const IconComp = getCategoryIcon(currentCategory.icon);

  const categoryBenefits = useMemo(() => {
    const term = partnerSearch.trim().toLowerCase();

    return benefits.filter((b) => {
      const matchCat = categoryId === 'all'
        ? true
        : categoryId === 'new'
        ? true                          // show all for "new" tab
        : b.category === categoryId;

      const matchSearch = !term ||
        b.titleEn.toLowerCase().includes(term)    ||
        b.titleAr.toLowerCase().includes(term)    ||
        b.brandName.toLowerCase().includes(term)  ||
        (b.location && b.location.toLowerCase().includes(term));

      const matchSub = activeSubFilter === 'All' ||
        (b.subcat   && b.subcat.toLowerCase()   === activeSubFilter.toLowerCase()) ||
        (b.location && b.location.toLowerCase().includes(activeSubFilter.toLowerCase()));

      return matchCat && matchSearch && matchSub;
    });
  }, [categoryId, benefits, partnerSearch, activeSubFilter]);

  const handleReset = () => {
    setPartnerSearch('');
    setActiveSubFilter('All');
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-8 animate-fadeIn font-sans">

      <Breadcrumb categoryName={currentCategory.nameEn} onHome={onResetCategory} />

      <CategoryHero category={currentCategory} IconComp={IconComp} />

      <SearchAndFilters
        search={partnerSearch}
        onSearch={setPartnerSearch}
        onClear={() => setPartnerSearch('')}
        activeFilter={activeSubFilter}
        onFilter={setActiveSubFilter}
      />

      {/* Partner cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {categoryBenefits.length > 0 ? (
          categoryBenefits.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} onSelect={onSelectBenefit} />
          ))
        ) : (
          <EmptyState onReset={handleReset} />
        )}
      </div>

      {/* Branch locator — health category only */}
      {categoryId === 'health' && (
        <div className="pt-6 border-t border-[#ECE1DE]">
          <BranchLocator />
        </div>
      )}
    </div>
  );
}
