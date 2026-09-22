'use client';

// =============================================================
//  IDH Benefits — Admin Dashboard  |  Route: /admin
// =============================================================

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import IdhLogo from '../../components/IdhLogo';
import { getBenefits, getRedemptions, getRedemptionsCount, getAppSettings, updateAppSetting, updateAdminPassword, deleteBenefit, getCategories, deleteCategory, countPerksByCategory, getAllDependents, toggleDependentActive } from '../../lib/api';
import BenefitFormModal from '../../components/BenefitFormModal';
import CategoryFormModal from '../../components/CategoryFormModal';
import { supabase } from '../../lib/supabase';

// ─────────────────────────────────────────────────────────────
// Constants & Static Data
// ─────────────────────────────────────────────────────────────

const EMPLOYEES = [
  { id: 'EMP10432', name: 'Mona Kamal',    initials: 'MK', color: '#A50D1A', dept: 'Radiology',     used: 5, status: 'Active',   last: '2 hours ago' },
  { id: 'EMP10298', name: 'Ahmed Sabry',   initials: 'AS', color: '#1A3A50', dept: 'Laboratory',    used: 3, status: 'Active',   last: 'Yesterday'   },
  { id: 'EMP10541', name: 'Nourhan Fathy', initials: 'NF', color: '#4A7C59', dept: 'Customer Care', used: 1, status: 'Pending',  last: '4 days ago'  },
  { id: 'EMP10388', name: 'Youssef Hany',  initials: 'YH', color: '#7B4A1A', dept: 'IT Support',    used: 6, status: 'Active',   last: '1 hour ago'  },
  { id: 'EMP10619', name: 'Rania Adel',    initials: 'RA', color: '#5A1A7B', dept: 'Finance',       used: 0, status: 'Inactive', last: '3 weeks ago' },
  { id: 'EMP10712', name: 'Omar Hassan',   initials: 'OH', color: '#1A5A7B', dept: 'Marketing',     used: 4, status: 'Active',   last: '3 hours ago' },
  { id: 'EMP10823', name: 'Sara Mahmoud',  initials: 'SM', color: '#7B1A4A', dept: 'HR',            used: 7, status: 'Active',   last: 'Just now'    },
];

const STATS = [
  { icon: 'emp',   value: '2,486', label: 'Total employees',        accent: 'text-rose-400'   },
  { icon: 'tag',   value: '9,148', label: 'Redemptions this month', accent: 'text-amber-400'  },
  { icon: 'heart', value: '78%',   label: 'Engagement rate',        accent: 'text-purple-400' },
];

const REPORT_CARDS = [
  { label: 'Top Category',       value: 'Health & Diagnostics',    sub: 'Most active benefits' },
  { label: 'Most Active Dept.',  value: 'Laboratories & Radiology', sub: 'Highest participation' },
  { label: 'Active Partners',    value: '40+ Corporate Deals',     sub: 'Available across branches' },
  { label: 'Avg. Benefits Used', value: '4.2 / 7',                 sub: 'Per employee' },
];

const SETTINGS_ROWS = [
  { label: 'Admin Password',     sub: 'Change the admin access password',  action: 'Change' },
  { label: 'Notification Email', sub: 'Email address for system alerts',   action: 'Update' },
];

const STATUS_STYLE = {
  Active:   'bg-green-50 text-green-700 border-green-200',
  Pending:  'bg-amber-50 text-amber-700 border-amber-200',
  Inactive: 'bg-zinc-100 text-zinc-500 border-zinc-200',
};
const STATUS_DOT = {
  Active:   'bg-green-500',
  Pending:  'bg-amber-500',
  Inactive: 'bg-zinc-400',
};

