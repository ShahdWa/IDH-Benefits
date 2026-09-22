'use client';

// components/MyFamilySection.jsx
// Manage current user's family members (dependents) for benefit redemption.

import { useState, useEffect } from 'react';
import { getDependents, addDependent, updateDependent, deleteDependent } from '../lib/api';

const RELATIONSHIPS = [
  { value: 'spouse',   label: 'Spouse'   },
  { value: 'son',      label: 'Son'      },
  { value: 'daughter', label: 'Daughter' },
  { value: 'other',    label: 'Other'    },
];

export default function MyFamilySection() {
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [adding, setAdding]         = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [form, setForm]             = useState({ fullName: '', relationship: 'spouse' });
  const [editForm, setEditForm]     = useState({ fullName: '', relationship: 'spouse' });
  const [relationDropdownOpen, setRelationDropdownOpen] = useState(false);
  const [editRelationDropdownOpen, setEditRelationDropdownOpen] = useState(false);
  const [formStatus, setFormStatus] = useState({ loading: false, error: '' });
  const [deletingId, setDeletingId] = useState(null);

  const refresh = async () => {
    setLoading(true);
    const data = await getDependents();
    setDependents(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    setFormStatus({ loading: true, error: '' });
    const res = await addDependent(form.fullName.trim(), form.relationship);
    if (!res.success) {
      setFormStatus({ loading: false, error: res.error || 'Failed to add member.' });
      return;
    }
    setFormStatus({ loading: false, error: '' });
    setForm({ fullName: '', relationship: 'spouse' });
    setAdding(false);
    refresh();
  };

  const handleStartEdit = (dep) => {
    setEditingId(dep.id);
    setEditForm({ fullName: dep.full_name, relationship: dep.relationship });
    setAdding(false);
    setFormStatus({ loading: false, error: '' });
  };

  const handleSaveEdit = async (id) => {
    if (!editForm.fullName.trim()) return;
    setFormStatus({ loading: true, error: '' });
    const res = await updateDependent(id, editForm.fullName.trim(), editForm.relationship);
    if (!res.success) {
      setFormStatus({ loading: false, error: res.error || 'Failed to update member.' });
      return;
    }
    setFormStatus({ loading: false, error: '' });
    setEditingId(null);
    refresh();
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteDependent(id);
    setDeletingId(null);
    refresh();
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Header - Original clean layout */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECE1DE] bg-[#FAF5F3]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FCEEEE] flex items-center justify-center text-[#A50D1A] shrink-0">
            <FamilyIcon />
          </div>
          <div>
            <p className="text-sm font-bold text-[#23161A]">My Family</p>
            <p className="text-[11px] text-[#6B6B6B]">Manage family members who can redeem eligible benefits</p>
          </div>
        </div>
        <button
          onClick={() => { 
            setAdding(!adding); 
            setEditingId(null); 
            setFormStatus({ loading: false, error: '' }); 
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#A50D1A] border border-[#A50D1A]/30 rounded-lg hover:bg-[#FCEEEE] transition-colors shrink-0"
        >
          {adding ? '✕ Cancel' : '+ Add Member'}
        </button>
      </div>

      {/* Add form - fully visible Save button & brand palette */}
      {adding && (
        <form onSubmit={handleAdd} className="px-5 py-3.5 border-b border-[#ECE1DE] bg-[#FAF5F3]/50 space-y-2.5">
          {formStatus.error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
              {formStatus.error}
            </div>
          )}
          <div className="flex gap-2">
            <input
              required
              autoFocus
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Full name"
              className="flex-1 min-w-0 px-3 py-2 text-xs rounded-xl border border-[#ECE1DE] focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A]/20 outline-none bg-white text-[#23161A]"
            />
            {/* Custom Relationship Dropdown */}
            <div className="relative w-28 shrink-0">
              <button
                type="button"
                onClick={() => setRelationDropdownOpen(!relationDropdownOpen)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#ECE1DE] hover:border-[#A50D1A] focus:border-[#A50D1A] outline-none bg-white text-[#23161A] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="capitalize truncate font-medium">
                  {RELATIONSHIPS.find(r => r.value === form.relationship)?.label || form.relationship}
                </span>
                <ChevronIcon className={`w-3.5 h-3.5 text-[#6B6B6B] transition-transform ${relationDropdownOpen ? 'rotate-180 text-[#A50D1A]' : ''}`} />
              </button>

              {relationDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl border border-[#ECE1DE] shadow-xl z-30 py-1 overflow-hidden animate-fadeIn">
                  {RELATIONSHIPS.map(({ value, label }) => {
                    const isSelected = form.relationship === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, relationship: value });
                          setRelationDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#FCEEEE] text-[#A50D1A] font-bold'
                            : 'text-[#23161A] hover:bg-[#FAF5F3] hover:text-[#A50D1A]'
                        }`}
                      >
                        <span>{label}</span>
                        {isSelected && <CheckIcon className="w-3 h-3 text-[#A50D1A]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={formStatus.loading || !form.fullName.trim()}
            className="w-full py-2 text-xs font-bold text-white bg-[#A50D1A] hover:bg-[#880a15] rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {formStatus.loading ? (
              <>
                <SpinIcon />
                <span>Saving…</span>
              </>
            ) : (
              <span>Save Member</span>
            )}
          </button>
        </form>
      )}

      {/* Members list */}
      {loading ? (
        <div className="py-10 flex justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[#A50D1A]/20 border-t-[#A50D1A] animate-spin" />
        </div>
      ) : dependents.length === 0 ? (
        <div className="py-8 px-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#FCEEEE] flex items-center justify-center text-[#A50D1A]">
            <FamilyIcon />
          </div>
          <p className="text-xs font-semibold text-[#23161A]">No family members added yet.</p>
          <p className="text-[11px] text-[#6B6B6B] mt-0.5">Click <span className="font-semibold text-[#A50D1A]">+ Add Member</span> to get started.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#ECE1DE]">
          {dependents.map((dep) => (
            <div key={dep.id}>
              {editingId === dep.id ? (
                /* Edit Mode for Row */
                <div className="px-5 py-3.5 bg-[#FAF5F3]/70 space-y-2.5">
                  {formStatus.error && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                      {formStatus.error}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="flex-1 min-w-0 px-3 py-2 text-xs rounded-xl border border-[#ECE1DE] focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A]/20 outline-none bg-white text-[#23161A]"
                    />
                    {/* Custom Relationship Dropdown for Edit */}
                    <div className="relative w-28 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditRelationDropdownOpen(!editRelationDropdownOpen)}
                        className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#ECE1DE] hover:border-[#A50D1A] focus:border-[#A50D1A] outline-none bg-white text-[#23161A] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="capitalize truncate font-medium">
                          {RELATIONSHIPS.find(r => r.value === editForm.relationship)?.label || editForm.relationship}
                        </span>
                        <ChevronIcon className={`w-3.5 h-3.5 text-[#6B6B6B] transition-transform ${editRelationDropdownOpen ? 'rotate-180 text-[#A50D1A]' : ''}`} />
                      </button>

                      {editRelationDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl border border-[#ECE1DE] shadow-xl z-30 py-1 overflow-hidden animate-fadeIn">
                          {RELATIONSHIPS.map(({ value, label }) => {
                            const isSelected = editForm.relationship === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => {
                                  setEditForm({ ...editForm, relationship: value });
                                  setEditRelationDropdownOpen(false);
                                }}
                                className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#FCEEEE] text-[#A50D1A] font-bold'
                                    : 'text-[#23161A] hover:bg-[#FAF5F3] hover:text-[#A50D1A]'
                                }`}
                              >
                                <span>{label}</span>
                                {isSelected && <CheckIcon className="w-3 h-3 text-[#A50D1A]" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(dep.id)}
                      disabled={formStatus.loading || !editForm.fullName.trim()}
                      className="flex-1 py-1.5 text-xs font-bold text-white bg-[#A50D1A] hover:bg-[#880a15] rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {formStatus.loading ? <SpinIcon /> : null}
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setFormStatus({ loading: false, error: '' }); }}
                      className="px-3 py-1.5 text-xs font-semibold text-[#6B6B6B] border border-[#ECE1DE] bg-white rounded-xl hover:bg-[#FAF5F3] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode for Row */
                <div className="flex items-center justify-between px-5 py-3 hover:bg-[#FCEEEE]/40 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#FCEEEE] text-[#A50D1A] font-bold text-xs flex items-center justify-center shrink-0">
                      {dep.full_name ? dep.full_name.trim().charAt(0).toUpperCase() : 'M'}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${dep.is_active === false ? 'text-zinc-500' : 'text-[#23161A]'}`}>{dep.full_name}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[10px] text-[#6B6B6B] capitalize">{dep.relationship}</p>
                        {dep.is_active === false && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                            Suspended
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(dep)}
                      className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#A50D1A] hover:bg-[#FCEEEE] transition-colors"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(dep.id)}
                      disabled={deletingId === dep.id}
                      className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#A50D1A] hover:bg-[#FCEEEE] transition-colors disabled:opacity-40"
                      title="Remove"
                    >
                      {deletingId === dep.id ? <SpinIcon /> : <TrashIcon />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Icons (Pure SVG without external dependencies) ────────────

const SvgProps = { 
  xmlns: 'http://www.w3.org/2000/svg', 
  viewBox: '0 0 24 24', 
  fill: 'none', 
  stroke: 'currentColor', 
  strokeWidth: '2', 
  strokeLinecap: 'round', 
  strokeLinejoin: 'round' 
};

function FamilyIcon() {
  return (
    <svg className="w-4 h-4" {...SvgProps}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function ChevronIcon({ className = "w-3 h-3" }) {
  return (
    <svg className={className} {...SvgProps}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

function CheckIcon({ className = "w-3 h-3" }) {
  return (
    <svg className={className} {...SvgProps}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-3.5 h-3.5" {...SvgProps}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
      <path d="m15 5 4 4"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-3.5 h-3.5" {...SvgProps}>
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  );
}

function SpinIcon() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
    </svg>
  );
}
