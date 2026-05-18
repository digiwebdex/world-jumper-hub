-- ============================================================
-- About page CMS tables
-- ============================================================

-- 1. about_page (singleton)
CREATE TABLE IF NOT EXISTS about_page (
  id              integer PRIMARY KEY,
  hero_kicker     text,
  hero_eyebrow    text,
  hero_title      text,
  hero_subtitle   text,
  hero_image_url  text,
  founding_label  text,
  founding_title  text,
  story_paragraph_1 text,
  story_paragraph_2 text,
  quote_text      text,
  quote_image_url text,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

INSERT INTO about_page (
  id, hero_kicker, hero_eyebrow, hero_title, hero_subtitle, hero_image_url,
  founding_label, founding_title, story_paragraph_1, story_paragraph_2,
  quote_text, quote_image_url
) VALUES (
  1,
  'Our Story',
  'About',
  'A travel house, Dhaka-born.',
  'Govt. Approved Travel & Tourism Company — License No. 0013423.',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=2400&q=70',
  'Founding note',
  'We believe travel should feel like a gift, not a transaction.',
  'World Jumper began with a simple frustration: too many trips were sold like commodities, too few were treated as memories in the making. Today our consultants design visa files, holidays, Umrah programs and medical journeys for thousands of travelers across Bangladesh.',
  'We are licensed, audited, IATA-approved and proudly accredited by every major travel body in the country — but our quiet pride is the consultant who answers your call by name.',
  'Not all those who wander are lost — some are simply in good hands.',
  'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=2400&q=70'
) ON CONFLICT (id) DO NOTHING;

-- 2. about_pillars
CREATE TABLE IF NOT EXISTS about_pillars (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  body          text NOT NULL,
  image_url     text,
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO about_pillars (title, body, image_url, display_order) VALUES
  ('Govt. approved & licensed',     'Operating under official Bangladesh travel agency license #0013423 — your trips are documented, audited and protected.', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=70', 1),
  ('A consultant per traveler',     'Every booking is paired with a named consultant who knows your file from the first call to the airport drop-off.',     'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=70', 2),
  ('Quietly global, deeply local',  'Memberships across IATA, ATAB, TOAB and more — but the warmth of a Dhaka travel house that remembers your name.',     'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=70', 3)
ON CONFLICT DO NOTHING;

-- 3. about_team
CREATE TABLE IF NOT EXISTS about_team (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  role          text NOT NULL,
  bio           text,
  photo_url     text,
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 4. about_stats
CREATE TABLE IF NOT EXISTS about_stats (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label         text NOT NULL,
  value         text NOT NULL,
  suffix        text DEFAULT '',
  display_order integer NOT NULL DEFAULT 0
);

INSERT INTO about_stats (label, value, suffix, display_order) VALUES
  ('Travelers',        '10000', '+',    1),
  ('Countries',        '30',    '+',    2),
  ('Airline Partners', '50',    '+',    3),
  ('In Practice',      '12',    ' yrs', 4)
ON CONFLICT DO NOTHING;
