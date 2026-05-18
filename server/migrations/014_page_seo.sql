-- Per-page SEO meta (title, description, og:image, noindex)
CREATE TABLE IF NOT EXISTS page_seo (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key     text NOT NULL UNIQUE,
  title        text NOT NULL DEFAULT '',
  description  text NOT NULL DEFAULT '',
  og_image     text NOT NULL DEFAULT '',
  noindex      boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_seo_key ON page_seo(page_key);
