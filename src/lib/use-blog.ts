// Public + admin shared blog helpers.
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image: string;
  author: string;
  category: string;
  is_published: boolean;
  published_at: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useBlogPosts(all = false) {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const r = await api.get<{ rows: BlogPost[] }>(`/blog${all ? "?all=1" : ""}`);
      setData(r.rows);
    } catch { setData([]); } finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, [all]);
  return { data, loading, reload };
}

export function useBlogPostBySlug(slug: string | undefined) {
  const [data, setData] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    api.get<{ row: BlogPost }>(`/blog/slug/${slug}`)
      .then((r) => { if (!cancelled) { setData(r.row); setError(null); } })
      .catch((e) => { if (!cancelled) { setData(null); setError((e as Error).message); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  return { data, loading, error };
}
