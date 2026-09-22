# 🏥 IDH Benefits Platform

> An exclusive discounts and benefits portal for employees of **IDH (Integrated Diagnostics Holdings)** — the parent company of Al Borg Laboratories, Al Mokhtabar, and Echocan Radiology Centers.

---

## 📌 Table of Contents
1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Database Schema](#-database-schema)
6. [Setup & Installation](#-setup--installation)
7. [Admin Panel](#-admin-panel)
8. [Auth & Roles](#-auth--roles)

---

## 🌟 Overview

The **IDH Benefits Platform** was built to provide a unified, interactive portal for all IDH employees to take advantage of:
- Exclusive medical discounts at Al Borg, Al Mokhtabar, and Echocan centers — up to 55% off.
- Promotional offers and partnerships with major brands in dining, travel, electronics, fashion, and services.
- Family Dependents management to allow family members to benefit from medical discounts.
- Branch locator and home visit scheduling (Home Sample Collection).

---

## 🚀 Key Features

### 1. Perks & Deals Discovery
- Browse benefits organized by category: **Health, Dining, Travel, Electronics, Fashion, Services**.
- Live search and filtering by governorate and subcategory.
- View full details of each offer (terms of use, discount rate, promo code, ratings, and expiry date).

### 2. My Family & Dependents
- Add registered family dependents (spouse, children, parents).
- Activate or deactivate a dependent's card and use discounts on their behalf.

### 3. Branch Locator & Booking
- Interactive database of Al Borg, Al Mokhtabar, and Echocan branches across Egypt's governorates.
- Branch details (address, working hours, contact numbers, parking availability, home visit support).
- Home Sample Collection booking form.

### 4. Redemption Tracking
- Automatically logs code redemptions and usage in the database, with offline fallback support.

### 5. Admin Dashboard (`/admin`)
- General statistics (total offers, categories, dependents, and redemptions).
- Full management of offers (add, edit, delete).
- Category management including icons and sort order.
- User and family member management.
- System settings and admin password change.

---

## 🛠 Tech Stack

| Area | Technology | Description |
|---|---|---|
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) | Modern React framework using App Router |
| **UI Library** | [React 18](https://react.dev/) | Building interactive and dynamic interfaces |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Clean, modern design with full mobile & RTL/LTR support |
| **Icons** | [Lucide React](https://lucide.dev/) | Comprehensive and modern icon library |
| **Database & Auth** | [Supabase](https://supabase.com/) | Cloud PostgreSQL database + user authentication & session management |
| **State Management** | React Context API | Managing login state and employee data (`AuthContext.jsx`) |

---

## 📂 Project Structure

```text
IDH Benefits/
├── app/                        # App pages and routing (Next.js App Router)
│   ├── admin/                  # Admin dashboard
│   │   ├── login/              # Admin login page
│   │   └── page.js             # Benefits, categories, and user management UI
│   ├── forgot-password/        # Password recovery
│   ├── reset-password/         # Set a new password
│   ├── login/                  # Employee login
│   ├── signup/                 # New employee registration
│   ├── globals.css             # Global styles and CSS variables
│   ├── layout.js               # Root layout, fonts, and AuthProvider
│   └── page.js                 # Public homepage and benefits display
├── components/                 # Reusable UI components
│   ├── AuthModal.jsx           # Login popup modal
│   ├── BenefitDetailModal.jsx  # Benefit details and promo code
│   ├── BenefitFormModal.jsx    # Add/edit benefit form (admin)
│   ├── BookingModal.jsx        # Home visit / sample collection booking form
│   ├── BranchLocator.jsx       # Branch search and governorate filter
│   ├── CategoryDetailView.jsx  # Browse offers within a specific category
│   ├── CategoryFormModal.jsx   # Add/edit category form (admin)
│   ├── CategoryGrid.jsx        # Main categories grid
│   ├── DealsList.jsx           # Offer and benefit cards
│   ├── Footer.jsx & CTA.jsx    # Footer and contact links
│   ├── Header.jsx              # Top navigation bar and employee info
│   ├── HeroSection.jsx         # Welcome screen and search
│   ├── IdhLogo.jsx             # IDH Group SVG logo
│   └── MyFamilySection.jsx     # Dependents and family management section
├── context/
│   └── AuthContext.jsx         # Auth context provider and personal data
├── lib/
│   ├── api.js                  # Supabase table integration functions (CRUD)
│   ├── iconMap.js              # Maps icon names to Lucide components
│   └── supabase.js             # Supabase client initialization
├── public/                     # Static files and images
└── supabase/
    └── seed.sql                # Initial seed data script
```

---

## 🗄 Database Schema

The platform uses the following tables in Supabase:

1. **`profiles`**:
   - `id` (UUID): Linked to the user account in `auth.users`.
   - `full_name`, `email`, `employee_id`, `department`, `role` (`employee` or `admin`).

2. **`categories`**:
   - `id` (text / slug), `name_en`, `name_ar`, `icon`, `subtitle_en`, `subtitle_ar`, `sort_order`.

3. **`perks` / `benefits`**:
   - `id`, `category`, `title_en`, `title_ar`, `brand_name`, `badge`, `location`, `subcat`, `discount`, `code`, `rating`, `popular`, `description_en`, `description_ar`, `terms_en`, `terms_ar`, `home_collection`, `valid_until`, `family_allowed`.

4. **`dependents`**:
   - `id`, `profile_id` (FK to profiles), `full_name`, `relationship`, `is_active`, `created_at`.

5. **`branches`**:
   - `id`, `provider_name`, `name_en`, `name_ar`, `governorate`, `address_en`, `hours_en`, `phone`, `has_home_visit`, `has_parking`.

6. **`redemptions`**:
   - `id`, `profile_id`, `perk_title`, `dependent_id`, `redeemed_at`.

7. **`app_settings`**:
   - `key`, `value`, `updated_at`.

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (version 18 or later).
- A [Supabase](https://supabase.com/) account.

### 2. Clone the project and install dependencies
```bash
cd "IDH Benefits"
npm install
```

### 3. Configure environment variables (`.env.local`)
Create a `.env.local` file in the root directory and add:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Initialize the database
- Go to your **Supabase Dashboard** → **SQL Editor**.
- Copy and run the contents of `supabase/seed.sql` to create and populate the default categories and offers.

### 5. Run the development server
```bash
npm run dev
```
Open your browser at: `http://localhost:3000`

---

## 🛡 Auth & Roles

- **Employees:**
  - Register a new account with employee ID, department, and email.
  - Or use the **Demo Login** for an instant experience without creating an account.

- **Admins:**
  - Log in via `/admin/login` or change the account role to `admin` in the `profiles` table.
  - Full access to add, edit, and delete all platform content.

