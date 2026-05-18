-- ============================================================
-- Memberships + Partners on VPS (migrated from Supabase)
-- ============================================================

-- 1. memberships
CREATE TABLE IF NOT EXISTS memberships (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  logo_url      text,
  link_url      text,
  display_order integer NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO memberships (name, logo_url, display_order) VALUES
  ('CAAB',                 'https://uploads.worldjumperbd.com/memberships/caab.png',   1),
  ('IATA',                 'https://uploads.worldjumperbd.com/memberships/iata.png',   2),
  ('ATAB',                 'https://uploads.worldjumperbd.com/memberships/atab.png',   3),
  ('TOAB',                 'https://uploads.worldjumperbd.com/memberships/toab.png',   4),
  ('BOTOF',                'https://uploads.worldjumperbd.com/memberships/botof.jpg',  5),
  ('ETAB',                 'https://uploads.worldjumperbd.com/memberships/etab.png',   6),
  ('e-CAB',                'https://uploads.worldjumperbd.com/memberships/ecab.png',   7),
  ('Lions International',  'https://uploads.worldjumperbd.com/memberships/lions.png',  8)
ON CONFLICT DO NOTHING;

-- 2. partners
CREATE TABLE IF NOT EXISTS partners (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  kind          text NOT NULL DEFAULT 'Airline',
  country       text DEFAULT '',
  cc            text DEFAULT 'UN',
  logo_url      text,
  link_url      text,
  display_order integer NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_partners_kind ON partners(kind);
