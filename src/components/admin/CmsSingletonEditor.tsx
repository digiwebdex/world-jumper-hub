// Generic singleton-row editor (e.g. home_hero, about_page).
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Field, PrimaryButton, Card } from "@/components/admin/form-bits";
import { Save, Loader2 } from "lucide-react";
import type { FieldDef } from "@/components/admin/CmsListEditor";

interface Props<T> {
  basePath: string;             // e.g. "/home/hero"
  data: T;
  loading: boolean;
  reload: () => void | Promise<void>;
  fields: FieldDef[];
}

export function CmsSingletonEditor<T extends Record<string, unknown>>({
  basePath, data, loading, reload, fields,
}: Props<T>) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (saved) { const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t); } }, [saved]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = fd.get(f.name);
      body[f.name] = raw == null ? null : String(raw);
    }
    setSaving(true);
    try {
      await api.put(basePath, body);
      await reload();
      setSaved(true);
    } catch (err) {
      alert((err as Error).message);
    } finally { setSaving(false); }
  };

  if (loading) return (
    <Card>
      <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
    </Card>
  );

  return (
    <Card>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <Field
            key={f.name}
            label={f.label}
            name={f.name}
            type={f.type === "textarea" ? "text" : (f.type ?? "text")}
            textarea={f.type === "textarea"}
            rows={f.rows}
            placeholder={f.placeholder}
            full={f.full}
            defaultValue={(data?.[f.name] as string | number | null) ?? ""}
          />
        ))}
        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          {saved && <span className="text-xs text-emerald-600">Saved ✓</span>}
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
          </PrimaryButton>
        </div>
      </form>
    </Card>
  );
}
