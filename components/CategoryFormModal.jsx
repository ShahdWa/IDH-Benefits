'use client';

// components/CategoryFormModal.jsx
// Modal form for creating or editing a row in the `categories` table.
// Props:
//   mode        : 'add' | 'edit'
//   initialData : object – pre-populated row (used in edit mode)
//   onClose     : () => void
//   onSaved     : () => void  – called after a successful save

import { useState } from 'react';
import { createCategory, updateCategory } from '../lib/api';

// All icon keys available in lib/iconMap.js
const ICON_OPTIONS = [
  { value: 'utensilscrossed', label: '🍴  UtensilsCrossed (Restaurants)' },
  { value: 'coffee',          label: '☕  Coffee' },
  { value: 'plane',           label: '✈️  Plane (Travel)' },
  { value: 'compass',         label: '🧭  Compass' },
  { value: 'car',             label: '🚗  Car' },
  { value: 'cpu',             label: '💻  Cpu (Electronics)' },
  { value: 'zap',             label: '⚡  Zap' },
  { value: 'shirt',           label: '👕  Shirt (Fashion)' },
  { value: 'shoppingbag',     label: '🛍️  ShoppingBag' },
  { value: 'gift',            label: '🎁  Gift' },
  { value: 'tag',             label: '🏷️  Tag' },
  { value: 'heartpulse',      label: '❤️  HeartPulse (Health)' },
  { value: 'stethoscope',     label: '🩺  Stethoscope' },
  { value: 'activity',        label: '📈  Activity' },
  { value: 'wrench',          label: '🔧  Wrench (Services)' },
  { value: 'building2',       label: '🏢  Building' },
  { value: 'sparkles',        label: '✨  Sparkles' },
  { value: 'film',            label: '🎬  Film' },
  { value: 'music',           label: '🎵  Music' },
  { value: 'book',            label: '📖  BookOpen' },
  { value: 'smile',           label: '😊  Smile' },
  { value: 'shield',          label: '🛡️  ShieldCheck' },
];

const EMPTY = {
  name:        '',
  slug:        '',
  icon:        'sparkles',
  name_en:     '',
  name_ar:     '',
  subtitle_en: '',
  subtitle_ar: '',
  sort_order:  '',
  description: '',
};

export default function CategoryFormModal({ mode = 'add', initialData = {}, onClose, onSaved }) {
  const isEdit = mode === 'edit';
  const [form, setForm]     = useState({ ...EMPTY, ...initialData });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Auto-generate slug from name in add mode
  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      name: val,
      // Auto-fill slug only if user hasn't manually edited it yet
      slug: isEdit ? prev.slug : val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });

    if (!form.name.trim()) {
      setStatus({ loading: false, error: 'Name (PK) is required.' });
      return;
    }
    if (!form.slug.trim()) {
      setStatus({ loading: false, error: 'Slug is required.' });
      return;
    }

    // Build payload — only send non-empty fields, cast sort_order to int
    const payload = {
      ...form,
      sort_order: form.sort_order !== '' ? parseInt(form.sort_order, 10) : null,
    };

    let res;
    if (isEdit) {
      const { name, ...rest } = payload; // don't update the PK column
      res = await updateCategory(initialData.name, rest);
    } else {
      res = await createCategory(payload);
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-extrabold text-[#23161A]">
              {isEdit ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isEdit ? `Editing: ${initialData.name}` : 'Fill in the fields and click Save'}
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

          {status.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
              {status.error}
            </div>
          )}

          {/* ── Identity */}
          <Section title="Identity">
            <Field label="Name (Primary Key)" required hint={isEdit ? 'Cannot be changed in edit mode' : 'Unique identifier, e.g. "health"'}>
              <input
                id="cf-name"
                type="text"
                required
                disabled={isEdit}
                value={form.name}
                onChange={handleNameChange}
                placeholder="health"
                className={inputCls + (isEdit ? ' bg-zinc-50 text-zinc-400 cursor-not-allowed' : '')}
              />
            </Field>

            <Field label="Slug (unique URL key)" required hint={isEdit ? 'Changing slug may break existing category links' : 'Auto-generated — edit if needed'}>
              <input
                id="cf-slug"
                type="text"
                required
                value={form.slug}
                onChange={set('slug')}
                placeholder="health-clinics"
                className={inputCls}
              />
            </Field>
          </Section>

          {/* ── Display names */}
          <Section title="Display Names">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name (English)">
                <input id="cf-name-en" type="text" value={form.name_en} onChange={set('name_en')} placeholder="Health" className={inputCls} />
              </Field>
              <Field label="Name (Arabic)">
                <input id="cf-name-ar" type="text" value={form.name_ar} onChange={set('name_ar')} placeholder="الصحة" dir="rtl" className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Subtitle (English)">
                <input id="cf-sub-en" type="text" value={form.subtitle_en} onChange={set('subtitle_en')} placeholder="Diagnostics, clinics and lab perks." className={inputCls} />
              </Field>
              <Field label="Subtitle (Arabic)">
                <input id="cf-sub-ar" type="text" value={form.subtitle_ar} onChange={set('subtitle_ar')} placeholder="خصومات العيادات والمختبرات" dir="rtl" className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── Appearance */}
          <Section title="Appearance">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Icon" required>
                <select
                  id="cf-icon"
                  value={form.icon}
                  onChange={set('icon')}
                  className={inputCls + ' cursor-pointer'}
                >
                  {ICON_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Sort Order" hint="Lower numbers appear first">
                <input
                  id="cf-sort"
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={set('sort_order')}
                  placeholder="1"
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          {/* ── Description */}
          <Section title="Description (optional)">
            <Field label="Description">
              <textarea
                id="cf-desc"
                rows={3}
                value={form.description}
                onChange={set('description')}
                placeholder="Brief description of this category…"
                className={inputCls + ' resize-none'}
              />
            </Field>
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
            type="submit"
            disabled={status.loading}
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-[#A50D1A] hover:bg-[#880a15] rounded-xl transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {status.loading && <SpinIcon />}
            {status.loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────

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

// ── Styles & Icons ─────────────────────────────────────────────

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
