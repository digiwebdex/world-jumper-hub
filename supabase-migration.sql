-- =====================================================================
-- World Jumper Tours & Travels — Phase 1 Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE where possible.
-- =====================================================================

-- ---------- updated_at trigger -----------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- ---------- admin_profiles ---------------------------------------------
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text default 'admin',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists trg_admin_profiles_updated on public.admin_profiles;
create trigger trg_admin_profiles_updated before update on public.admin_profiles
for each row execute function public.set_updated_at();

-- ---------- is_admin() helper (SECURITY DEFINER, no recursion) ---------
create or replace function public.is_admin()
returns boolean language sql stable security definer
set search_path = public as $$
  select exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and is_active = true
  );
$$;

-- ---------- visa_countries ---------------------------------------------
create table if not exists public.visa_countries (
  id uuid primary key default gen_random_uuid(),
  country_name text not null,
  slug text unique not null,
  flag_url text,
  short_description text,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists trg_visa_countries_updated on public.visa_countries;
create trigger trg_visa_countries_updated before update on public.visa_countries
for each row execute function public.set_updated_at();

-- ---------- visa_requirements ------------------------------------------
create table if not exists public.visa_requirements (
  id uuid primary key default gen_random_uuid(),
  country_id uuid references public.visa_countries(id) on delete cascade,
  visa_type text not null,
  required_documents text,
  passport_requirement text,
  photo_requirement text,
  nid_or_birth_certificate text,
  bank_statement text,
  bank_solvency text,
  job_certificate text,
  trade_license text,
  student_id text,
  invitation_letter text,
  medical_documents text,
  hotel_booking text,
  air_ticket_booking text,
  travel_itinerary text,
  processing_time text,
  embassy_fee text,
  service_charge text,
  important_notes text,
  eligibility_notes text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists trg_visa_req_updated on public.visa_requirements;
create trigger trg_visa_req_updated before update on public.visa_requirements
for each row execute function public.set_updated_at();

-- ---------- packages ---------------------------------------------------
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  package_type text not null,
  destination text,
  duration text,
  price text,
  short_description text,
  full_description text,
  included_services text,
  excluded_services text,
  image_url text,
  gallery_urls text,
  brochure_url text,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists trg_packages_updated on public.packages;
create trigger trg_packages_updated before update on public.packages
for each row execute function public.set_updated_at();

-- ---------- inquiries --------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  mobile_number text not null,
  email text,
  service_type text,
  destination_country text,
  journey_from text,
  journey_to text,
  departure_date date,
  return_date date,
  travel_date date,
  passengers text,
  message text,
  source_page text,
  status text default 'New',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
drop trigger if exists trg_inquiries_updated on public.inquiries;
create trigger trg_inquiries_updated before update on public.inquiries
for each row execute function public.set_updated_at();

-- ---------- site_settings ----------------------------------------------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  company_name text,
  brand_name text,
  license_no text,
  primary_phone text,
  secondary_phone text,
  other_phones text,
  whatsapp_number text,
  email text,
  address text,
  memberships text,
  logo_url text,
  banner_url text,
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  youtube_url text,
  website_url text,
  updated_at timestamptz default now()
);
drop trigger if exists trg_site_settings_updated on public.site_settings;
create trigger trg_site_settings_updated before update on public.site_settings
for each row execute function public.set_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.admin_profiles    enable row level security;
alter table public.visa_countries    enable row level security;
alter table public.visa_requirements enable row level security;
alter table public.packages          enable row level security;
alter table public.inquiries         enable row level security;
alter table public.site_settings     enable row level security;

-- admin_profiles: only the admin themselves can read; admins manage all
drop policy if exists ap_self_read on public.admin_profiles;
create policy ap_self_read on public.admin_profiles for select
  using (auth.uid() = id or public.is_admin());
drop policy if exists ap_admin_all on public.admin_profiles;
create policy ap_admin_all on public.admin_profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- visa_countries: public reads active rows; admins write
drop policy if exists vc_public_read on public.visa_countries;
create policy vc_public_read on public.visa_countries for select
  using (is_active = true or public.is_admin());
drop policy if exists vc_admin_all on public.visa_countries;
create policy vc_admin_all on public.visa_countries for all
  using (public.is_admin()) with check (public.is_admin());

-- visa_requirements: public reads active rows; admins write
drop policy if exists vr_public_read on public.visa_requirements;
create policy vr_public_read on public.visa_requirements for select
  using (is_active = true or public.is_admin());
drop policy if exists vr_admin_all on public.visa_requirements;
create policy vr_admin_all on public.visa_requirements for all
  using (public.is_admin()) with check (public.is_admin());

-- packages: public reads active; admins write
drop policy if exists pk_public_read on public.packages;
create policy pk_public_read on public.packages for select
  using (is_active = true or public.is_admin());
drop policy if exists pk_admin_all on public.packages;
create policy pk_admin_all on public.packages for all
  using (public.is_admin()) with check (public.is_admin());

-- inquiries: anyone may insert; only admins may read/update/delete
drop policy if exists iq_public_insert on public.inquiries;
create policy iq_public_insert on public.inquiries for insert
  with check (true);
drop policy if exists iq_admin_read on public.inquiries;
create policy iq_admin_read on public.inquiries for select
  using (public.is_admin());
drop policy if exists iq_admin_update on public.inquiries;
create policy iq_admin_update on public.inquiries for update
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists iq_admin_delete on public.inquiries;
create policy iq_admin_delete on public.inquiries for delete
  using (public.is_admin());

-- site_settings: public reads; admins write
drop policy if exists ss_public_read on public.site_settings;
create policy ss_public_read on public.site_settings for select using (true);
drop policy if exists ss_admin_all on public.site_settings;
create policy ss_admin_all on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Sample data (safe to re-run thanks to ON CONFLICT)
-- =====================================================================
insert into public.site_settings (company_name, brand_name, license_no, primary_phone,
  secondary_phone, other_phones, whatsapp_number, email, address, memberships,
  logo_url, banner_url, website_url)
values ('World Jumper', 'World Jumper Tours & Travels', '0013423', '01687072001',
  '01757622143', '01337120743, 01337120744, 01337120745', '01687072001',
  'info@worldjumperbd.com', 'Dhaka, Bangladesh',
  'CAAB, IATA, ATAB, TOB, BOTOF, ETAB, e-Cab, Lions International',
  'https://uploads.worldjumperbd.com/logo/world-jumper-logo.jpeg',
  'https://uploads.worldjumperbd.com/banners/home-banner.jpg',
  'https://worldjumperbd.com')
on conflict do nothing;

insert into public.visa_countries (country_name, slug, flag_url, short_description, is_featured) values
  ('India',     'india',     'https://uploads.worldjumperbd.com/visa-countries/india.jpg',     'Tourist, Medical & Business visa support for India.', true),
  ('Thailand',  'thailand',  'https://uploads.worldjumperbd.com/visa-countries/thailand.jpg',  'Tourist visa for Thailand with full document guidance.', true),
  ('Malaysia',  'malaysia',  'https://uploads.worldjumperbd.com/visa-countries/malaysia.jpg',  'eVisa & sticker visa support for Malaysia.', true),
  ('Singapore', 'singapore', 'https://uploads.worldjumperbd.com/visa-countries/singapore.jpg', 'Tourist & business visa for Singapore.', true),
  ('Dubai / UAE','dubai-uae','https://uploads.worldjumperbd.com/visa-countries/uae.jpg',       '14/30/90 day UAE tourist visa processing.', true),
  ('Saudi Arabia','saudi-arabia','https://uploads.worldjumperbd.com/visa-countries/saudi.jpg', 'Umrah, business & visit visa for KSA.', true),
  ('Turkey',    'turkey',    'https://uploads.worldjumperbd.com/visa-countries/turkey.jpg',    'eVisa and sticker visa for Turkey.', false),
  ('UK',        'uk',        'https://uploads.worldjumperbd.com/visa-countries/uk.jpg',        'UK Standard Visitor Visa support.', false),
  ('USA',       'usa',       'https://uploads.worldjumperbd.com/visa-countries/usa.jpg',       'B1/B2 visa documentation guidance.', false),
  ('Canada',    'canada',    'https://uploads.worldjumperbd.com/visa-countries/canada.jpg',    'Canada visitor visa support.', false),
  ('Australia', 'australia', 'https://uploads.worldjumperbd.com/visa-countries/australia.jpg', 'Australia tourist & business visa.', false),
  ('Schengen',  'schengen',  'https://uploads.worldjumperbd.com/visa-countries/schengen.jpg',  'Schengen short-stay visa for 27 countries.', true)
on conflict (slug) do nothing;

-- A couple of sample requirements
insert into public.visa_requirements (country_id, visa_type, required_documents,
  passport_requirement, photo_requirement, bank_statement, processing_time, important_notes)
select id, 'Tourist',
  'Passport, Photo, NID, Bank Statement, Visiting Card, Hotel Booking, Air Ticket',
  'Original passport with min 6 months validity & 2 blank pages',
  '2 copies, 35x45mm, white background, matte finish',
  'Last 6 months, minimum BDT 60,000 closing balance recommended',
  '5 - 10 working days',
  'All documents must be original. Embassy may request additional papers.'
from public.visa_countries where slug = 'india'
on conflict do nothing;

insert into public.visa_requirements (country_id, visa_type, required_documents,
  passport_requirement, photo_requirement, bank_statement, processing_time, important_notes)
select id, 'Tourist',
  'Passport, Photo, NID, Bank Statement, Hotel Booking, Air Ticket Booking',
  'Original passport with min 6 months validity',
  '2 copies, 35x45mm, white background',
  'Last 6 months, minimum BDT 80,000 recommended',
  '7 - 12 working days',
  'Single entry tourist visa, valid 60 days from issue.'
from public.visa_countries where slug = 'thailand'
on conflict do nothing;

-- Sample packages
insert into public.packages (title, slug, package_type, destination, duration, price,
  short_description, included_services, image_url, is_featured) values
  ('Bangkok – Pattaya 5 Days', 'bangkok-pattaya-5d', 'Tour', 'Thailand', '5 Days / 4 Nights',
   'Starting from BDT 38,500',
   'Discover Bangkok temples & Pattaya beaches in a curated 5-day itinerary.',
   'Air ticket, Hotel, Breakfast, Tours, Airport transfer',
   'https://uploads.worldjumperbd.com/packages/bangkok-pattaya.jpg', true),
  ('Kuala Lumpur – Genting 4 Days', 'kl-genting-4d', 'Tour', 'Malaysia', '4 Days / 3 Nights',
   'Starting from BDT 32,000',
   'Twin Towers, Batu Caves & Genting highlands.',
   'Air ticket, Hotel, Breakfast, City tour',
   'https://uploads.worldjumperbd.com/packages/kl-genting.jpg', true),
  ('Economy Umrah Package – 14 Days', 'umrah-economy-14d', 'Umrah', 'Saudi Arabia', '14 Days',
   'Starting from BDT 1,75,000',
   'Affordable Umrah package with 4-star hotel & guided ziyarah.',
   'Visa, Air ticket, Hotel (Makkah & Madinah), Transport, Ziyarah, Guide',
   'https://uploads.worldjumperbd.com/umrah/economy-umrah.jpg', true),
  ('India Medical Tourism – Apollo', 'india-medical-apollo', 'Medical Tourism', 'India', 'As required',
   'Quote on request',
   'End-to-end coordination with Apollo Hospitals, Chennai.',
   'Medical visa support, Appointment, Hotel, Local transport, Translator',
   'https://uploads.worldjumperbd.com/medical-tourism/apollo-india.jpg', true),
  ('Dubai – Special Air Ticket Offer', 'dubai-air-offer', 'Air Ticket Offer', 'Dubai / UAE', 'One-way / Return',
   'From BDT 28,500',
   'Special fare on selected airlines to Dubai.',
   'Air ticket only', 'https://uploads.worldjumperbd.com/packages/dubai-offer.jpg', false)
on conflict (slug) do nothing;
