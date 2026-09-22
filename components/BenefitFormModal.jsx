'use client';

// components/BenefitFormModal.jsx
// Modal form for creating or editing a perk row in the `perks` table.
// Props:
//   mode        : 'add' | 'edit'
//   initialData : object – pre-populated row (used in edit mode)
//   onClose     : () => void
//   onSaved     : () => void  – called after a successful save

import { useState } from 'react';
import { createBenefit, updateBenefit } from '../lib/api';

const EMPTY = {
  title:          '',
  title_en:       '',
  title_ar:       '',
  category:       '',
  subcat:         '',
  description_en: '',
  description_ar: '',
  brand_name:     '',
  discount:       '',
  code:           '',
  badge:          '',
  location:       '',
  valid_until:    '',
  is_active:      true,
  home_collection: false,
  family_allowed: false,
  terms_en:       '',
  terms_ar:       '',
};

export default function BenefitFormModal({ mode = 'add', initialData = {}, onClose, onSaved }) {
  const isEdit = mode === 'edit';
  const [form, setForm]     = useState({ ...EMPTY, ...initialData });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });

    if (!form.title.trim()) {
      setStatus({ loading: false, error: 'Title (PK) is required.' });
      return;
    }

    let res;
    if (isEdit) {
      const { title, ...rest } = form; // don't update the PK column itself
      res = await updateBenefit(initialData.title, rest);
    } else {
      res = await createBenefit(form);
    }

    if (!res.success) {
      setStatus({ loading: false, error: res.error || 'Something went wrong.' });
      return;
    }

    setStatus({ loading: false, error: '' });
    onSaved();
  };

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-extrabold text-[#23161A]">
              {isEdit ? 'Edit Benefit' : 'Add New Benefit'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isEdit ? `Editing: ${initialData.title}` : 'Fill in the fields and click Save'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            aria-label="Close"
          >
            <XIcon />
          </button>
        </div>

        {/* scrollable body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Error banner */}
          {status.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
              {status.error}
            </div>
          )}

          {/* ── Row: title (PK) */}
          <Section title="Identity">
            <Field label="Title (Primary Key)" required hint={isEdit ? 'Cannot be changed in edit mode' : 'Unique identifier, e.g. "kfc-20-off"'}>
              <input
                id="bf-title"
                type="text"
                required
                disabled={isEdit}
                value={form.title}
                onChange={set('title')}
                placeholder="unique-slug-pk"
                className={inputCls + (isEdit ? ' bg-zinc-50 text-zinc-400 cursor-not-allowed' : '')}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Title (English)">
                <input id="bf-title-en" type="text" value={form.title_en} onChange={set('title_en')} placeholder="English title" className={inputCls} />
              </Field>
              <Field label="Title (Arabic)">
                <input id="bf-title-ar" type="text" value={form.title_ar} onChange={set('title_ar')} placeholder="العنوان بالعربية" dir="rtl" className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Brand Name">
                <input id="bf-brand" type="text" value={form.brand_name} onChange={set('brand_name')} placeholder="KFC, Al Borg…" className={inputCls} />
              </Field>
              <Field label="Badge">
                <input id="bf-badge" type="text" value={form.badge} onChange={set('badge')} placeholder="KF, AL…" className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── Row: category */}
          <Section title="Classification">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category" required>
                <input id="bf-category" type="text" required value={form.category} onChange={set('category')} placeholder="health, restaurants…" className={inputCls} />
              </Field>
              <Field label="Sub-category">
                <input id="bf-subcat" type="text" value={form.subcat} onChange={set('subcat')} placeholder="labs, cafes…" className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── Discount & Code */}
          <Section title="Offer Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Discount">
                <input id="bf-discount" type="text" value={form.discount} onChange={set('discount')} placeholder="20%, Free delivery…" className={inputCls} />
              </Field>
              <Field label="Promo Code">
                <input id="bf-code" type="text" value={form.code} onChange={set('code')} placeholder="IDH-KFC20" className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Location">
                <input id="bf-location" type="text" value={form.location} onChange={set('location')} placeholder="All Branches, Egypt" className={inputCls} />
              </Field>
              <Field label="Valid Until">
                <input id="bf-valid" type="date" value={form.valid_until} onChange={set('valid_until')} className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── Descriptions */}
          <Section title="Descriptions">
            <Field label="Description (English)">
              <textarea id="bf-desc-en" rows={3} value={form.description_en} onChange={set('description_en')} placeholder="English description…" className={inputCls + ' resize-none'} />
            </Field>
            <Field label="Description (Arabic)">
              <textarea id="bf-desc-ar" rows={3} value={form.description_ar} onChange={set('description_ar')} placeholder="الوصف بالعربية…" dir="rtl" className={inputCls + ' resize-none'} />
            </Field>
          </Section>

          {/* ── Terms */}
          <Section title="Terms & Conditions">
            <Field label="Terms (English)">
              <textarea id="bf-terms-en" rows={2} value={form.terms_en} onChange={set('terms_en')} placeholder="Present your IDH Employee ID card…" className={inputCls + ' resize-none'} />
            </Field>
            <Field label="Terms (Arabic)">
              <textarea id="bf-terms-ar" rows={2} value={form.terms_ar} onChange={set('terms_ar')} placeholder="إبراز كارت الموظف…" dir="rtl" className={inputCls + ' resize-none'} />
            </Field>
          </Section>

          {/* ── Toggles */}
          <Section title="Flags">
            <div className="flex flex-wrap gap-6">
              <Toggle id="bf-is-active"      label="Is Active"                       checked={form.is_active}       onChange={set('is_active')} />
              <Toggle id="bf-home"           label="Home Collection"                 checked={form.home_collection} onChange={set('home_collection')} />
              <Toggle id="bf-family-allowed" label="Allow family members to redeem" checked={form.family_allowed}  onChange={set('family_allowed')} />
            </div>
          </Section>

        </form>

        {/* footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 flex-shrink-0 bg-zinc-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all"
          >
            Cancel
          </button>
          <button
            form="benefit-form"
            type="submit"
            disabled={status.loading}
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-[#A50D1A] hover:bg-[#880a15] rounded-xl transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {status.loading && <SpinIcon />}
            {status.loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Benefit'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-[#23161A]">
        {label}{required && <span className="text-[#A50D1A] ml-0.5">*</span>}
      </label>
      {hint && <p className="text-[10px] text-zinc-400 -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

function Toggle({ id, label, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer select-none">
      <div className="relative">
        <input id={id} type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[#A50D1A] transition-colors" />
        <div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform peer-checked:translate-x-4" />
      </div>
      <span className="text-xs font-semibold text-zinc-700">{label}</span>
    </label>
  );
}

// ── Styles & Icons ────────────────────────────────────────────

const inputCls = 'w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A]/20 outline-none transition-all bg-white';

const SvgProps = { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' };

function XIcon() {
  return <svg className="w-4 h-4" {...SvgProps}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

function SpinIcon() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
    </svg>
  );
}
