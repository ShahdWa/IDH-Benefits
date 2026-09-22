// lib/api.js
// All Supabase data-fetching functions live here.

import { supabase } from './supabase';

// ─────────────────────────────────────────────────────────────
// Fallback static categories if DB table is empty
// ─────────────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES = [
  {
    id: 'restaurants',
    nameEn: 'Restaurants',
    nameAr: 'المطاعم والكافيهات',
    icon: 'UtensilsCrossed',
    subtitleEn: 'Save on dining across 40+ partner restaurants and cafes.',
    subtitleAr: 'وفر في أكثر من 40+ مطعم وكافيه معتمد',
    span: 'col-span-6 md:col-span-2',
  },
  {
    id: 'travel',
    nameEn: 'Travel and tourism',
    nameAr: 'السفر والسياحة',
    icon: 'Plane',
    subtitleEn: 'Exclusive hotel, resort and flight travel packages.',
    subtitleAr: 'عروض الفنادق وتذاكر الطيران للرحلات',
    span: 'col-span-6 md:col-span-4',
  },
  {
    id: 'electronics',
    nameEn: 'Electronics',
    nameAr: 'الأجهزة والإلكترونيات',
    icon: 'Cpu',
    subtitleEn: 'Discounted devices, laptops, and original accessories.',
    subtitleAr: 'خصومات الأجهزة والإكسسوارات الأصلية',
    span: 'col-span-6 md:col-span-3',
  },
  {
    id: 'fashion',
    nameEn: 'Fashion',
    nameAr: 'الأزياء والملابس',
    icon: 'Shirt',
    subtitleEn: 'Savings at top international fashion brands.',
    subtitleAr: 'أرقى الماركات العالمية للملابس',
    span: 'col-span-6 md:col-span-3',
  },
  {
    id: 'health',
    nameEn: 'Health',
    nameAr: 'الصحة والعيادات',
    icon: 'HeartPulse',
    subtitleEn: 'Diagnostics, Al Borg, Al Mokhtabar, and clinic perks.',
    subtitleAr: 'خصومات البرج والمختبر والعيادات الطبية',
    span: 'col-span-6 md:col-span-3',
  },
  {
    id: 'services',
    nameEn: 'Services',
    nameAr: 'الخدمات والصيانة',
    icon: 'Wrench',
    subtitleEn: 'Fitness, maintenance, home cleaning, and spa services.',
    subtitleAr: 'خدمات النظافة والجيم والصيانة',
    span: 'col-span-6 md:col-span-3',
  },
];

// ─────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────

// Module-level cache — persists for the lifetime of the browser session
let _categoriesCache = null;
let _benefitsCache   = null;

export async function getCategories() {
  if (_categoriesCache) return _categoriesCache;   // ← instant on repeat calls
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      _categoriesCache = DEFAULT_CATEGORIES;
      return DEFAULT_CATEGORIES;
    }

    _categoriesCache = data.map((c, idx) => ({
      id:         c.slug || c.id || c.name,
      nameEn:     c.name_en || c.name,
      nameAr:     c.name_ar || c.name,
      icon:       c.icon || DEFAULT_CATEGORIES[idx % DEFAULT_CATEGORIES.length]?.icon || 'Sparkles',
      subtitleEn: c.subtitle_en || 'Exclusive discounts for IDH employees.',
      subtitleAr: c.subtitle_ar || 'خصومات حصرية لموظفي IDH.',
      span:       c.span || DEFAULT_CATEGORIES.find(dc => dc.id === (c.slug || c.id))?.span || 'col-span-6 md:col-span-3',
    }));
    return _categoriesCache;
  } catch (err) {
    console.error('[getCategories]', err);
    _categoriesCache = DEFAULT_CATEGORIES;
    return DEFAULT_CATEGORIES;
  }
}

// ─────────────────────────────────────────────────────────────
// Categories CRUD (Admin only — requires is_admin() RLS policy)
// ─────────────────────────────────────────────────────────────

export async function createCategory(data) {
  const { error } = await supabase.from('categories').insert(data);
  if (error) return { success: false, error: error.message };
  _categoriesCache = null; // invalidate cache
  return { success: true };
}

export async function updateCategory(name, data) {
  const { error } = await supabase.from('categories').update(data).eq('name', name);
  if (error) return { success: false, error: error.message };
  _categoriesCache = null; // invalidate cache
  return { success: true };
}

export async function deleteCategory(name) {
  const { error } = await supabase.from('categories').delete().eq('name', name);
  if (error) return { success: false, error: error.message };
  _categoriesCache = null; // invalidate cache
  return { success: true };
}

