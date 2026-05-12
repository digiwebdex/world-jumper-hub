-- World Jumper schema (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 1. admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         citext UNIQUE NOT NULL,
  password_hash text   NOT NULL,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 2. site_settings (singleton, id = 1)
CREATE TABLE IF NOT EXISTS site_settings (
  id              integer PRIMARY KEY,
  company_name    text,
  brand_name      text,
  license_no      text,
  primary_phone   text,
  secondary_phone text,
  other_phones    text,
  whatsapp_number text,
  email           text,
  address         text,
  memberships     text,
  logo_url        text,
  banner_url      text,
  facebook_url    text,
  instagram_url   text,
  linkedin_url    text,
  youtube_url     text,
  website_url     text,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- 3. visa_countries
CREATE TABLE IF NOT EXISTS visa_countries (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_name       text NOT NULL,
  slug               text UNIQUE NOT NULL,
  flag_url           text,
  short_description  text,
  is_featured        boolean NOT NULL DEFAULT false,
  is_active          boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_visa_countries_active ON visa_countries(is_active);
CREATE INDEX IF NOT EXISTS idx_visa_countries_featured ON visa_countries(is_featured);

-- 4. visa_requirements
CREATE TABLE IF NOT EXISTS visa_requirements (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id               uuid NOT NULL REFERENCES visa_countries(id) ON DELETE CASCADE,
  visa_type                text NOT NULL,
  required_documents       text,
  passport_requirement     text,
  photo_requirement        text,
  nid_or_birth_certificate text,
  bank_statement           text,
  bank_solvency            text,
  job_certificate          text,
  trade_license            text,
  student_id               text,
  invitation_letter        text,
  medical_documents        text,
  hotel_booking            text,
  air_ticket_booking       text,
  travel_itinerary         text,
  processing_time          text,
  embassy_fee              text,
  service_charge           text,
  important_notes          text,
  eligibility_notes        text,
  is_active                boolean NOT NULL DEFAULT true,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_visa_req_country ON visa_requirements(country_id);
CREATE INDEX IF NOT EXISTS idx_visa_req_active  ON visa_requirements(is_active);

-- 5. packages
DO $$ BEGIN
  CREATE TYPE package_type AS ENUM ('Tour', 'Umrah', 'Medical Tourism', 'Air Ticket Offer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS packages (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title              text NOT NULL,
  slug               text UNIQUE NOT NULL,
  package_type       package_type NOT NULL,
  destination        text,
  duration           text,
  price              text,
  short_description  text,
  full_description   text,
  included_services  text,
  excluded_services  text,
  image_url          text,
  gallery_urls       text,
  brochure_url       text,
  is_featured        boolean NOT NULL DEFAULT false,
  is_active          boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_packages_active   ON packages(is_active);
CREATE INDEX IF NOT EXISTS idx_packages_featured ON packages(is_featured);
CREATE INDEX IF NOT EXISTS idx_packages_type     ON packages(package_type);

-- 6. inquiries
DO $$ BEGIN
  CREATE TYPE inquiry_status AS ENUM ('New', 'Contacted', 'Processing', 'Completed', 'Cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS inquiries (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name           text NOT NULL,
  mobile_number       text NOT NULL,
  email               text,
  service_type        text,
  destination_country text,
  journey_from        text,
  journey_to          text,
  departure_date      text,
  return_date         text,
  travel_date         text,
  passengers          text,
  message             text,
  source_page         text,
  status              inquiry_status NOT NULL DEFAULT 'New',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inquiries_status   ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created  ON inquiries(created_at DESC);

-- 7. uploaded_files
CREATE TABLE IF NOT EXISTS uploaded_files (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_name text NOT NULL,
  stored_path   text NOT NULL,
  public_url    text NOT NULL,
  mime_type     text,
  size_bytes    bigint,
  uploaded_by   uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);
