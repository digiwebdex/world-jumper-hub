import { useEffect } from "react";

const SITE_NAME = "World Jumper Tours & Travels";
const SITE_URL = "https://worldjumperbd.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, prop] = /^meta\[(?:name|property)="([^"]+)"\]$/.exec(selector) ?? [];
    if (prop) {
      el.setAttribute(selector.includes("property=") ? "property" : "name", prop);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets the page title, meta description, and Open Graph / Twitter tags so
 * that link previews on Facebook, WhatsApp, LinkedIn, X, etc. show
 * page-specific text and the brand share image.
 */
export function usePageTitle(
  title: string,
  description?: string,
  options?: { image?: string; path?: string }
) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;
    document.title = fullTitle;

    const desc =
      description ??
      "Govt. approved travel agency in Bangladesh. Visas for 30+ countries, curated tours, air tickets, Umrah and medical tourism — all under one trusted roof.";
    const image = options?.image ?? DEFAULT_OG_IMAGE;
    const url = `${SITE_URL}${options?.path ?? (typeof window !== "undefined" ? window.location.pathname : "/")}`;

    setMeta('meta[name="description"]', "content", desc);

    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);

    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[name="twitter:image"]', "content", image);

    setLink("canonical", url);
  }, [title, description, options?.image, options?.path]);
}
