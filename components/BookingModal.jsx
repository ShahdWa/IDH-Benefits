'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar, Phone, User, MapPin, Building2, Copy, Check, Users, ChevronDown } from 'lucide-react';
import IdhLogo from './IdhLogo';
import { useAuth } from '../context/AuthContext';
import { recordRedemption, getDependents } from '../lib/api';

export default function BookingModal({ isOpen, onClose, selectedBenefit }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [beneficiaryDropdownOpen, setBeneficiaryDropdownOpen] = useState(false);
  const [facilityDropdownOpen, setFacilityDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    facility: 'Al Mokhtabar Laboratories (معامل المختبر)',
    notes: '',
  });

  // Family-member selection state
  const [dependents, setDependents] = useState([]);
  const [selectedFor, setSelectedFor] = useState('myself'); // 'myself' | dependent.id

  const familyAllowed = selectedBenefit?.familyAllowed === true;

  // Fetch dependents when the modal opens and familyAllowed
  useEffect(() => {
    if (isOpen && familyAllowed) {
      getDependents().then((data) => {
        const activeOnly = (data || []).filter(
          (d) => d.isActive !== false && d.is_active !== false
        );
        setDependents(activeOnly);
      });
    }
  }, [isOpen, familyAllowed]);

  // Reset to myself if benefit changes / family not allowed
  useEffect(() => {
    if (!familyAllowed) setSelectedFor('myself');
  }, [familyAllowed]);

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

  // Only active dependents are eligible
  const activeDependents = dependents.filter(
    (d) => d.isActive !== false && d.is_active !== false
  );

  // Find the chosen dependent object (null = myself)
  const chosenDependent = selectedFor !== 'myself'
    ? activeDependents.find((d) => d.id === selectedFor) || null
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedBenefit) {
      await recordRedemption(
        selectedBenefit.id,
        selectedBenefit.titleEn || selectedBenefit.title || 'IDH Perk',
        user?.email || user?.name || 'Anonymous',
        chosenDependent?.id ?? null,
      );
    }
    setStep(2);
  };

  const handleReset = () => {
    setStep(1);
    setCopied(false);
    setSelectedFor('myself');
    onClose();
  };

  const handleCopyVoucher = () => {
    if (selectedBenefit?.code) {
      navigator.clipboard.writeText(selectedBenefit.code);
      setCopied(true);
      recordRedemption(
        selectedBenefit.id,
        selectedBenefit.titleEn,
        user?.email || user?.name || 'Anonymous',
        chosenDependent?.id ?? null,
      );
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Name shown on the voucher
  const voucherHolderName = chosenDependent
    ? `${chosenDependent.full_name} (via ${user?.name || 'IDH Employee'})`
    : formData.fullName || 'IDH Employee';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#23161A]/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[24px] border border-[#ECE1DE] shadow-2xl overflow-hidden relative">

        {/* Modal Header */}
        <div className="p-5 border-b border-[#ECE1DE] bg-[#FAF5F3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IdhLogo className="h-8" />
            <div className="hidden sm:block border-l border-[#ECE1DE] pl-3">
              <h3 className="text-xs font-bold text-[#23161A]">Employee Benefits</h3>
              <p className="text-[10px] text-[#6B6B6B]">Digital Voucher</p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#FCEEEE] text-[#6B6B6B] hover:text-[#A50D1A] flex items-center justify-center transition-colors border border-[#ECE1DE]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {step === 1 ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">

            {/* Benefit Summary Card */}
            {selectedBenefit && (
              <div className="p-4 rounded-2xl bg-[#FAF5F3] border border-[#ECE1DE] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#A50D1A] bg-[#FCEEEE] px-2.5 py-0.5 rounded-full">
                    {selectedBenefit.brandName}
                  </span>
                  <span className="text-xs font-extrabold text-[#A50D1A]">
                    {selectedBenefit.discount}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#23161A]">{selectedBenefit.titleEn}</h4>
                <p className="text-xs text-[#6B6B6B]">{selectedBenefit.titleAr}</p>
                {familyAllowed && (
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Users className="w-3 h-3" /> Family members can redeem this benefit
                  </p>
                )}
              </div>
            )}

            {/* ── Who is this for? (only if familyAllowed) */}
            {familyAllowed && (
              <div className="relative">
                <label className="block text-[12px] font-bold text-[#23161A] mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#A50D1A]" /> Who is this for?
                </label>

                {/* Custom Trigger */}
                <button
                  type="button"
                  onClick={() => setBeneficiaryDropdownOpen(!beneficiaryDropdownOpen)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECE1DE] hover:border-[#A50D1A] focus:border-[#A50D1A] outline-none text-xs bg-[#FAF5F3]/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-[#23161A] truncate">
                    {selectedFor === 'myself'
                      ? `Myself (${formData.fullName || user?.name || 'Employee'})`
                      : chosenDependent
                        ? `${chosenDependent.full_name} (${chosenDependent.relationship})`
                        : 'Select Beneficiary'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${beneficiaryDropdownOpen ? 'rotate-180 text-[#A50D1A]' : ''}`} />
                </button>

                {/* Custom Options List (Brand Colors, No Blue Highlight) */}
                {beneficiaryDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-[#ECE1DE] shadow-xl z-20 py-1 overflow-hidden animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFor('myself');
                        setBeneficiaryDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${selectedFor === 'myself'
                          ? 'bg-[#FCEEEE] text-[#A50D1A] font-bold'
                          : 'text-[#23161A] hover:bg-[#FAF5F3] hover:text-[#A50D1A]'
                        }`}
                    >
                      <span>Myself ({formData.fullName || user?.name || 'Employee'})</span>
                      {selectedFor === 'myself' && <Check className="w-3.5 h-3.5 text-[#A50D1A]" />}
                    </button>

                    {activeDependents.map((dep) => {
                      const isSelected = selectedFor === dep.id;
                      return (
                        <button
                          key={dep.id}
                          type="button"
                          onClick={() => {
                            setSelectedFor(dep.id);
                            setBeneficiaryDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${isSelected
                              ? 'bg-[#FCEEEE] text-[#A50D1A] font-bold'
                              : 'text-[#23161A] hover:bg-[#FAF5F3] hover:text-[#A50D1A]'
                            }`}
                        >
                          <span>{dep.full_name} ({dep.relationship})</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#A50D1A]" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeDependents.length === 0 && (
                  <p className="text-[10px] text-zinc-400 mt-1">
                    No active family members available — check your profile or contact HR.
                  </p>
                )}
              </div>
            )}

            {/* Employee Full Name */}
            <div>
              <label className="block text-[12px] font-bold text-[#23161A] mb-1">Employee Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <input
                  required
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#ECE1DE] focus:border-[#A50D1A] outline-none text-xs bg-[#FAF5F3]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#23161A] mb-1">Phone Number for Voucher Confirmation</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <input
                  required
                  type="tel"
                  placeholder="010xxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#ECE1DE] focus:border-[#A50D1A] outline-none text-xs bg-[#FAF5F3]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#23161A] mb-1">IDH Branch / Facility</label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <select
                  value={formData.facility}
                  onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#ECE1DE] focus:border-[#A50D1A] outline-none text-xs bg-[#FAF5F3]/40 appearance-none"
                >
                  <option value="Al Mokhtabar">Al Mokhtabar Laboratories (معامل المختبر)</option>
                  <option value="Al Borg Laboratories">Al Borg Laboratories (معامل البرج)</option>
                  <option value="BioLab Jordan">BioLab Jordan (الأردن)</option>
                  <option value="IDH Corporate HQ">IDH Corporate HQ (المقر الرئيسي)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-xl bg-[#A50D1A] hover:bg-[#880a15] text-white font-bold text-xs shadow-md shadow-[#A50D1A]/30 transition-all"
            >
              Generate Corporate Digital Voucher
            </button>
          </form>
        ) : (
          /* SUCCESS VOUCHER GENERATED STATE */
          <div className="p-6 text-center space-y-4 animate-scaleUp">

            <div className="w-14 h-14 rounded-full bg-[#FCEEEE] text-[#A50D1A] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-extrabold text-base text-[#23161A]">Voucher Generated Successfully!</h4>
              <p className="text-xs text-[#6B6B6B] mt-1">Show this digital voucher code at partner checkout.</p>
            </div>

            {/* Generated Voucher Ticket Card */}
            <div className="bg-gradient-to-br from-[#23161A] to-[#3D252D] text-white p-5 rounded-2xl relative overflow-hidden shadow-lg border border-[#A50D1A]/30 space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Official IDH Benefit Voucher</span>
                <span className="text-[10px] font-bold text-[#F5C2A5]">{selectedBenefit?.discount || 'Special Discount'}</span>
              </div>

              <div className="text-left">
                <div className="text-xs text-white/70">{selectedBenefit?.brandName}</div>
                <div className="text-sm font-bold text-white">{selectedBenefit?.titleEn}</div>
              </div>

              {/* ── Clear Beneficiary Identification Banner ── */}
              <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-left flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#A50D1A] border border-white/20 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] text-white/60 font-semibold uppercase tracking-wider">Voucher For</div>
                  <div className="text-sm font-extrabold text-[#F5C2A5] truncate">
                    {chosenDependent
                      ? `${chosenDependent.full_name} (${chosenDependent.relationship})`
                      : `Myself — ${formData.fullName || user?.name || 'IDH Employee'}`}
                  </div>
                  {chosenDependent && (
                    <div className="text-[10px] text-white/60 mt-0.5 truncate">
                      Employee Sponsor: {formData.fullName || user?.name || 'IDH Employee'}
                    </div>
                  )}
                </div>
              </div>

              {/* Code Banner */}
              <div className="p-3 bg-white/10 rounded-xl border border-white/15 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[9px] text-white/50">VOUCHER CODE</div>
                  <div className="text-base font-mono font-extrabold tracking-widest text-[#F5C2A5]">
                    {selectedBenefit?.code || 'IDH-2026-PERK'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyVoucher}
                  className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Facility & Validity Info */}
              <div className="flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-white/10">
                <span>Branch: <strong className="text-white/80">{formData.facility}</strong></span>
                <span>Valid: <strong className="text-white/80">{selectedBenefit?.validUntil || '2026-12-31'}</strong></span>
              </div>
            </div>

            {/* Action button: Done & Close */}
            <div className="pt-1">
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-[#23161A] hover:bg-black text-white text-xs font-bold transition-all shadow-md"
              >
                Done & Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