// Helper: count perks linked to a category (for delete warning)
export async function countPerksByCategory(categoryName) {
  try {
    const { count, error } = await supabase
      .from('perks')
      .select('*', { count: 'exact', head: true })
      .eq('category', categoryName);
    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────
// Perks & Benefits
// ─────────────────────────────────────────────────────────────

export async function getBenefits(category, search) {
  try {
    // Use cache when fetching all benefits (no filter)
    if (!category && !search && _benefitsCache) return _benefitsCache;

    let query = supabase.from('perks').select('*');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search && search.trim()) {
      const q = search.trim();
      query = query.or(
        `title.ilike.%${q}%,brand_name.ilike.%${q}%,code.ilike.%${q}%,category.ilike.%${q}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.warn('[getBenefits] perks error:', error.message);
      return [];
    }

    const result = (data || []).map(normalisePerk);

    // Cache only the full unfiltered list
    if (!category && !search) _benefitsCache = result;

    return result;
  } catch (err) {
    console.error('[getBenefits]', err);
    return [];
  }
}

export async function getBenefitById(idOrTitle) {
  try {
    let { data, error } = await supabase
      .from('perks')
      .select('*')
      .or(`id.eq.${idOrTitle},title.eq.${idOrTitle}`)
      .single();

    if (error || !data) {
      const bRes = await supabase
        .from('benefits')
        .select('*')
        .or(`id.eq.${idOrTitle},title_en.eq.${idOrTitle}`)
        .single();
      if (!bRes.error && bRes.data) {
        data = bRes.data;
      }
    }

    if (!data) return null;
    return normalisePerk(data);
  } catch (err) {
    console.error('[getBenefitById]', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Perks CRUD (Admin only — requires is_admin() RLS policy)
// ─────────────────────────────────────────────────────────────

export async function createBenefit(data) {
  const { error } = await supabase.from('perks').insert(data);
  if (error) return { success: false, error: error.message };
  _benefitsCache = null; // invalidate cache
  return { success: true };
}

export async function updateBenefit(title, data) {
  const { error } = await supabase.from('perks').update(data).eq('title', title);
  if (error) return { success: false, error: error.message };
  _benefitsCache = null; // invalidate cache
  return { success: true };
}

export async function deleteBenefit(title) {
  const { error } = await supabase.from('perks').delete().eq('title', title);
  if (error) return { success: false, error: error.message };
  _benefitsCache = null; // invalidate cache
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// Dependents (Family Members)
// ─────────────────────────────────────────────────────────────

function normaliseDependent(d) {
  if (!d) return null;
  const active = d.is_active !== undefined && d.is_active !== null ? Boolean(d.is_active) : true;
  return {
    ...d,
    is_active: active,
    isActive:  active,
  };
}

export async function getDependents() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('dependents')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: true });
    if (error) return [];
    return (data || []).map(normaliseDependent);
  } catch {
    return [];
  }
}

export async function addDependent(fullName, relationship) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };
    const { error } = await supabase.from('dependents').insert({
      profile_id:   user.id,
      full_name:    fullName,
      relationship: relationship,
      is_active:    true,
    });
    return error ? { success: false, error: error.message } : { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteDependent(id) {
  const { error } = await supabase.from('dependents').delete().eq('id', id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function updateDependent(id, fullName, relationship) {
  try {
    const { error } = await supabase
      .from('dependents')
      .update({
        full_name: fullName,
        relationship: relationship,
      })
      .eq('id', id);
    if (error) {
      const del = await deleteDependent(id);
      if (!del.success) return { success: false, error: error.message };
      return await addDependent(fullName, relationship);
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function toggleDependentActive(id, isActive) {
  try {
    const { error } = await supabase
      .from('dependents')
      .update({ is_active: isActive })
      .eq('id', id);
    return error ? { success: false, error: error.message } : { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getAllDependents() {
  try {
    const { data, error } = await supabase
      .from('dependents')
      .select('*, profiles(full_name, email, department)');
    if (error) {
      // Fallback in case the relationship alias differs
      const { data: fallbackData } = await supabase.from('dependents').select('*');
      return (fallbackData || []).map(normaliseDependent);
    }
    return (data || []).map(normaliseDependent);
  } catch (err) {
    console.error('[getAllDependents error]', err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Redemptions / Benefit Usage Tracking
// ─────────────────────────────────────────────────────────────

export async function recordRedemption(benefitId, benefitTitle, employeeIdentifier, dependentId = null) {
  try {
    // Get current authenticated user's id for profile_id
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('redemptions').insert([
      {
        profile_id:   user?.id || null,
        perk_title:   benefitTitle || 'IDH Perk',
        redeemed_at:  new Date().toISOString(),
        dependent_id: dependentId || null,
      },
    ]);

    if (error) {
      console.warn('[recordRedemption error]', error.message);
      // Local tracking fallback
      const current = JSON.parse(localStorage.getItem('idh_redemptions_count') || '0');
      localStorage.setItem('idh_redemptions_count', JSON.stringify(current + 1));
    }
  } catch (err) {
    console.error('[recordRedemption]', err);
    const current = JSON.parse(localStorage.getItem('idh_redemptions_count') || '0');
    localStorage.setItem('idh_redemptions_count', JSON.stringify(current + 1));
  }
}

export async function getRedemptions() {
  try {
    const { data, error } = await supabase
      .from('redemptions')
      .select('id, profile_id, perk_title, redeemed_at')
      .order('redeemed_at', { ascending: false });

    if (error) {
      console.warn('[getRedemptions error]', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('[getRedemptions]', err);
    return [];
  }
}

export async function getRedemptionsCount() {
  try {
    const { count, error } = await supabase
      .from('redemptions')
      .select('*', { count: 'exact', head: true });

    if (!error && typeof count === 'number') {
      return count;
    }

    const all = await getRedemptions();
    if (all && all.length > 0) return all.length;

    // Return stored or calculated fallback
    const local = JSON.parse(localStorage.getItem('idh_redemptions_count') || '0');
    return local;
  } catch {
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────
// Profiles
// ─────────────────────────────────────────────────────────────

export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('[getMyProfile]', error.message);
    return null;
  }
  return data;
}

// ─────────────────────────────────────────────────────────────
// Branches (Al Borg, Al Mokhtabar, EchoScan)
// ─────────────────────────────────────────────────────────────

export const DEFAULT_GOVERNORATES = ['All', 'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea'];

export const DEFAULT_BRANCHES = [
  {
    id: 'br-1',
    providerName: 'Al Borg Laboratories',
    nameEn: 'Nasr City - Makram Ebeid Branch',
    governorate: 'Cairo',
    addressEn: '24 Makram Ebeid St, Zone 6, Nasr City',
    hoursEn: '8:00 AM - 11:00 PM (Daily)',
    phone: '19911',
    hasHomeVisit: true,
    hasParking: true,
  },
  {
    id: 'br-2',
    providerName: 'Al Mokhtabar',
    nameEn: 'Mohandessin - Lebanon Square Branch',
    governorate: 'Giza',
    addressEn: '18 Lebanon St, Lebanon Square, Mohandessin',
    hoursEn: '7:30 AM - 11:30 PM (Daily)',
    phone: '19014',
    hasHomeVisit: true,
    hasParking: false,
  },
  {
    id: 'br-3',
    providerName: 'EchoScan Centers',
    nameEn: 'Dokki - MRI & Radiology Center',
    governorate: 'Giza',
    addressEn: '45 Mossadak St, Dokki, Giza',
    hoursEn: '9:00 AM - 10:00 PM (Fri Closed)',
    phone: '16902',
    hasHomeVisit: false,
    hasParking: true,
  },
  {
    id: 'br-4',
    providerName: 'Al Borg Laboratories',
    nameEn: 'Alexandria - Smouha Branch',
    governorate: 'Alexandria',
    addressEn: 'Victor Emmanuel Square, Smouha, Alexandria',
    hoursEn: '8:00 AM - 10:30 PM',
    phone: '19911',
    hasHomeVisit: true,
    hasParking: true,
  },
  {
    id: 'br-5',
    providerName: 'Al Mokhtabar',
    nameEn: 'New Cairo - Trivium Square Branch',
    governorate: 'Cairo',
    addressEn: 'North 90th St, 5th Settlement, New Cairo',
    hoursEn: '8:00 AM - 11:00 PM',
    phone: '19014',
    hasHomeVisit: true,
    hasParking: true,
  },
  {
    id: 'br-6',
    providerName: 'Al Borg Laboratories',
    nameEn: 'Mansoura - Mashaya Branch',
    governorate: 'Dakahlia',
    addressEn: 'Lower Mashaya St, Opp. Teachers Club, Mansoura',
    hoursEn: '8:00 AM - 10:00 PM',
    phone: '19911',
    hasHomeVisit: true,
    hasParking: false,
  },
];

export async function getBranches(governorate, search) {
  try {
    let query = supabase.from('branches').select('*');

    if (governorate && governorate !== 'All' && governorate !== 'الكل') {
      query = query.eq('governorate', governorate);
    }

    if (search && search.trim()) {
      const q = search.trim();
      query = query.or(`name_en.ilike.%${q}%,name_ar.ilike.%${q}%,address_en.ilike.%${q}%,address_ar.ilike.%${q}%,provider_name.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback
      return DEFAULT_BRANCHES.filter(b => {
        const matchGov = !governorate || governorate === 'All' || governorate === 'الكل' || b.governorate.toLowerCase() === governorate.toLowerCase();
        const matchSearch = !search || !search.trim() || 
          (b.nameEn && b.nameEn.toLowerCase().includes(search.toLowerCase())) ||
          (b.addressEn && b.addressEn.toLowerCase().includes(search.toLowerCase())) ||
          (b.providerName && b.providerName.toLowerCase().includes(search.toLowerCase()));
        return matchGov && matchSearch;
      });
    }

    return data.map(b => ({
      id:           b.id,
      providerName: b.provider_name || b.providerName || 'IDH Provider',
      nameEn:       b.name_en || b.nameEn || b.name_ar || b.name,
      governorate:  b.governorate || 'Cairo',
      addressEn:    b.address_en || b.addressEn || b.address_ar || b.address,
      hoursEn:      b.hours_en || b.hoursEn || b.hours_ar || b.hours || '8:00 AM - 10:00 PM',
      phone:        b.phone || '19911',
      hasHomeVisit: b.has_home_visit ?? b.hasHomeVisit ?? true,
      hasParking:   b.has_parking ?? b.hasParking ?? false,
    }));
  } catch (err) {
    console.error('[getBranches]', err);
    return DEFAULT_BRANCHES;
  }
}

// ─────────────────────────────────────────────────────────────
// Admin helpers
// ─────────────────────────────────────────────────────────────

export async function checkIsAdmin() {
  try {
    const { data, error } = await supabase.rpc('is_admin');
    if (error) {
      // Fallback: check profile role directly
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      return profile?.role === 'admin';
    }
    return !!data;
  } catch {
    return false;
  }
}

export async function getAppSettings() {
  try {
    const { data, error } = await supabase.from('app_settings').select('*');
    if (error || !data) {
      const local = localStorage.getItem('idh_app_settings');
      return local ? JSON.parse(local) : { notification_email: 'admin@idh.com' };
    }
    const settingsObj = {};
    data.forEach(item => {
      settingsObj[item.key] = item.value;
    });
    return settingsObj;
  } catch {
    const local = localStorage.getItem('idh_app_settings');
    return local ? JSON.parse(local) : { notification_email: 'admin@idh.com' };
  }
}

export async function updateAppSetting(key, value) {
  try {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    // Also persist in localStorage fallback
    const current = JSON.parse(localStorage.getItem('idh_app_settings') || '{}');
    current[key] = value;
    localStorage.setItem('idh_app_settings', JSON.stringify(current));

    if (error) {
      console.warn('[updateAppSetting] Supabase error, stored locally:', error.message);
    }
    return { success: true };
  } catch (err) {
    const current = JSON.parse(localStorage.getItem('idh_app_settings') || '{}');
    current[key] = value;
    localStorage.setItem('idh_app_settings', JSON.stringify(current));
    return { success: true };
  }
}

export async function updateAdminPassword(newPassword) {
  try {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to update password' };
  }
}

// ─────────────────────────────────────────────────────────────
// Normaliser
// ─────────────────────────────────────────────────────────────

function normalisePerk(p) {
  return {
    id:             p.id       ?? p.title ?? p.title_en,
    category:       p.category,
    titleEn:        p.title_en ?? p.title,
    titleAr:        p.title_ar ?? p.title,
    brandName:      p.brand_name,
    badge:          p.badge    ?? (p.brand_name ? p.brand_name.slice(0, 2).toUpperCase() : 'IDH'),
    location:       p.location ?? 'All Branches, Egypt',
    subcat:         p.subcat   ?? p.sub_category ?? 'Cairo',
    discount:       p.discount ?? 'Special Offer',
    code:           p.code     ?? 'IDH-PERK',
    rating:         p.rating   ?? 4.9,
    popular:        p.popular  ?? false,
    descriptionEn:  p.description_en ?? p.description ?? '',
    descriptionAr:  p.description_ar ?? p.description ?? '',
    termsEn:        p.terms_en ?? p.terms ?? 'Present your IDH Employee ID Card.',
    termsAr:        p.terms_ar ?? p.terms ?? 'إبراز كارت الموظف IDH عند الاستخدام.',
    homeCollection: p.home_collection ?? false,
    validUntil:     p.valid_until ?? '2026-12-31',
    familyAllowed:  p.family_allowed ?? false,
  };
}
