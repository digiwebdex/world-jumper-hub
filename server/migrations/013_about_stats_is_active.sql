-- about_stats was created without is_active in 005; add it so the shared
-- list-table helper can manage it like every other CMS list.
ALTER TABLE about_stats
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
