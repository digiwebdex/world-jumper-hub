-- ============================================================
-- Visa Services on VPS (migrated from Supabase)
-- ============================================================

CREATE TABLE IF NOT EXISTS visa_services (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  number        text NOT NULL DEFAULT '',
  title         text NOT NULL,
  short_title   text NOT NULL DEFAULT '',
  tagline       text NOT NULL DEFAULT '',
  summary       text NOT NULL DEFAULT '',
  icon          text NOT NULL DEFAULT 'Globe2',
  intro         text NOT NULL DEFAULT '',
  highlights    jsonb NOT NULL DEFAULT '[]'::jsonb,
  process       jsonb NOT NULL DEFAULT '[]'::jsonb,
  who_is_it_for jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs          jsonb NOT NULL DEFAULT '[]'::jsonb,
  display_order integer NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_visa_services_slug ON visa_services(slug);
CREATE INDEX IF NOT EXISTS idx_visa_services_published ON visa_services(is_published);
