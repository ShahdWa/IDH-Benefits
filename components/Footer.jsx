'use client';

import IdhLogo from './IdhLogo';
import { ShieldCheck } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Restaurants',      category: 'restaurants' },
  { label: 'Travel & Tourism', category: 'travel' },
  { label: 'Electronics',      category: 'electronics' },
  { label: 'Health & Labs',    category: 'health' },
  { label: 'Services',         category: 'services' },
];

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-[#ECE1DE] text-[#6B6B6B] text-xs py-10 mt-12">
      <div className="max-w-[1100px] mx-auto px-6 space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          {/* Logo & Tagline */}
          <div className="space-y-2">
            <IdhLogo />
            <p className="text-[12px] text-[#6B6B6B] max-w-md">
              Integrated Diagnostics Holdings (IDH) — Al Mokhtabar, Al Borg Laboratories, BioLab & EchoScan Corporate Perks Platform.
            </p>
          </div>

          {/* Category Links */}
          <div className="flex flex-wrap gap-5 text-xs font-semibold text-[#23161A]">
            {NAV_LINKS.map(({ label, category }) => (
              <button
                key={category}
                type="button"
                onClick={() => onNavigate?.(category)}
                className="hover:text-[#A50D1A] transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                {label}
              </button>
            ))}
          </div>

        </div>

        {/* Bottom Rights & Compliance */}
        <div className="pt-6 border-t border-[#ECE1DE] flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-[#6B6B6B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A50D1A]" />
            <span>© 2026 Integrated Diagnostics Holdings (IDH). For verified employees only.</span>
          </div>

          <div className="font-semibold text-[#A50D1A]">
            <span>IDH Employee Benefits Portal</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