const NAV_GENERAL = [
  { key: 'dashboard',  label: 'Dashboard',  Icon: GridIcon   },
  { key: 'employees',  label: 'Employees',  Icon: UsersIcon  },
  { key: 'benefits',   label: 'Benefits',   Icon: BagIcon    },
  { key: 'categories', label: 'Categories', Icon: LayersIcon },
];

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [active, setActive]           = useState('dashboard');
  const [search, setSearch]           = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth guard state
  const [authChecked, setAuthChecked] = useState(false);
  const [adminUser, setAdminUser]     = useState(null);

  // Supabase data state
  const [benefits,         setBenefits]         = useState([]);
  const [categories,       setCategories]       = useState([]);
  const [employees,        setEmployees]        = useState([]);
  const [dependents,       setDependents]       = useState([]);
  const [redemptions,      setRedemptions]      = useState([]);
  const [redemptionsCount, setRedemptionsCount] = useState(0);

  // ── Auth Guard + Data Fetch ───────────────────────────────
  useEffect(() => {
    let isMounted = true;

    async function checkAdmin() {
      try {
        // 1. Is there an active session?
        const { data: { session }, error: sessError } = await supabase.auth.getSession();
        if (!session || sessError) {
          router.replace('/admin/login');
          return;
        }

        // 2. Does this user have role = 'admin' in profiles?
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        const isUserAdmin = profile?.role === 'admin' || session.user.user_metadata?.role === 'admin';

        if (!isUserAdmin) {
          await supabase.auth.signOut();
          router.replace('/admin/login');
          return;
        }

        if (!isMounted) return;

        // Resolve dynamic admin user details
        const adminName = profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Admin';
        const words = adminName.trim().split(/\s+/);
        const initials = words.length === 1
          ? words[0].slice(0, 2).toUpperCase()
          : (words[0][0] + words[words.length - 1][0]).toUpperCase();

        setAdminUser({
          name: adminName,
          email: session.user.email,
          roleTitle: profile?.department ? `${profile.department} Admin` : 'HR Admin',
          initials: initials || 'AD',
        });

        // 3. All good — fetch real data and show the dashboard
        setAuthChecked(true);

        // Fetch benefits, categories, dependents & redemptions from Supabase
        getBenefits().then((data) => isMounted && setBenefits(data || []));
        getCategories().then((data) => isMounted && setCategories(data || []));
        getAllDependents().then((data) => isMounted && setDependents(data || []));
        getRedemptions().then((data) => {
          if (isMounted) {
            setRedemptions(data || []);
            setRedemptionsCount(data ? data.length : 0);
          }
        });

        // Fetch real employees from profiles table
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email, department, role, created_at')
          .order('created_at', { ascending: false });

        if (profilesData && isMounted) {
          setEmployees(profilesData.map((p) => ({
            rawId:    p.id,
            id:       p.id.slice(0, 8).toUpperCase(),
            name:     p.full_name  || p.email?.split('@')[0] || 'Unknown',
            initials: (p.full_name || 'UN').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
            color:    '#A50D1A',
            dept:     p.department || 'IDH Corporate',
            status:   'Active',
            last:     new Date(p.created_at).toLocaleDateString('en-EG'),
          })));
        }
      } catch (err) {
        console.error('[checkAdmin error]', err);
        router.replace('/admin/login');
      }
    }

    checkAdmin();
    return () => { isMounted = false; };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  const handleToggleDependent = async (id, currentActive) => {
    const newActive = !currentActive;
    // Optimistic UI update immediately
    setDependents((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_active: newActive, isActive: newActive } : d))
    );

    const res = await toggleDependentActive(id, newActive);
    if (!res.success) {
      // Revert if API failed
      setDependents((prev) =>
        prev.map((d) => (d.id === id ? { ...d, is_active: currentActive, isActive: currentActive } : d))
      );
      console.error('[toggleDependentActive error]', res.error);
    }
  };

  const filteredEmployees = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.dept.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
    );
  });

  const navigate = (key) => { setActive(key); setSidebarOpen(false); };

  // ── Loading screen while verifying auth ──────────────────
  if (!authChecked) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FAF5F3] flex-col gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-[#A50D1A]/20 border-t-[#A50D1A] animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAF5F3] font-sans overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar active={active} setActive={navigate} isOpen={sidebarOpen} adminUser={adminUser} onLogout={handleLogout} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-100 flex-shrink-0">
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="text-[#A50D1A]" title="Back to employee portal">
            <IdhLogo />
          </a>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 transition-colors">
            <MenuIcon />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-8 max-w-5xl mx-auto">
            {active === 'dashboard' && (
              <DashboardView
                setActive={navigate}
                employees={employees}
                adminUser={adminUser}
                redemptionsCount={redemptionsCount}
                dependents={dependents}
                onToggleDependent={handleToggleDependent}
              />
            )}
            {active === 'employees'  && (
              <EmployeesView
                employees={filteredEmployees}
                dependents={dependents}
                onToggleDependent={handleToggleDependent}
                search={search}
                setSearch={setSearch}
              />
            )}
            {active === 'benefits'   && <BenefitsView benefits={benefits} setBenefits={setBenefits} />}
            {active === 'categories' && <CategoriesView categories={categories} setCategories={setCategories} />}
            {active === 'settings'   && <SettingsView onLogout={handleLogout} adminUser={adminUser} />}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sidebar Component
// ─────────────────────────────────────────────────────────────

function Sidebar({ active, setActive, isOpen, adminUser, onLogout }) {
  const base = 'fixed md:relative z-30 md:z-auto w-[220px] flex-shrink-0 h-full bg-white border-r border-zinc-100 flex flex-col transition-transform duration-300 ease-in-out';
  const pos   = isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0';

  return (
    <aside className={base + ' ' + pos}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-100 flex-shrink-0">
        <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="text-[#A50D1A] block hover:opacity-80 transition-opacity" title="Back to employee portal">
          <IdhLogo />
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <NavGroup label="General">
          {NAV_GENERAL.map(({ key, label, Icon }) => (
            <NavButton key={key} active={active === key} onClick={() => setActive(key)} Icon={Icon}>
              {label}
            </NavButton>
          ))}
        </NavGroup>

        <NavGroup label="System">
          <NavButton active={active === 'settings'} onClick={() => setActive('settings')} Icon={SettingsIcon}>
            Settings
          </NavButton>
        </NavGroup>
      </nav>

      {/* Return to Portal Button in Sidebar */}
      <div className="px-3 pb-3">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/';
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-[#A50D1A] bg-[#FCEEEE] hover:bg-[#ebd0ce] transition-all cursor-pointer"
        >
          <span className="text-sm">←</span>
          <span>Employee Portal</span>
        </a>
      </div>

      {/* User */}
      <div className="px-3 py-4 border-t border-zinc-100 flex-shrink-0">
        <div className="flex items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#A50D1A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {adminUser?.initials || 'AD'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-800 truncate" title={adminUser?.name || 'Admin'}>
                {adminUser?.name || 'Admin'}
              </p>
              <p className="text-[10px] text-zinc-400 truncate">
                {adminUser?.roleTitle || 'HR Admin'}
              </p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-[#A50D1A] hover:bg-red-50 transition-colors flex-shrink-0"
            >
              <LogOutIcon />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavGroup({ label, children }) {
  return (
    <div className="pb-2">
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-2">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavButton({ active, onClick, Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active ? 'bg-[#FCEEEE] text-[#A50D1A]' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
      }`}
    >
      <span className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#A50D1A]' : 'text-zinc-400'}`}>
        <Icon />
      </span>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// View Components
// ─────────────────────────────────────────────────────────────

function DashboardView({ setActive, employees, redemptionsCount = 0, dependents = [], onToggleDependent }) {
  // Compute real stats from live data
  const liveStats = [
    { icon: 'emp',   value: employees.length.toLocaleString(), label: 'Total employees',   accent: 'text-rose-400'   },
    { icon: 'tag',   value: redemptionsCount.toLocaleString(), label: 'Total Redemptions', accent: 'text-amber-400'  },
    { icon: 'heart', value: employees.length ? '100%' : '—',   label: 'Registered users',  accent: 'text-purple-400' },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of employee benefits usage" />

      {/* Real Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {liveStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Employees preview — real data */}
      <EmployeesTable employees={employees.slice(0, 5)} dependents={dependents} onToggleDependent={onToggleDependent} mini onViewAll={() => setActive('employees')} />
    </>
  );
}

function EmployeesView({ employees, dependents = [], onToggleDependent, search, setSearch }) {
  return (
    <>
      <PageHeader title="Employees" subtitle="Manage and track employee benefit usage" />
      <EmployeesTable employees={employees} dependents={dependents} onToggleDependent={onToggleDependent} search={search} setSearch={setSearch} />
    </>
  );
}

function BenefitsView({ benefits, setBenefits }) {
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', data: object }
  const [deleteTarget, setDeleteTarget] = useState(null); // title string
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const refresh = () =>
    getBenefits().then((data) => setBenefits(data || []));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const res = await deleteBenefit(deleteTarget);
    setDeleteLoading(false);
    setDeleteTarget(null);
    if (res.success) {
      showToast('Benefit deleted.');
      refresh();
    } else {
      showToast('Error: ' + res.error);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#23161A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <BenefitFormModal
          mode={modal.mode}
          initialData={modal.data || {}}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            showToast(modal.mode === 'edit' ? 'Benefit updated!' : 'Benefit added!');
            refresh();
          }}
        />
      )}

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <p className="text-sm font-bold text-[#23161A] mb-1">Delete Benefit?</p>
            <p className="text-xs text-zinc-500 mb-5">
              Are you sure you want to delete <span className="font-semibold text-[#A50D1A]">{deleteTarget}</span>? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-xs font-bold text-white bg-[#A50D1A] hover:bg-[#880a15] rounded-xl transition-all disabled:opacity-60"
              >
                {deleteLoading ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <PageHeader title="Benefits" subtitle={`${benefits.length} partner benefits`}>
        <button
          id="add-benefit-btn"
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#A50D1A] hover:bg-[#880a15] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          <PlusIcon /> Add Benefit
        </button>
      </PageHeader>

      <div className="bg-white rounded-2xl border border-zinc-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <Th>Benefit</Th>
              <Th>Category</Th>
              <Th>Discount</Th>
              <Th>Code</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {benefits.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-zinc-400">
                  No benefits found. Click <strong>Add Benefit</strong> to get started.
                </td>
              </tr>
            ) : (
              benefits.map((b) => (
                <tr key={b.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-[#23161A] text-sm leading-tight">{b.titleEn || b.id}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{b.brandName}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-zinc-500 capitalize">{b.category}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#FCEEEE] text-[#A50D1A] text-xs font-bold">
                      {b.discount}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-zinc-400">{b.code}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal({
                          mode: 'edit',
                          data: {
                            title:          b.id,
                            title_en:       b.titleEn   || '',
                            title_ar:       b.titleAr   || '',
                            category:       b.category  || '',
                            subcat:         b.subcat    || '',
                            description_en: b.descriptionEn || '',
                            description_ar: b.descriptionAr || '',
                            brand_name:     b.brandName || '',
                            discount:       b.discount  || '',
                            code:           b.code      || '',
                            badge:          b.badge     || '',
                            location:       b.location  || '',
                            valid_until:    b.validUntil || '',
                            is_active:      b.is_active ?? true,
                            home_collection: b.homeCollection ?? false,
                            terms_en:       b.termsEn   || '',
                            terms_ar:       b.termsAr   || '',
                          },
                        })}
                        className="px-3 py-1.5 text-[10px] font-bold text-[#A50D1A] border border-[#A50D1A]/30 rounded-lg hover:bg-[#FCEEEE] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(b.id)}
                        className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 border border-zinc-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// CategoriesView
// ─────────────────────────────────────────────────────────────

function CategoriesView({ categories, setCategories }) {
  const [modal, setModal]               = useState(null);   // null | { mode, data? }
  const [deleteTarget, setDeleteTarget] = useState(null);   // { name, linkedCount }
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast]               = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const refresh = () =>
    getCategories().then((data) => setCategories(data || []));

  // Ask Supabase how many perks reference this category before deleting
  const confirmDelete = async (cat) => {
    const linked = await countPerksByCategory(cat.nameEn || cat.id);
    setDeleteTarget({ name: cat.nameEn || cat.id, slug: cat.id, linkedCount: linked });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const res = await deleteCategory(deleteTarget.name);
    setDeleteLoading(false);
    setDeleteTarget(null);
    if (res.success) { showToast('Category deleted.'); refresh(); }
    else showToast('Error: ' + res.error);
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#23161A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <CategoryFormModal
          mode={modal.mode}
          initialData={modal.data || {}}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            showToast(modal.mode === 'edit' ? 'Category updated!' : 'Category added!');
            refresh();
          }}
        />
      )}

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <p className="text-sm font-bold text-[#23161A] mb-1">Delete Category?</p>
            <p className="text-xs text-zinc-500 mb-2">
              Are you sure you want to delete <span className="font-semibold text-[#A50D1A]">{deleteTarget.name}</span>?
            </p>
            {deleteTarget.linkedCount > 0 && (
              <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-medium">
                ⚠️ <strong>{deleteTarget.linkedCount} benefit{deleteTarget.linkedCount !== 1 ? 's are' : ' is'}</strong> linked to this category and will lose their category reference.
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-xs font-bold text-white bg-[#A50D1A] hover:bg-[#880a15] rounded-xl transition-all disabled:opacity-60"
              >
                {deleteLoading ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <PageHeader title="Categories" subtitle={`${categories.length} active categories`}>
        <button
          id="add-category-btn"
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#A50D1A] hover:bg-[#880a15] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          <PlusIcon /> Add Category
        </button>
      </PageHeader>

      <div className="bg-white rounded-2xl border border-zinc-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <Th>Category</Th>
              <Th>Slug</Th>
              <Th>Icon</Th>
              <Th>Sort</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-zinc-400">
                  No categories found. Click <strong>Add Category</strong> to get started.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-[#23161A] text-sm leading-tight">{cat.nameEn || cat.id}</p>
                    <p className="text-xs text-zinc-400 mt-0.5" dir="rtl">{cat.nameAr}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-zinc-400">{cat.id}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-500">{cat.icon || '—'}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-500">{cat.sort_order ?? '—'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal({
                          mode: 'edit',
                          data: {
                            name:        cat.nameEn || cat.id,
                            slug:        cat.id,
                            icon:        cat.icon        || 'sparkles',
                            name_en:     cat.nameEn      || '',
                            name_ar:     cat.nameAr      || '',
                            subtitle_en: cat.subtitleEn  || '',
                            subtitle_ar: cat.subtitleAr  || '',
                            sort_order:  cat.sort_order  ?? '',
                            description: cat.description || '',
                          },
                        })}
                        className="px-3 py-1.5 text-[10px] font-bold text-[#A50D1A] border border-[#A50D1A]/30 rounded-lg hover:bg-[#FCEEEE] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(cat)}
                        className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 border border-zinc-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SettingsView() {
  const [settings, setSettings] = useState({ notification_email: 'admin@idh.com' });
  const [loading, setLoading] = useState(true);
  
  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({ error: '', success: '', loading: false });

  // Email change state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState({ error: '', success: '', loading: false });

  useEffect(() => {
    getAppSettings().then(data => {
      if (data) {
        setSettings(data);
        setNotificationEmail(data.notification_email || 'admin@idh.com');
      }
      setLoading(false);
    });
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ error: '', success: '', loading: true });

    if (newPassword.length < 6) {
      setPasswordStatus({ error: 'Password must be at least 6 characters.', success: '', loading: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ error: 'Passwords do not match.', success: '', loading: false });
      return;
    }

    const res = await updateAdminPassword(newPassword);
    if (!res.success) {
      setPasswordStatus({ error: res.error || 'Failed to update password.', success: '', loading: false });
    } else {
      setPasswordStatus({ error: '', success: 'Admin password updated successfully!', loading: false });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordStatus({ error: '', success: '', loading: false });
      }, 2500);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailStatus({ error: '', success: '', loading: true });

    if (!notificationEmail || !notificationEmail.includes('@')) {
      setEmailStatus({ error: 'Please enter a valid email address.', success: '', loading: false });
      return;
    }

    const res = await updateAppSetting('notification_email', notificationEmail);
    if (!res.success) {
      setEmailStatus({ error: 'Failed to update notification email.', success: '', loading: false });
    } else {
      setSettings(prev => ({ ...prev, notification_email: notificationEmail }));
      setEmailStatus({ error: '', success: 'Notification email saved to app_settings!', loading: false });
      setTimeout(() => {
        setIsEditingEmail(false);
        setEmailStatus({ error: '', success: '', loading: false });
      }, 2000);
    }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="System configuration & Security" />
      <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-100 shadow-xs">
        
        {/* Row 1: Admin Password */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#23161A]">Admin Password</p>
              <p className="text-xs text-zinc-400 mt-0.5">Change the administrative access password</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsChangingPassword(!isChangingPassword);
                setPasswordStatus({ error: '', success: '', loading: false });
              }}
              className="text-xs font-bold text-[#A50D1A] hover:underline ml-6 flex-shrink-0"
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordSubmit} className="mt-3 pt-3 border-t border-zinc-100 max-w-md space-y-3 animate-fadeIn">
              {passwordStatus.error && (
                <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
                  {passwordStatus.error}
                </div>
              )}
              {passwordStatus.success && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-medium">
                  {passwordStatus.success}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#23161A] mb-1">New Password</label>
                <input
                  required
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:border-[#A50D1A] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#23161A] mb-1">Confirm New Password</label>
                <input
                  required
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:border-[#A50D1A] outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={passwordStatus.loading}
                className="px-4 py-2 bg-[#A50D1A] hover:bg-[#880a15] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-60"
              >
                {passwordStatus.loading ? 'Saving...' : 'Save New Password'}
              </button>
            </form>
          )}
        </div>

        {/* Row 2: Notification Email */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#23161A]">Notification Email</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Current: <span className="font-mono text-zinc-600 font-semibold">{settings.notification_email || 'admin@idh.com'}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsEditingEmail(!isEditingEmail);
                setEmailStatus({ error: '', success: '', loading: false });
              }}
              className="text-xs font-bold text-[#A50D1A] hover:underline ml-6 flex-shrink-0"
            >
              {isEditingEmail ? 'Cancel' : 'Update Email'}
            </button>
          </div>

          {isEditingEmail && (
            <form onSubmit={handleEmailSubmit} className="mt-3 pt-3 border-t border-zinc-100 max-w-md space-y-3 animate-fadeIn">
              {emailStatus.error && (
                <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
                  {emailStatus.error}
                </div>
              )}
              {emailStatus.success && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-medium">
                  {emailStatus.success}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#23161A] mb-1">System Alert & Notification Email</label>
                <input
                  required
                  type="email"
                  placeholder="alerts@idhcorp.com"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:border-[#A50D1A] outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={emailStatus.loading}
                className="px-4 py-2 bg-[#A50D1A] hover:bg-[#880a15] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-60"
              >
                {emailStatus.loading ? 'Saving...' : 'Save to app_settings'}
              </button>
            </form>
          )}
        </div>

        {/* Return to portal */}
        <div className="px-5 sm:px-6 py-4 bg-[#FAF5F3]/50 rounded-b-2xl">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#A50D1A] hover:text-[#880a15] hover:underline transition-colors cursor-pointer"
          >
            <span className="text-sm font-extrabold">←</span> Back to employee portal
          </a>
        </div>

      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared UI Primitives
// ─────────────────────────────────────────────────────────────

function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#23161A]">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-shrink-0">{children}</div>}
    </div>
  );
}

function StatCard({ icon, value, label, accent }) {
  const Icon = icon === 'emp' ? EmpIcon : icon === 'tag' ? TagIcon : HeartIcon;
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5">
      <div className={`w-8 h-8 rounded-xl bg-zinc-50 flex items-center justify-center mb-3 ${accent}`}>
        <Icon />
      </div>
      <p className="text-2xl font-extrabold text-[#23161A]">{value}</p>
      <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
    </div>
  );
}

function EmployeesTable({ employees, dependents = [], onToggleDependent, search, setSearch, mini, onViewAll }) {
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (key, defaultState) => {
    setExpandedIds((prev) => {
      const currentState = prev[key] !== undefined ? prev[key] : defaultState;
      return {
        ...prev,
        [key]: !currentState,
      };
    });
  };

  const getEmpDependents = (emp) => {
    return dependents.filter((d) => {
      if (!d.profile_id) return false;
      const target = String(d.profile_id).toLowerCase();
      const rawMatch = emp.rawId && String(emp.rawId).toLowerCase() === target;
      const idMatch = emp.id && (String(emp.id).toLowerCase() === target || target.startsWith(String(emp.id).toLowerCase()));
      return rawMatch || idMatch;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-bold text-[#23161A]">Employees</h2>
          <p className="text-xs text-zinc-400">Top benefit users this month</p>
        </div>
        <div className="flex items-center gap-2">
          {!mini && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees"
                className="pl-9 pr-4 py-2 rounded-xl border border-zinc-200 text-xs focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none bg-white w-44 sm:w-52 transition-all"
              />
            </div>
          )}
          {mini && onViewAll && (
            <button onClick={onViewAll} className="text-xs font-bold text-[#A50D1A] hover:underline">
              View all →
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/40">
              <th className="w-10 px-3 py-3 text-center"></th>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th>Benefits Used</Th>
              <Th>Status</Th>
              <Th>Last Active</Th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-zinc-400">
                  No employees found matching your search.
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const empKey = emp.rawId || emp.id;
                const empDependents = getEmpDependents(emp);
                const hasDependents = empDependents.length > 0;
                // Visible by default if employee has family members, or follows manual toggle
                const isExpanded = expandedIds[empKey] !== undefined ? expandedIds[empKey] : hasDependents;

                return (
                  <Fragment key={empKey}>
                    <tr
                      className={`border-b border-zinc-50 hover:bg-[#FAF5F3] transition-colors ${
                        isExpanded ? 'bg-[#FAF5F3]/50' : ''
                      }`}
                    >
                      {/* Expand Button Chevron */}
                      <td className="px-3 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggleExpand(empKey, hasDependents)}
                          className={`p-1.5 rounded-lg transition-all ${
                            hasDependents
                              ? 'text-[#A50D1A] bg-[#FCEEEE]/60 hover:bg-[#FCEEEE]'
                              : 'text-zinc-400 hover:text-[#A50D1A] hover:bg-[#FCEEEE]'
                          }`}
                          title={isExpanded ? 'Collapse family members' : 'View family members'}
                        >
                          <ChevronDownIcon
                            className={`w-4 h-4 transform transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-[#A50D1A]' : ''
                            }`}
                          />
                        </button>
                      </td>

                      {/* Employee info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: emp.color }}
                          >
                            {emp.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-semibold text-[#23161A]">{emp.name}</p>
                              {hasDependents && (
                                <span className="text-[9px] font-bold text-[#A50D1A] bg-[#FCEEEE] px-1.5 py-0.2 rounded-full border border-[#A50D1A]/15">
                                  {empDependents.length} {empDependents.length === 1 ? 'member' : 'members'}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-400">{emp.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-zinc-500">{emp.dept}</td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-zinc-700">{emp.used} of 7</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLE[emp.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[emp.status]}`} />
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-zinc-400">{emp.last}</td>
                    </tr>

                    {/* Expandable row for family members */}
                    {isExpanded && (
                      <tr className="bg-[#FAF5F3]/70 border-b border-[#ECE1DE] animate-fadeIn">
                        <td colSpan={6} className="px-5 sm:px-8 py-3.5">
                          <div className="pl-6 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-[#A50D1A] uppercase tracking-wider flex items-center gap-1.5">
                                <UsersIcon /> Family Members ({empDependents.length})
                              </span>
                            </div>

                            {empDependents.length === 0 ? (
                              <p className="text-xs text-zinc-500 italic py-1">
                                No family members added
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                                {empDependents.map((dep) => {
                                  const isActive = dep.is_active !== false && dep.isActive !== false;
                                  return (
                                    <div
                                      key={dep.id}
                                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                                        isActive
                                          ? 'bg-white border-[#ECE1DE] shadow-xs'
                                          : 'bg-zinc-100/75 border-zinc-200 opacity-65'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div
                                          className={`w-7 h-7 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 transition-colors ${
                                            isActive
                                              ? 'bg-[#FCEEEE] text-[#A50D1A]'
                                              : 'bg-zinc-200 text-zinc-500'
                                          }`}
                                        >
                                          {dep.full_name ? dep.full_name.trim().charAt(0).toUpperCase() : 'F'}
                                        </div>
                                        <div className="min-w-0">
                                          <p
                                            className={`text-xs font-semibold truncate ${
                                              isActive ? 'text-[#23161A]' : 'text-zinc-500 line-through decoration-zinc-400'
                                            }`}
                                          >
                                            {dep.full_name}
                                          </p>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[10px] text-zinc-400 capitalize">
                                              {dep.relationship}
                                            </span>
                                            {!isActive && (
                                              <span className="text-[9px] font-bold text-zinc-500 bg-zinc-200 px-1.5 py-0.2 rounded">
                                                Inactive
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0 ml-2">
                                        {/* Toggle Switch */}
                                        <button
                                          type="button"
                                          onClick={() => onToggleDependent && onToggleDependent(dep.id, isActive)}
                                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            isActive ? 'bg-[#A50D1A]' : 'bg-zinc-300'
                                          }`}
                                          title={isActive ? 'Deactivate family member' : 'Activate family member'}
                                        >
                                          <span
                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                              isActive ? 'translate-x-4' : 'translate-x-0'
                                            }`}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>

                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="text-left px-5 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}

// ─────────────────────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────────────────────

const S = { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round' };
const I = 'w-4 h-4';

function ChevronDownIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...S}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function GridIcon()     { return <svg className={I} {...S}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function UsersIcon()    { return <svg className={I} {...S}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function BagIcon()      { return <svg className={I} {...S}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>; }
function ChartIcon()    { return <svg className={I} {...S}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function SettingsIcon() { return <svg className={I} {...S}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function EmpIcon()      { return <svg className={I} {...S}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function TagIcon()      { return <svg className={I} {...S}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>; }
function HeartIcon()    { return <svg className={I} {...S}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function BellIcon()     { return <svg className={I} {...S}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function DownloadIcon() { return <svg className={I} {...S}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function SearchIcon()   { return <svg className="w-3.5 h-3.5" {...S}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function MenuIcon()     { return <svg className={I} {...S}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
function LogOutIcon()   { return <svg className={I} {...S}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function PlusIcon()     { return <svg className={I} {...S}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function LayersIcon()   { return <svg className={I} {...S}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>; }

