-- ============================================================
--  IDH Benefits — Supabase Seed Script
--  Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. CATEGORIES ──────────────────────────────────────────

INSERT INTO categories (id, name_en, name_ar, icon, subtitle_en, subtitle_ar, sort_order) VALUES
  ('restaurants', 'Restaurants',        'المطاعم والكافيهات',      'UtensilsCrossed', 'Save on dining across 40+ partner restaurants and cafes.', 'وفر في أكثر من 40+ مطعم وكافيه معتمد', 1),
  ('travel',      'Travel and tourism', 'السفر والسياحة',           'Plane',           'Exclusive hotel, resort and flight travel packages.',       'عروض الفنادق وذاكر الطيران للرحلات',   2),
  ('electronics', 'Electronics',        'الأجهزة والإلكترونيات',   'Cpu',             'Discounted devices, laptops, and original accessories.',    'خصومات الأجهزة والإكسسوارات الأصلية',  3),
  ('fashion',     'Fashion',            'الأزياء والملابس',         'Shirt',           'Savings at top international fashion brands.',               'أرقى الماركات العالمية للملابس',        4),
  ('health',      'Health',             'الصحة والعيادات',          'HeartPulse',      'Diagnostics, Al Borg, Al Mokhtabar, and clinic perks.',     'خصومات البرج والمختبر والعيادات الطبية', 5),
  ('services',    'Services',           'الخدمات والصيانة',         'Wrench',          'Fitness, maintenance, home cleaning, and spa services.',    'خدمات النظافة والجيم والصيانة',         6)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  icon = EXCLUDED.icon,
  subtitle_en = EXCLUDED.subtitle_en,
  subtitle_ar = EXCLUDED.subtitle_ar,
  sort_order = EXCLUDED.sort_order;

-- ── 2. BENEFITS ────────────────────────────────────────────

INSERT INTO benefits (id, category, title_en, title_ar, brand_name, badge, location, subcat, discount, code, rating, popular, description_en, description_ar, terms_en, terms_ar, home_collection, valid_until) VALUES

-- Health
('b-h1', 'health', 'Al Borg Laboratories - Full Diagnostics', 'معامل البرج - خصم شامل على كافة التحاليل', 'Al Borg Labs', 'AB', 'All Branches, Egypt', 'Cairo', '55% off', 'IDH-BORG-55', 4.9, true,
  'Exclusive 55% discount on all medical test profiles, CBC, Vitamin D, and annual checkups across 220+ Al Borg branches.',
  'خصم حصري 55% على كافة الفحوصات والتحاليل الطبية الشاملة وفيتامين د في أكثر من 220 فرع بمعامل البرج.',
  'Present your IDH Employee ID Card at any branch counter.',
  'إبراز كارت الموظف IDH الرقمي أو البطاقة عند شباك الاستقبال.',
  true, '2026-12-31'),

('b-h2', 'health', 'Al Mokhtabar - Specialized Panels', 'معامل المختبر - فحوصات متخصصة وزيارة منزلية', 'Al Mokhtabar', 'AM', 'All Branches, Egypt', 'Cairo', '50% off', 'IDH-MOKH-50', 4.95, true,
  '50% discount on diabetes care panels, hormone profiles, and free home sample collection.',
  'خصم 50% على باقات السكري والتتبع الهرموني مع سحب عينات منزلية مجانية.',
  'Free home visit for orders over 500 EGP using code IDH-MOKH-50.',
  'زيارة منزلية مجانية للطلبات فوق 500 ج.م باستعمال الكود.',
  true, '2026-12-31'),

('b-h3', 'health', 'EchoScan - Advanced MRI & Radiology', 'مراكز إيكوسكان - الأشعة المقطعية والرنين', 'EchoScan Radiology', 'ES', 'Mohandessin, Cairo', 'Cairo', '40% off', 'IDH-ECHO-40', 4.85, false,
  '40% reduction on MRI scans, CT scans, 4D Ultrasound, and digital X-rays with consultant reports.',
  'خصم 40% على الأشعة المقطعية والرنين المغناطيسي والموجات الصوتية 4D مع التقرير الإستشاري.',
  'Prior appointment required via call center 16902.',
  'يتطلب حجز موعد مسبقاً عبر الكول سنتر.',
  false, '2026-12-31'),

-- Restaurants
('b-r3', 'restaurants', 'Zahra Bistro', 'مطعم زهرة بيسترو', 'Zahra Bistro', 'ZB', 'Zamalek, Cairo', 'Cairo', '25% off', 'IDH-ZAHRA-25', 4.8, true,
  'Modern Egyptian cuisine in a relaxed setting.',
  'مأكولات مصرية حديثة في أجواء هادئة وفاخرة.',
  'Present IDH Employee Card on order.',
  'إبراز بطاقة الموظف عند الطلب.',
  false, '2026-12-31'),

('b-r4', 'restaurants', 'Cairo Grill House', 'كايرو جريل هاوس', 'Cairo Grill House', 'CG', 'Maadi, Cairo', 'Cairo', '20% off', 'IDH-GRILL-20', 4.7, true,
  'Grilled meats and mezze, family-style dining.',
  'مشويات عائلية ومشويات شرقية فاخرة.',
  'Valid for dine-in & takeaway.',
  'يسري على الصالة والسفري.',
  false, '2026-12-31'),

