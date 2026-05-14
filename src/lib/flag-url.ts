// Automatic flag-image mapping. Loads from your Hostinger media folder first,
// and falls back to flagcdn.com if the Hostinger image is missing.
//
// To change the Hostinger location, set VITE_FLAG_BASE_URL in .env, e.g.
//   VITE_FLAG_BASE_URL=https://worldjumperbd.com/uploads/flags
// Files are expected to be named with the lowercase ISO country code, e.g.
//   bd.png, ae.png, gb.png, un.png

const HOSTINGER_BASE: string =
  (import.meta.env.VITE_FLAG_BASE_URL as string | undefined)?.replace(/\/+$/, "") ||
  "https://worldjumperbd.com/uploads/flags";

const FALLBACK_BASE = "https://flagcdn.com/w160";

export function flagUrl(cc: string): string {
  const code = (cc || "").trim().toLowerCase();
  if (!code) return `${FALLBACK_BASE}/un.png`;
  return `${HOSTINGER_BASE}/${code}.png`;
}

export function flagFallbackUrl(cc: string): string {
  const code = (cc || "").trim().toLowerCase() || "un";
  return `${FALLBACK_BASE}/${code}.png`;
}

/** Use as <img onError={onFlagError}> to auto-swap to flagcdn if Hostinger 404s. */
export function onFlagError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.dataset.fallback === "1") return;
  img.dataset.fallback = "1";
  const cc = img.dataset.cc || "un";
  img.src = flagFallbackUrl(cc);
}
