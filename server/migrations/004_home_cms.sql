-- ============================================================
-- Home page CMS tables
-- ============================================================

-- 1. home_hero (singleton, id = 1)
CREATE TABLE IF NOT EXISTS home_hero (
  id                     integer PRIMARY KEY,
  kicker                 text,
  headline               text,
  highlight_word         text,
  subheadline            text,
  background_image_url   text,
  primary_cta_label      text,
  primary_cta_link       text,
  secondary_cta_label    text,
  secondary_cta_link     text,
  updated_at             timestamptz NOT NULL DEFAULT now()
);

INSERT INTO home_hero (id, kicker, headline, highlight_word, subheadline, primary_cta_label, primary_cta_link, secondary_cta_label, secondary_cta_link)
VALUES (
  1,
  'Govt. Approved · License 0013423',
  'Jump into the world.',
  'world',
  'Visa, tours, air tickets, Umrah & medical journeys — one consultant, one trusted Dhaka travel house.',
  'Start a Visa',
  '/visa',
  'Talk to us',
  '/contact'
) ON CONFLICT (id) DO NOTHING;

-- 2. home_stats
CREATE TABLE IF NOT EXISTS home_stats (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label         text NOT NULL,
  value         text NOT NULL,
  suffix        text DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO home_stats (label, value, suffix, display_order) VALUES
  ('Travelers',        '10000', '+',   1),
  ('Countries',        '30',    '+',   2),
  ('Airline Partners', '50',    '+',   3),
  ('In Practice',      '12',    ' yrs',4)
ON CONFLICT DO NOTHING;

-- 3. home_services
CREATE TABLE IF NOT EXISTS home_services (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text NOT NULL,
  icon          text NOT NULL DEFAULT 'Stamp',
  link          text NOT NULL DEFAULT '/',
  accent        text NOT NULL DEFAULT 'orange',
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO home_services (title, description, icon, link, accent, display_order) VALUES
  ('Visa Services',       'Tourist, business, medical & student visas processed for 30+ countries with full documentation support.', 'Stamp',       '/visa',            'orange', 1),
  ('Tour Packages',       'Hand-curated international holidays across Asia, Europe, Middle East and beyond.',                       'MapPin',      '/tours',           'blue',   2),
  ('Air Ticketing',       'IATA-approved fares from 50+ airlines — competitive prices, instant confirmation.',                     'Plane',       '/air-ticketing',   'deep',   3),
  ('Medical Tourism',     'Trusted hospital partnerships in India, Thailand, Singapore and Malaysia.',                              'Stethoscope', '/medical-tourism', 'sand',   4),
  ('Umrah Programs',      'Comfortable Umrah packages all year round with hand-picked hotels in Makkah & Madinah.',                 'Moon',        '/umrah',           'orange', 5),
  ('Bespoke Itineraries', 'Custom-designed journeys tailored entirely around your timeline and taste.',                             'Ticket',      '/contact',         'blue',   6)
ON CONFLICT DO NOTHING;

-- 4. home_destinations
CREATE TABLE IF NOT EXISTS home_destinations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  tag           text DEFAULT '',
  image_url     text NOT NULL,
  link          text DEFAULT '/visa',
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO home_destinations (name, tag, image_url, display_order) VALUES
  ('Maldives',    'Island Escape',  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2400&q=70', 1),
  ('Dubai',       'City of Gold',   'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=70', 2),
  ('Makkah',      'Umrah & Hajj',   'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=2400&q=70', 3),
  ('Bangkok',     'Medical & Tour', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=2400&q=70', 4),
  ('Switzerland', 'Alps & Lakes',   'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2400&q=70', 5)
ON CONFLICT DO NOTHING;

-- 5. home_testimonials
CREATE TABLE IF NOT EXISTS home_testimonials (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  trip          text DEFAULT '',
  quote         text NOT NULL,
  photo_url     text,
  rating        integer NOT NULL DEFAULT 5,
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO home_testimonials (name, trip, quote, display_order) VALUES
  ('Rashed Hossain', 'Dubai · Family Holiday', 'From visa to hotel — every detail was effortless. We just packed and flew.', 1),
  ('Nusrat Jahan',   'Umrah · 2024',           'The team treated my parents like their own. The hotel near Haram was perfect.', 2),
  ('Tanvir Ahmed',   'Bangkok · Medical',      'World Jumper coordinated the hospital, hotel and translator. Truly stress-free.', 3)
ON CONFLICT DO NOTHING;

-- 6. home_why_choose_us
CREATE TABLE IF NOT EXISTS home_why_choose_us (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text NOT NULL,
  icon          text NOT NULL DEFAULT 'ShieldCheck',
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO home_why_choose_us (title, description, icon, display_order) VALUES
  ('Govt. Approved',     'Licensed travel agency #0013423 — audited, documented and accountable.',                                        'ShieldCheck',    1),
  ('Named Consultant',   'A real person handles your file from the first call to the airport drop-off.',                                  'HeartHandshake', 2),
  ('Quietly Global',     'Memberships across IATA, ATAB, TOAB and more — global reach with a Dhaka heart.',                               'Globe2',         3),
  ('On-time Always',     'Visa timelines, ticket issuance and pickups — we tell you when, and we mean it.',                               'Clock',          4)
ON CONFLICT DO NOTHING;

-- 7. home_quick_tabs (search tabs on hero)
CREATE TABLE IF NOT EXISTS home_quick_tabs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tab_key       text NOT NULL UNIQUE,
  label         text NOT NULL,
  icon          text NOT NULL,
  link          text NOT NULL,
  placeholder   text DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true
);

INSERT INTO home_quick_tabs (tab_key, label, icon, link, placeholder, display_order) VALUES
  ('visa',    'Visa',    'Stamp',       '/visa',            'Search country (e.g. Schengen)', 1),
  ('tour',    'Tours',   'MapPin',      '/tours',           'Search destination (e.g. Bali)', 2),
  ('air',     'Air',     'Plane',       '/air-ticketing',   'From DAC to ...',                3),
  ('umrah',   'Umrah',   'Moon',        '/umrah',           'Choose Umrah package',           4),
  ('medical', 'Medical', 'Stethoscope', '/medical-tourism', 'Hospital or city',               5)
ON CONFLICT (tab_key) DO NOTHING;
