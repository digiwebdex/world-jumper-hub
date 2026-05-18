// CMS-driven per-page SEO. Loads page meta from /api/seo/:key and applies
// it via usePageTitle. Static fallback used until data arrives (and forever
// if admin hasn't set anything for this key).
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";

export interface SeoRow {
  id: string;
  page_key: string;
  title: string;
  description: string;
  og_image: string;
  noindex: boolean;
  updated_at: string;
}

export interface SeoFallback {
  title: string;
  description?: string;
  image?: string;
  path?: string;
}

// Known page keys — keep in sync with AdminSeo.tsx
export const SEO_PAGES = [
  { key: "home",          label: "Home (/)",                 path: "/" },
  { key: "about",         label: "About (/about)",           path: "/about" },
  { key: "services",      label: "Services (/services)",     path: "/services" },
  { key: "visa",          label: "Visa Countries (/visa)",   path: "/visa" },
  { key: "visa-services", label: "Visa Services (/visa-services)", path: "/visa-services" },
  { key: "packages",      label: "Packages (/packages)",     path: "/packages" },
  { key: "contact",       label: "Contact (/contact)",       path: "/contact" },
  { key: "faq",           label: "FAQ (/faq)",               path: "/faq" },
] as const;

export function useSeo(pageKey: string, fallback: SeoFallback) {
  const [row, setRow] = useState<SeoRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.get<{ row: SeoRow | null }>(`/seo/${pageKey}`)
      .then((r) => { if (!cancelled) setRow(r.row); })
      .catch(() => { /* fall back silently */ });
    return () => { cancelled = true; };
  }, [pageKey]);

  const title = row?.title?.trim() || fallback.title;
  const description = row?.description?.trim() || fallback.description;
  const image = row?.og_image?.trim() || fallback.image;

  usePageTitle(title, description, { image, path: fallback.path });

  // Robots noindex
  useEffect(() => {
    if (!row) return;
    let el = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (row.noindex) {
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", "robots");
        document.head.appendChild(el);
      }
      el.setAttribute("content", "noindex, nofollow");
    } else if (el) {
      el.parentElement?.removeChild(el);
    }
  }, [row]);
}
