import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, Modal, PrimaryButton, GhostButton, Card } from "@/components/admin/form-bits";
import { ImageUrlPreview } from "@/components/admin/ImageUrlPreview";
import { supabase, type VisaCountry } from "@/lib/supabase";

export const Route = createFileRoute("/admin/visa-countries")({
  component: VisaCountriesAdmin,
  head: () => ({ meta: [{ title: "Visa Countries — Admin" }] }),
});

function VisaCountriesAdmin() {
  const [items, setItems] = useState<VisaCountry[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<VisaCountry | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("visa_countries").select("*").order("country_name");
    setItems((data as VisaCountry[]) ?? []);
  };
  useEffect(() => { void load(); }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      country_name: String(fd.get("country_name") ?? "").trim(),
      slug: String(fd.get("slug") ?? "").trim().toLowerCase(),
      flag_url: String(fd.get("flag_url") ?? "").trim() || null,
      short_description: String(fd.get("short_description") ?? "").trim() || null,
      is_featured: fd.get("is_featured") === "true",
      is_active: fd.get("is_active") === "true",
    };
    const op = editing
      ? supabase.from("visa_countries").update(payload).eq("id", editing.id)
      : supabase.from("visa_countries").insert(payload);
    const { error } = await op;
    setBusy(false);
    if (error) { alert(error.message); return; }
    setEditing(null); setCreating(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this country? Related visa requirements will also be removed.")) return;
    const { error } = await supabase.from("visa_countries").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    await load();
  };

  const filtered = items.filter((c) => c.country_name.toLowerCase().includes(search.toLowerCase()));
  const current = editing;

  return (
    <AdminShell title="Visa Countries">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
              className="rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <PrimaryButton onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add country</PrimaryButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="py-2">Flag</th><th>Country</th><th>Slug</th><th>Featured</th><th>Active</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="py-2"><ImageUrlPreview url={c.flag_url} /></td>
                  <td>
                    <div className="font-semibold">{c.country_name}</div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">{c.short_description}</div>
                  </td>
                  <td className="text-muted-foreground">{c.slug}</td>
                  <td>{c.is_featured ? "Yes" : "No"}</td>
                  <td>{c.is_active ? <span className="text-green-600">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(c)} className="rounded-md border border-border p-1.5 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => void remove(c.id)} className="rounded-md border border-border p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">No countries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={creating || !!editing} onClose={() => { setEditing(null); setCreating(false); }}
        title={editing ? `Edit ${editing.country_name}` : "Add visa country"}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Country name" name="country_name" required defaultValue={current?.country_name} />
          <Field label="Slug" name="slug" required defaultValue={current?.slug} placeholder="india" />
          <Field label="Flag image URL" name="flag_url" full defaultValue={current?.flag_url}
            placeholder="https://worldjumperbd.com/uploads/visa-countries/india.jpg" />
          <Field label="Short description" name="short_description" full textarea defaultValue={current?.short_description} />
          <Field label="Featured" name="is_featured" type="checkbox" defaultValue={current?.is_featured ?? false} />
          <Field label="Active" name="is_active" type="checkbox" defaultValue={current?.is_active ?? true} />
          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <GhostButton onClick={() => { setEditing(null); setCreating(false); }}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={busy}>{busy ? "Saving..." : "Save"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
}
