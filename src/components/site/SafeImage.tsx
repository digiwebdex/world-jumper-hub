import { useState, type ImgHTMLAttributes, type ReactNode } from "react";

const UPLOADS_BASE = "https://uploads.worldjumperbd.com";

/** Normalize an image URL: turn a stray `/uploads/...` or `uploads/...` relative
 *  path into the full uploads subdomain URL. Returns null for empty/invalid input. */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  // Rewrite legacy apex /uploads/ URLs to the new uploads subdomain
  if (/^https?:\/\/(www\.)?worldjumperbd\.com\/uploads\//i.test(trimmed)) {
    return trimmed.replace(/^https?:\/\/(www\.)?worldjumperbd\.com\/uploads\//i, `${UPLOADS_BASE}/`);
  }
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/uploads/")) return `${UPLOADS_BASE}${trimmed.slice("/uploads".length)}`;
  if (trimmed.startsWith("uploads/")) return `${UPLOADS_BASE}/${trimmed.slice("uploads/".length)}`;
  if (trimmed.startsWith("/")) return `${UPLOADS_BASE}${trimmed}`;
  return trimmed; // local asset or data URL — render as-is
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | null | undefined;
  fallback?: ReactNode;
};

/** Image with a clean gradient/icon fallback on 404 or empty src.
 *  Missing images on Hostinger are NOT a code error — just a visual fallback. */
export function SafeImage({ src, fallback, alt = "", className, ...rest }: Props) {
  const resolved = resolveImageUrl(src);
  const [errored, setErrored] = useState(false);

  if (!resolved || errored) {
    return (
      <div
        className={
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-muted via-muted to-muted-foreground/10 text-muted-foreground " +
          (className ?? "")
        }
        aria-label={alt || "Image unavailable"}
      >
        {fallback ?? (
          <svg viewBox="0 0 24 24" className="h-8 w-8 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="11" r="1.5" />
            <path d="M21 17l-5-5-8 8" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <img
      {...rest}
      src={resolved}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