('b-r5', 'restaurants', 'Nile Breeze Cafe', 'نايل بريز كافيه', 'Nile Breeze Cafe', 'NB', 'Garden City, Cairo', 'Fine dining', '15% off', 'IDH-NILE-15', 4.9, false,
  'Riverside cafe with all-day breakfast menu.',
  'كافيه مطب على النيل مع قائمة إفطار ومشروبات متكاملة.',
  'Valid every day.',
  'ساري جميع أيام الأسبوع.',
  false, '2026-12-31'),

('b-r6', 'restaurants', 'Bun & Burger', 'بان اند برجر', 'Bun & Burger', 'B&', 'Heliopolis, Cairo', 'Delivery only', '30% off', 'IDH-BUN-30', 4.85, true,
  'Gourmet burgers & hand-cut fresh fries.',
  'برجر فاخر مصنوع من اللحم الطازج يومياً.',
  'Valid on online orders.',
  'ساري على طلبات الدليفري.',
  false, '2026-12-31'),

('b-r7', 'restaurants', 'Sushi Room', 'سوشي روم', 'Sushi Room', 'SR', 'New Cairo, Cairo', 'Fine dining', '10% off', 'IDH-SUSHI-10', 4.95, false,
  'Fresh Japanese sushi & sashimi offerings.',
  'سوشي ياباني طازج وأطباق آسيوية فاخرة.',
  'Reservation recommended.',
  'يفضل الحجز المسبق.',
  false, '2026-12-31'),

('b-r8', 'restaurants', 'Al Rida Sweets', 'حلويات الرضا', 'Al Rida Sweets', 'AR', 'Giza, Cairo', 'Alexandria', 'buy 1 get 1', 'IDH-RIDA-B1G1', 4.75, false,
  'Traditional oriental pastries & fresh sweets.',
  'حلويات شرقية طازجة وبسيمة وبسبوسة فاخرة.',
  'Valid on selected pastry boxes.',
  'ساري على علب الحلويات المحددة.',
  false, '2026-12-31'),

-- Travel
('b-t1', 'travel', 'Travco Holidays - Hotel & Flight Packages', 'ترافكو للسياحة - باقات السفر والفنادق', 'Travco Holidays', 'TH', 'Red Sea & Coast', 'Alexandria', '25% off', 'IDH-TRAV-25', 4.9, true,
  'Exclusive 25% discount on domestic hotel bookings in Red Sea, North Coast, and flight packages.',
  'خصم 25% على حجوزات الفنادق الداخلية في البحر الأحمر والساحل الشمالي وتذاكر الطيران.',
  'Book online or through Travco travel desk with corporate ID.',
  'الحجز من خلال موقع ترافكو أو فروع الشركة.',
  false, '2026-12-31'),

-- Electronics
('b-e1', 'electronics', 'Tradeline - Apple Authorized Reseller', 'تريد لاين - الموزع المعتمد لـ Apple', 'Tradeline Stores', 'TL', 'All Malls, Cairo', 'Cairo', '12% off', 'IDH-TRADE-12', 4.9, true,
  'Special corporate discounts on MacBooks, iPads, Apple Watches, and original accessories plus 0% interest installment.',
  'خصومات خاصة للموظفين على أجهزة Mac و iPad و Apple Watch والإكسسوارات الأصلية مع تقسيط بدون فوائد.',
  'Valid in-store upon presenting active IDH digital employee card.',
  'يسري داخل الفروع فقط عند تقديم بطاقة الموظف.',
  false, '2026-12-31'),

-- Fashion
('b-f1', 'fashion', 'Zara & Massimo Dutti - Corporate Savings', 'زارا وماسيمو دوتي - خصومات الأزياء', 'Inditex Fashion', 'ZF', 'Mall of Arabia & Egypt', 'Cairo', '18% off', 'IDH-IND-18', 4.85, false,
  '18% discount voucher code redeemable at official partner stores for apparel and footwear.',
  'كوبون خصم 18% على الملابس والأحذية في المتاجر المعتمدة.',
  'One voucher code per employee per month.',
  'كود واحد شهرياً لكل موظف.',
  false, '2026-12-31'),

-- Services
('b-s1', 'services', 'Fitbit & Fitness First Gyms', 'فيتنس فيرست - اشتراكات الجيم والرياضة', 'Fitness First ME', 'FF', 'Major Hubs, Egypt', 'Cairo', '30% off', 'IDH-FIT-30', 4.8, true,
  '30% corporate discount on annual gym memberships, personal training, and spa facilities.',
  'خصم 30% على الاشتراكات السنوية والجلسات الرياضية والسبا.',
  'Applicable to IDH employees and immediate family members.',
  'يشمل الموظف وأفراد الأسرة المباشرين.',
  false, '2026-12-31')

ON CONFLICT (id) DO UPDATE SET
  category       = EXCLUDED.category,
  title_en       = EXCLUDED.title_en,
  title_ar       = EXCLUDED.title_ar,
  brand_name     = EXCLUDED.brand_name,
  discount       = EXCLUDED.discount,
  code           = EXCLUDED.code,
  rating         = EXCLUDED.rating,
  popular        = EXCLUDED.popular,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  terms_en       = EXCLUDED.terms_en,
  terms_ar       = EXCLUDED.terms_ar,
  home_collection = EXCLUDED.home_collection,
  valid_until    = EXCLUDED.valid_until;
