import { useState } from "react";
import { ImageOff, FileText } from "lucide-react";
import { resolveImageUrl } from "@/components/site/SafeImage";

export function ImageUrlPreview({ url }: { url: string | null | undefined }) {
  const [err, setErr] = useState(false);
  const resolved = resolveImageUrl(url);
  if (!resolved) return null;
  if (err) {
    return (
      <div className="flex h-24 w-32 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted px-2 text-center text-muted-foreground">
        <ImageOff className="h-5 w-5" />
        <span className="text-[10px] leading-tight">Image not uploaded yet</span>
      </div>
    );
  }
  return (
    <img
      src={resolved}
      alt="preview"
      onError={() => setErr(true)}
      className="h-24 w-32 rounded-md border border-border object-cover"
    />
  );
}

export function FileUrlPreview({ url }: { url: string | null | undefined }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-xs font-medium hover:border-primary/40">
      <FileText className="h-3.5 w-3.5" /> Open file
    </a>
  );
}
