## Goal

Make **every piece of content** on the website editable from the admin panel, then move everything off Supabase onto your VPS (Express + Postgres). After this, you control 100% of the site through `/admin` with zero code deploys for content changes.

---

## Phase 1 — Build CMS for hardcoded content (VPS Express + Postgres)

Add new admin pages + DB tables for content that's currently hardcoded in the React code.

### 1.1 Home page CMS (`/admin/home`)
New tables on VPS Postgres:
- `home_hero` (singleton): headline, subheadline, background_image_url, primary_cta_label, primary_cta_link, secondary_cta_label, secondary_cta_link
- `home_stats` (list): label, value, icon, display_order
- `home_services` (list): title, description, icon, link, display_order, is_active — replaces hardcoded `SERVICES`
- `home_destinations` (list): name, image_url, country_slug, display_order — replaces `DESTINATIONS`
- `home_testimonials` (list): name, role, photo_url, quote, rating, display_order, is_active — replaces `TESTIMONIALS`
- `home_why_choose_us` (list): title, description, icon, display_order

### 1.2 About page CMS (`/admin/about`)
- `about_page` (singleton): hero_title, hero_text, mission, vision, story_html, image_url
- `about_pillars` (list): title, description, icon, display_order — replaces `PILLARS`
- `about_team` (list): name, role, photo_url, bio, display_order

### 1.3 Services page CMS (`/admin/services-page`)
- `services_items` (list): title, description, icon, link, display_order — replaces `ITEMS`

### 1.4 FAQ CMS (`/admin/faqs`)
- `faqs` (list): question, answer, category, display_order, is_active — replaces hardcoded `FAQS`

### 1.5 Header & Footer CMS (`/admin/navigation`)
- `nav_menu` (list): label, url, parent_id, display_order, opens_new_tab — header menu
- `footer_links` (list): label, url, column_group (Explore / Reach Us / Legal), display_order
- `footer_about_text` → already in site_settings (add column)

### 1.6 Memberships → migrate from Supabase to VPS
- New `memberships` table on VPS (name, logo_url, link_url, display_order, is_published)
- Migrate `/admin/memberships` page to call VPS API
- Footer reads from API (no more hardcoded logo imports)

### 1.7 Partners → migrate from Supabase to VPS
- New `partners` table on VPS (name, kind, country, cc, display_order, is_published)
- Migrate `/admin/partners` to VPS API

### 1.8 Visa Services → migrate from Supabase to VPS
- New `visa_services` table on VPS with all JSONB fields (highlights, process, who_is_it_for, faqs)
- Migrate `/admin/visa-services` + editor to VPS API
- Public `/visa/services` and `/visa/services/:slug` read from VPS

### 1.9 WhatsApp settings → migrate from Supabase to VPS
- Add `whatsapp_number`, `whatsapp_message` columns to existing `site_settings` (or new `app_settings` table)
- Migrate `/admin/whatsapp` to VPS API

### 1.10 Admin Authentication → migrate from Supabase Auth to VPS
- Already have `admin_users` table + bcrypt + JWT cookie in `server/src/routes/auth.ts`
- Rewrite `src/lib/use-admin-auth.ts` to call `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- Rewrite `AdminLogin`, `AdminSignup`, `ForgotPassword`, `ResetPassword` to use VPS endpoints
- Add `/api/auth/forgot` + `/api/auth/reset` endpoints (email link with token in `admin_password_resets` table)

---

## Phase 2 — Rewire frontend to load from CMS

For each public page, replace hardcoded arrays with API calls:
- `Home.tsx` → fetch hero/stats/services/destinations/testimonials/why-choose-us
- `About.tsx` → fetch about_page + pillars + team
- `Services.tsx` → fetch services_items
- `Faq.tsx` → fetch faqs
- `Footer.tsx` → fetch memberships + footer_links from API (remove hardcoded imports)
- `Header.tsx` → fetch nav_menu from API

Add a small in-memory cache + `staleTime` so pages stay fast.

---

## Phase 3 — Remove Supabase entirely

- Delete `src/integrations/supabase/*`
- Delete `src/lib/memberships-db.ts`, `partners-db.ts`, `visa-services-db.ts`, `whatsapp-settings.ts` (Supabase versions)
- Remove `@supabase/supabase-js` from `package.json`
- Remove `VITE_SUPABASE_*` from `.env`
- Cloud connection stays disabled — site is 100% VPS

---

## Phase 4 — Migration & seeding

- Write SQL migrations under `server/migrations/004_*.sql` … `010_*.sql` for all new tables
- Write a one-time seed script that copies existing Supabase data (memberships, partners, visa_services) into VPS Postgres so nothing is lost
- Seed default values for new tables (current hardcoded SERVICES/FAQS/PILLARS arrays become initial DB rows so the site looks identical on day 1)

---

## Technical Section

**Stack stays the same**: Express + Postgres on VPS, JWT cookie auth, React frontend reads from `/api/*`.

**File structure additions:**
```text
server/
  migrations/
    004_home_cms.sql
    005_about_cms.sql
    006_services_faqs.sql
    007_navigation_footer.sql
    008_memberships_vps.sql
    009_partners_vps.sql
    010_visa_services_vps.sql
    011_admin_password_resets.sql
  src/routes/
    home-content.ts
    about-content.ts
    services-content.ts
    faqs.ts
    navigation.ts
    memberships.ts
    partners.ts
    visa-services.ts
    auth.ts            (extend with forgot/reset)

src/
  lib/
    cms-api.ts         (typed fetchers for all new endpoints)
  pages/admin/
    AdminHome.tsx
    AdminAbout.tsx
    AdminServicesPage.tsx
    AdminFaqs.tsx
    AdminNavigation.tsx
    AdminFooter.tsx
```

**Auth model**: JWT in httpOnly cookie (already implemented). Admin signup will be locked behind a server-side `ADMIN_SIGNUP_TOKEN` env var so randoms can't create admins.

**Image uploads**: keep using existing `/api/uploads` → `uploads.worldjumperbd.com/...`. Every image field in every admin form gets the same upload widget you already have.

**No downtime migration**: Phase 1 keeps Supabase live. We only delete Supabase code in Phase 3 after Phase 2 is verified working on the VPS.

---

## Order of work (what I'll ship per turn)

1. **Migrations + seed** for all new tables (one approval)
2. **Express routes** for all new endpoints
3. **Admin pages** — Home, About, Services, FAQs, Navigation, Footer (one big batch)
4. **Migrate admin auth** to VPS (login/signup/forgot/reset)
5. **Migrate Memberships + Partners + Visa Services + WhatsApp** admin pages to VPS
6. **Rewire public pages** to read from API
7. **Delete Supabase code** + give you the final VPS deploy commands

---

## What you'll need to do on the VPS

After each phase I'll give you exact bash commands:
- `cd /var/www/worldjumper && git pull && npm ci && npm run build`
- `cd /var/www/worldjumper/server && npm ci && npm run migrate && pm2 restart worldjumper-api`
- `systemctl reload nginx`

Approve this plan and I'll start with **Phase 1 step 1: the SQL migrations**.
