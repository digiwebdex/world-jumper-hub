-- ============================================================
-- Extend admin_users for self-signup + password update tracking
-- ============================================================

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS full_name  text NOT NULL DEFAULT '';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
