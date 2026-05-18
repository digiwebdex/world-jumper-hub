CREATE TABLE IF NOT EXISTS blog_posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  title         text NOT NULL,
  excerpt       text NOT NULL DEFAULT '',
  body          text NOT NULL DEFAULT '',
  cover_image   text NOT NULL DEFAULT '',
  author        text NOT NULL DEFAULT 'World Jumper',
  category      text NOT NULL DEFAULT 'General',
  is_published  boolean NOT NULL DEFAULT false,
  published_at  timestamptz,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
