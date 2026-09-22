'use client';

// components/CategoryGrid.jsx
// Renders the bento-style category grid on the home dashboard.
// Supports live search filtering and a "New Benefits" feature banner.

import { Sparkles, ArrowRight } from 'lucide-react';
import { getCategoryIcon }      from '../lib/iconMap';
import { DEFAULT_CATEGORIES }   from '../lib/api';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Determine the Tailwind column-span class for a category card.
 * Falls back to a repeating bento pattern if not set in the DB.
 */
function resolveSpan(cat, index) {
  if (cat.span) return cat.span;
  if (index === 0) return 'col-span-6 md:col-span-2';
  if (index === 1) return 'col-span-6 md:col-span-4';
  return 'col-span-6 md:col-span-3';
}

/** Return true if the category matches the current search query. */
function matchesQuery(cat, title, subtitle, query) {
  if (!query) return true;
  return (
    title.toLowerCase().includes(query)          ||
    subtitle.toLowerCase().includes(query)       ||
    cat.id.toLowerCase().includes(query)         ||
    (cat.nameAr   && cat.nameAr.toLowerCase().includes(query))   ||
    (cat.keywords && cat.keywords.some((k) => k.toLowerCase().includes(query)))
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function CategoryCard({ cat, index, isSelected, onSelect }) {
  const IconComp = getCategoryIcon(cat.icon);
  const title    = cat.nameEn || cat.title || cat.name || cat.id;
  const subtitle = cat.subtitleEn || cat.subtitle || 'Exclusive corporate discounts.';
  const span     = resolveSpan(cat, index);

  return (
    <div
      key={cat.id}
      onClick={() => onSelect(isSelected ? 'all' : cat.id)}
      className={`bento-card ${span} transition-all duration-200 cursor-pointer ${
        isSelected ? '!border-[#A50D1A] !bg-[#FCEEEE]/40 ring-2 ring-[#A50D1A]' : ''
      }`}
    >
      <div className="bento-card-icon">
        <IconComp className="w-5 h-5 text-[#A50D1A]" />
      </div>
      <div>
        <h3 className="card-label font-bold text-[17px] text-[#23161A]">{title}</h3>
        <p className="card-tag font-medium text-[13px] text-[#6B6B6B] mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function NewBenefitsBanner({ isSelected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(isSelected ? 'all' : 'new')}
      className={`bento-card feature col-span-6 cursor-pointer ${
        isSelected ? 'ring-2 ring-white/80' : ''
      }`}
    >
      <div className="space-y-1">
        <div className="bento-card-icon">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="card-label text-xl font-bold text-white">New Benefits</h3>
        <p className="card-tag text-sm text-white/80">Fresh offers added every week</p>
      </div>
      <div className="feature-arrow">
        <ArrowRight className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

export default function CategoryGrid({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  searchTerm = '',
}) {
  const query = searchTerm.toString().toLowerCase().trim();
  const list  = categories?.length ? categories : DEFAULT_CATEGORIES;

  return (
    <div id="categories-section" className="max-w-[1100px] mx-auto px-6 pb-8 mt-6">
      <div className="grid grid-cols-6 gap-4">

        {list.map((cat, idx) => {
          const title    = cat.nameEn || cat.title || cat.name || cat.id;
          const subtitle = cat.subtitleEn || cat.subtitle || 'Exclusive corporate discounts.';

          if (!matchesQuery(cat, title, subtitle, query)) return null;

          return (
            <CategoryCard
              key={cat.id}
              cat={cat}
              index={idx}
              isSelected={selectedCategory === cat.id}
              onSelect={setSelectedCategory}
            />
          );
        })}

        {/* "New Benefits" feature banner — hidden during search */}
        {!query && (
          <NewBenefitsBanner
            isSelected={selectedCategory === 'new'}
            onSelect={setSelectedCategory}
          />
        )}

      </div>
    </div>
  );
}
