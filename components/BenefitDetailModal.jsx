'use client';

import { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, FileText, PhoneCall, Sparkles } from 'lucide-react';

export default function BenefitDetailModal({ benefit, onClose, onOpenBooking }) {
  useEffect(() => {
    if (benefit) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [benefit]);

  if (!benefit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#23161A]/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-[20px] border border-[#ECE1DE] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#ECE1DE] bg-[#FAF5F3] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FCEEEE] text-[#A50D1A]">
                {benefit.brandName}
              </span>
              <span className="text-xs font-mono text-[#6B6B6B]">
                Code: {benefit.code}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#23161A]">{benefit.titleEn}</h2>
            <p className="text-xs text-[#6B6B6B]">{benefit.titleAr}</p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white text-[#6B6B6B] hover:text-[#A50D1A] transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#23161A]">
          
          {/* Price & Discount Banner */}
          <div className="p-4 rounded-[14px] bg-[#FCEEEE] border border-[#D97E85]/40 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-[#6B6B6B]">Exclusive Employee Discount</div>
              <div className="text-xl font-black text-[#A50D1A]">{benefit.discount}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[#6B6B6B]">Validity Period</div>
              <div className="text-xs font-bold text-[#23161A]">Valid until {benefit.validUntil}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-[#A50D1A] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Offer Details & Features</span>
            </h4>
            <p className="leading-relaxed bg-[#FAF5F3] p-3.5 rounded-[12px] border border-[#ECE1DE] text-[#6B6B6B]">
              {benefit.descriptionEn}
              <br />
              <span className="text-[11px] mt-1 block">{benefit.descriptionAr}</span>
            </p>
          </div>

          {/* Terms & How to Redeem */}
          <div>
            <h4 className="font-bold text-[#A50D1A] mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Terms & Redemption Instructions</span>
            </h4>
            <div className="p-3.5 rounded-[12px] bg-[#FAF5F3] border border-[#ECE1DE] text-[#6B6B6B] leading-relaxed">
              <p className="font-semibold text-[#23161A] mb-1">{benefit.termsEn}</p>
              <p className="text-[11px]">{benefit.termsAr}</p>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-[#ECE1DE] bg-[#FAF5F3] flex items-center justify-between gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white border border-[#ECE1DE] text-[#6B6B6B] hover:text-[#23161A] text-xs font-bold"
          >
            Close
          </button>

          <button 
            onClick={() => { onClose(); onOpenBooking(benefit); }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A50D1A] hover:bg-[#6E0E17] text-white font-bold text-xs shadow-lg shadow-[#A50D1A]/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Redeem Offer Now</span>
          </button>
        </div>

      </div>
    </div>
  );
}
