-- ============================================================
-- Services page items + FAQ
-- ============================================================

-- 1. services_items (Services page list)
CREATE TABLE IF NOT EXISTS services_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text NOT NULL,
  icon          text NOT NULL DEFAULT 'Stamp',
  link          text NOT NULL DEFAULT '/',
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO services_items (title, description, icon, link, display_order) VALUES
  ('Visa Services',   'Tourist, business, medical, student & work visa across 30+ countries.', 'Stamp',       '/visa',            1),
  ('Tour Packages',   'Curated holidays — Asia, Europe, Middle East, Maldives & beyond.',     'MapPin',      '/tours',           2),
  ('Air Ticketing',   'IATA-approved fares from 50+ international airlines.',                  'Plane',       '/air-ticketing',   3),
  ('Medical Tourism', 'Hospital partners across India, Thailand, Singapore & Malaysia.',       'Stethoscope', '/medical-tourism', 4),
  ('Umrah Programs',  'Comfortable Umrah packages all year, hand-picked hotels.',              'Moon',        '/umrah',           5),
  ('Bespoke Travel',  'Custom-designed journeys around your timeline and taste.',              'Ticket',      '/contact',         6)
ON CONFLICT DO NOTHING;

-- 2. faqs
CREATE TABLE IF NOT EXISTS faqs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question      text NOT NULL,
  answer        text NOT NULL,
  category      text DEFAULT 'General',
  display_order integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO faqs (question, answer, category, display_order) VALUES
  ('How long does visa processing take?',  'It depends on the country — typically 7 to 21 working days after the embassy receives all documents. We share the exact timeline before any payment.', 'Visa',    1),
  ('Do you provide air tickets only?',     'Yes — we are an IATA-approved agent and issue tickets for 50+ international airlines, with or without a tour package.',                                'Tickets', 2),
  ('Can I customize a tour package?',      'Absolutely. Share your dates, destination and budget and a consultant will design a tailored plan within 24 hours.',                                   'Tours',   3),
  ('Do you arrange Umrah year-round?',     'Yes, we operate Umrah programs every month with multiple hotel categories near Haram in both Makkah and Madinah.',                                     'Umrah',   4),
  ('How do I pay?',                        'We accept bKash, bank transfer, card payment, and cash at our office. Payment plans are available for major bookings.',                                'Payment', 5),
  ('Is World Jumper licensed?',            'Yes — we are a Government-approved travel & tourism agency (License No. 0013423) with memberships in IATA, ATAB, TOAB, ETAB and more.',                'About',   6)
ON CONFLICT DO NOTHING;
