-- Seed initial visa countries
-- Idempotent: ON CONFLICT (slug) DO NOTHING — re-running will not duplicate or overwrite admin edits.

INSERT INTO visa_countries (country_name, slug, flag_url, short_description, is_featured, is_active) VALUES
  ('India',        'india',        'https://flagcdn.com/w160/in.png', 'Tourist, medical and business visas to India with quick processing.',          true,  true),
  ('Thailand',     'thailand',     'https://flagcdn.com/w160/th.png', 'Tourist visa to Thailand — beaches, temples and vibrant cities.',              true,  true),
  ('Malaysia',     'malaysia',     'https://flagcdn.com/w160/my.png', 'Tourist and business visas to Malaysia with end-to-end document support.',     true,  true),
  ('Singapore',    'singapore',    'https://flagcdn.com/w160/sg.png', 'Tourist and business visas to Singapore with high approval rates.',            true,  true),
  ('Japan',        'japan',        'https://flagcdn.com/w160/jp.png', 'Tourist and business visas to Japan with full guidance.',                      false, true),
  ('South Korea',  'south-korea',  'https://flagcdn.com/w160/kr.png', 'Tourist and short-stay visas to the Republic of Korea.',                       false, true),
  ('United Kingdom','united-kingdom','https://flagcdn.com/w160/gb.png','UK visitor, student and business visas with experienced consultants.',        true,  true),
  ('Canada',       'canada',       'https://flagcdn.com/w160/ca.png', 'Canada visitor, study and work visa support from Bangladesh.',                 true,  true),
  ('Australia',    'australia',    'https://flagcdn.com/w160/au.png', 'Australia tourist, student and skilled migration visa guidance.',              true,  true),
  ('Egypt',        'egypt',        'https://flagcdn.com/w160/eg.png', 'Tourist visa to Egypt — pyramids, Nile and historic wonders.',                 false, true),
  ('France',       'france',       'https://flagcdn.com/w160/fr.png', 'Schengen tourist and business visa for France with appointment support.',      true,  true)
ON CONFLICT (slug) DO NOTHING;
