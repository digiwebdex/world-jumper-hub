INSERT INTO site_settings (
  id, company_name, brand_name, license_no, primary_phone, secondary_phone,
  other_phones, whatsapp_number, email, address, memberships, logo_url, banner_url
) VALUES (
  1,
  'World Jumper',
  'World Jumper Tours & Travels',
  '0013423',
  '01687072001',
  '01757622143',
  '01337120743, 01337120744, 01337120745',
  '01687072001',
  'info@worldjumperbd.com',
  'Dhaka, Bangladesh',
  'CAAB, IATA, ATAB, TOB, BOTOF, ETAB, e-Cab, Lions International',
  'https://worldjumperbd.com/uploads/logo/world-jumper-logo.jpeg',
  'https://worldjumperbd.com/uploads/banners/home-banner.jpg'
) ON CONFLICT (id) DO NOTHING;
