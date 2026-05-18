import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { api } from "@/lib/api";
import { SEO_PAGES, type SeoRow } from "@/lib/use-seo";
import { Card, Field, PrimaryButton } from "@/components/admin/form-bits";
import { ImageField } from "@/components/admin/ImageField";
import { Save, Loader2 } from "lucide-react";

export default function AdminSeo() {
  const [rows, setRows] = useState<SeoRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const r = await api.get<{ rows: SeoRow[] }>("/seo");
      setRows(r.rows);
    } finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, []);

  const byKey = (k: string) => rows.find((r) => r.page_key === k);

  return (
    <AdminShell title="SEO / Page Meta">
      <p className="mb-4 text-sm text-muted-foreground">
        Override page title, description, share image and search-engine visibility per page.
        Leave blank to keep the built-in default.
      </p>
      {loading && rows.length === 0 ? (
        <Card><div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div></Card>
      ) : (
        <div className="space-y-4">
          {SEO_PAGES.map((p) => (
            <SeoPageCard key={p.key} pageKey={p.key} label={p.label} row={byKey(p.key)} onSaved={reload} />
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function SeoPageCard({ pageKey, label, row, onSaved }: {
  pageKey: string; label: string; row: SeoRow | undefined; onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) { const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t); }
  }, [saved]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      await api.put(`/seo/${pageKey}`, {
        title: String(fd.get("title") ?? ""),
        description: String(fd.get("description") ?? ""),
        og_image: String(fd.get("og_image") ?? ""),
        noindex: fd.get("noindex") === "true",
      });
      setSaved(true);
      onSaved();
    } catch (err) {
      alert((err as Error).message);
    } finally { setSaving(false); }
  };

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{label}</h3>
        <span className="font-mono text-[11px] text-muted-foreground">key: {pageKey}</span>
      </div>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <Field label="Title" name="title" placeholder="Leave blank for default" full
          defaultValue={row?.title ?? ""} />
        <Field label="Meta description" name="description" textarea rows={3} full
          placeholder="160 characters or less, summarising the page"
          defaultValue={row?.description ?? ""} />
        <ImageField label="Share image (og:image)" name="og_image" full
          defaultValue={row?.og_image ?? ""} category="seo" />
        <Field label="Hide from search engines" name="noindex" type="checkbox"
          placeholder="Add noindex, nofollow"
          defaultValue={row?.noindex ?? false} />
        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-1">
          {saved && <span className="text-xs text-emerald-600">Saved ✓</span>}
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </PrimaryButton>
        </div>
      </form>
    </Card>
  );
}
