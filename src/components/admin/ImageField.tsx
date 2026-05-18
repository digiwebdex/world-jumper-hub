// Admin image upload field. Uploads to /api/admin/uploads and stores the
// returned public URL as a hidden input so the surrounding form picks it up.
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface Props {
  label: string;
  name: string;
  defaultValue?: string | null;
  full?: boolean;
  category?: string;
}

export function ImageField({ label, name, defaultValue, full, category = "cms" }: Props) {
  const [url, setUrl] = useState<string>(defaultValue ? String(defaultValue) : "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await api.upload<{ url: string }>(`/admin/uploads?category=${encodeURIComponent(category)}`, fd);
      setUrl(res.url);
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const clear = () => { setUrl(""); setErr(null); };

  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground/80">
        {label}
      </label>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-start gap-3 rounded-md border border-input bg-background p-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
          {url ? (
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button" onClick={onPick} disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {url ? "Replace" : "Upload"}
            </button>
            {url && (
              <button
                type="button" onClick={clear}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://... or upload above"
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          {err && <p className="text-xs text-destructive">{err}</p>}
        </div>
      </div>
    </div>
  );
}
