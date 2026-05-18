-- ============================================================
-- Admin password reset tokens (for /api/auth/forgot + /api/auth/reset)
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_password_resets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash  text NOT NULL UNIQUE,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_password_resets_admin ON admin_password_resets(admin_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_expiry ON admin_password_resets(expires_at);
