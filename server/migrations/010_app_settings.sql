-- ============================================================
-- App-level settings (WhatsApp etc.) migrated from Supabase
-- ============================================================

-- Add WhatsApp message to site_settings (number already exists)
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS whatsapp_message text
    DEFAULT 'Hello World Jumper, I want to know about visa/tour/air ticket service.';

-- Backfill default for existing row
UPDATE site_settings
   SET whatsapp_message = COALESCE(whatsapp_message,
       'Hello World Jumper, I want to know about visa/tour/air ticket service.')
 WHERE id = 1;
