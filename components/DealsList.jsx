'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function DealsList({ benefits, onSelectBenefit, onOpenBooking }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCode = (id, code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#23161A]">
          Available Deals ({benefits.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {benefits.map((benefit) => (
          <div 
            key={benefit.id}
            onClick={() => onSelectBenefit(benefit)}
            className="bento-card !justify-between space-y-4 group cursor-pointer"
          >
            <div>
              {/* Header Badges with IDH Red Palette */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FCEEEE] text-[#A50D1A]">
                  {benefit.brandName}
                </span>

                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FCEEEE] text-[#A50D1A] border border-[#D97E85]/30">
                  {benefit.discount}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[16px] font-bold text-[#23161A] group-hover:text-[#A50D1A] transition-colors mb-1 leading-snug">
                {benefit.titleEn}
              </h3>
              <p className="text-xs text-[#6B6B6B] font-medium mb-3">
                {benefit.titleAr}
              </p>

              {/* Description */}
              <p className="text-xs text-[#6B6B6B] line-clamp-2 leading-relaxed mb-3">
                {benefit.descriptionEn}
              </p>
            </div>

            {/* Footer with Code & Action */}
            <div className="pt-3 border-t border-[#ECE1DE] flex items-center justify-between gap-2">
              <button
                onClick={(e) => handleCopyCode(benefit.id, benefit.code, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF5F3] hover:bg-[#FCEEEE] text-[#23161A] text-xs font-mono font-bold border border-[#ECE1DE] transition-colors"
                title="Click to copy voucher code"
              >
                {copiedId === benefit.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#6B6B6B]" />
                    <span>{benefit.code}</span>
                  </>
                )}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); onOpenBooking(benefit); }}
                className="px-4 py-1.5 rounded-full bg-[#A50D1A] hover:bg-[#6E0E17] text-white text-xs font-bold shadow-md shadow-[#A50D1A]/30 transition-all"
              >
                Redeem
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
