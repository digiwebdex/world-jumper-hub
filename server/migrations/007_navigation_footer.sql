-- ============================================================
-- Header navigation + Footer links
-- ============================================================

-- 1. nav_menu (header navigation)
CREATE TABLE IF NOT EXISTS nav_menu (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label          text NOT NULL,
  url            text NOT NULL,
  parent_id      uuid REFERENCES nav_menu(id) ON DELETE CASCADE,
  opens_new_tab  boolean NOT NULL DEFAULT false,
  display_order  integer NOT NULL DEFAULT 0,
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_nav_menu_parent ON nav_menu(parent_id);

INSERT INTO nav_menu (label, url, display_order) VALUES
  ('Home',            '/',                1),
  ('Visa',            '/visa',            2),
  ('Visa Services',   '/visa/services',   3),
  ('Tours',           '/tours',           4),
  ('Umrah',           '/umrah',           5),
  ('Medical',         '/medical-tourism', 6),
  ('Air Ticketing',   '/air-ticketing',   7),
  ('About',           '/about',           8),
  ('FAQ',             '/faq',             9),
  ('Contact',         '/contact',         10)
ON CONFLICT DO NOTHING;

-- 2. footer_links
CREATE TABLE IF NOT EXISTS footer_links (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label         text NOT NULL,
  url           text NOT NULL,
  column_group  text NOT NULL DEFAULT 'Explore',
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO footer_links (label, url, column_group, display_order) VALUES
  ('Visa Services',     '/visa',            'Explore', 1),
  ('Tour Packages',     '/tours',           'Explore', 2),
  ('Umrah Programs',    '/umrah',           'Explore', 3),
  ('Medical Tourism',   '/medical-tourism', 'Explore', 4),
  ('Air Ticketing',     '/air-ticketing',   'Explore', 5),
  ('About Us',          '/about',           'Company', 1),
  ('FAQ',               '/faq',             'Company', 2),
  ('Contact',           '/contact',         'Company', 3)
ON CONFLICT DO NOTHING;

-- 3. add footer_about_text to site_settings (if not present)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_about_text text
  DEFAULT 'Govt. approved travel & tourism agency in Bangladesh. Visa, tours, air tickets, Umrah and medical journeys — one consultant, one trusted house.';
