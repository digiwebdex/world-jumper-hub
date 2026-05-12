import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Field, GhostButton, Modal, PrimaryButton, Toolbar } from "@/components/admin/form-bits";
import { ImageUrlPreview } from "@/components/admin/ImageUrlPreview";
import { api, type VisaCountry } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminVisaCountries() {
  usePageTitle("Visa Countries");
  const [items, setItems] = useState<VisaCountry[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VisaCountry | null>(null);

  const load = () => api.get<{ items: VisaCountry[] }>("/admin/visa-countries").then(r => setItems(r.items)).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const payload = {
      country_name: fd.country_name,
      slug: fd.slug,
      flag_url: fd.flag_url || null,
      short_description: fd.short_description || null,
      is_featured: fd.is_featured === "true",
      is_active: fd.is_active === "true",
    };
    if (editing) await api.put(`/admin/visa-countries/${editing.id}`, payload);
    else await api.post("/admin/visa-countries", payload);
    setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this country?")) return;
    await api.delete(`/admin/visa-countries/${id}`); load();
  };

  return (
    <AdminShell title="Visa Countries">
      <Toolbar>
        <p className="text-sm text-muted-foreground">{items.length} total</p>
        <PrimaryButton onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4" /> Add country
        </PrimaryButton>
      </Toolbar>

      <div className="grid gap-3">
        {items.map(c => (
          <Card key={c.id}>
            <div className="flex items-start gap-4">
              <ImageUrlPreview url={c.flag_url} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{c.country_name}</h3>
                  {c.is_featured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">Featured</span>}
                  {!c.is_active && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-800">Inactive</span>}
                </div>
                <p className="text-xs text-muted-foreground">/{c.slug}</p>
                {c.short_description && <p className="mt-1 text-sm">{c.short_description}</p>}
              </div>
              <div className="flex gap-2">
                <GhostButton onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></GhostButton>
                <GhostButton onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></GhostButton>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => { setOpen(false); setEditing(null); }} title={editing ? "Edit country" : "New country"}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Country Name" name="country_name" defaultValue={editing?.country_name} required />
          <Field label="Slug" name="slug" defaultValue={editing?.slug} placeholder="thailand" required />
          <Field full label="Flag / Cover URL" name="flag_url" defaultValue={editing?.flag_url ?? ""} placeholder="https://uploads.worldjumperbd.com/visa-countries/india.jpg" />
          <Field full textarea label="Short Description" name="short_description" defaultValue={editing?.short_description ?? ""} />
          <Field type="checkbox" label="Featured" name="is_featured" defaultValue={editing?.is_featured ?? false} />
          <Field type="checkbox" label="Active" name="is_active" defaultValue={editing?.is_active ?? true} />
          <div className="md:col-span-2 flex justify-end gap-2">
            <GhostButton onClick={() => { setOpen(false); setEditing(null); }}>Cancel</GhostButton>
            <PrimaryButton type="submit">Save</PrimaryButton>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
}
