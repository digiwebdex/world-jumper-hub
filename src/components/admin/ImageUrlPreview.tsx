import { useState } from "react";
import { ImageOff, FileText } from "lucide-react";

export function ImageUrlPreview({ url }: { url: string | null | undefined }) {
  const [err, setErr] = useState(false);
  if (!url) return null;
  if (err) {
    return (
      <div className="flex h-24 w-32 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }
  return (
    <img
      src={url}
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
