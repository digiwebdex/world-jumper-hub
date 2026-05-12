import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, Modal, PrimaryButton, GhostButton, Card } from "@/components/admin/form-bits";
import { ImageUrlPreview, FileUrlPreview } from "@/components/admin/ImageUrlPreview";
import { supabase, type Package } from "@/lib/supabase";

export const Route = createFileRoute("/admin/packages")({
  component: PackagesAdmin,
  head: () => ({ meta: [{ title: "Packages — Admin" }] }),
});

const PACKAGE_TYPES = ["Tour", "Umrah", "Medical Tourism", "Air Ticket Offer"] as const;

function PackagesAdmin() {
  const [items, setItems] = useState<Package[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [editing, setEditing] = useState<Package | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("packages").select("*").order("created_at", { ascending: false });
    setItems((data as Package[]) ?? []);
  };
  useEffect(() => { void load(); }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") ?? "").trim(),
      slug: String(fd.get("slug") ?? "").trim().toLowerCase(),
      package_type: String(fd.get("package_type") ?? ""),
      destination: String(fd.get("destination") ?? "").trim() || null,
      duration: String(fd.get("duration") ?? "").trim() || null,
      price: String(fd.get("price") ?? "").trim() || null,
      short_description: String(fd.get("short_description") ?? "").trim() || null,
      full_description: String(fd.get("full_description") ?? "").trim() || null,
      included_services: String(fd.get("included_services") ?? "").trim() || null,
      excluded_services: String(fd.get("excluded_services") ?? "").trim() || null,
      image_url: String(fd.get("image_url") ?? "").trim() || null,
      gallery_urls: String(fd.get("gallery_urls") ?? "").trim() || null,
      brochure_url: String(fd.get("brochure_url") ?? "").trim() || null,
      is_featured: fd.get("is_featured") === "true",
      is_active: fd.get("is_active") === "true",
    };
    const op = editing
      ? supabase.from("packages").update(payload).eq("id", editing.id)
      : supabase.from("packages").insert(payload);
    const { error } = await op;
    setBusy(false);
    if (error) { alert(error.message); return; }
    setEditing(null); setCreating(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    await load();
  };

  const filtered = items.filter((p) => {
    if (filterType && p.package_type !== filterType) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const current = editing;

  return (
    <AdminShell title="Packages (Tour, Umrah, Medical, Air Ticket)">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
                className="rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">All types</option>
              {PACKAGE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <PrimaryButton onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add package</PrimaryButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="py-2">Image</th><th>Title</th><th>Type</th><th>Price</th><th>Active</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="py-2"><ImageUrlPreview url={p.image_url} /></td>
                  <td>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.destination} · {p.duration}</div>
                  </td>
                  <td><span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">{p.package_type}</span></td>
                  <td>{p.price ?? "—"}</td>
                  <td>{p.is_active ? <span className="text-green-600">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(p)} className="rounded-md border border-border p-1.5 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => void remove(p.id)} className="rounded-md border border-border p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">No packages found.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal wide open={creating || !!editing} onClose={() => { setEditing(null); setCreating(false); }}
        title={editing ? `Edit ${editing.title}` : "Add package"}>
        <form onSubmit={submit} className="grid max-h-[75vh] gap-4 overflow-y-auto pr-2 md:grid-cols-2">
          <Field label="Title" name="title" required defaultValue={current?.title} />
          <Field label="Slug" name="slug" required defaultValue={current?.slug} placeholder="bangkok-pattaya-5d" />
          <Field label="Package type" name="package_type" required options={PACKAGE_TYPES} defaultValue={current?.package_type} />
          <Field label="Destination" name="destination" defaultValue={current?.destination} />
          <Field label="Duration" name="duration" defaultValue={current?.duration} placeholder="5 Days / 4 Nights" />
          <Field label="Price (text)" name="price" defaultValue={current?.price} placeholder="Starting from BDT 38,500" />
          <Field full label="Short description" name="short_description" textarea defaultValue={current?.short_description} />
          <Field full label="Full description" name="full_description" textarea rows={5} defaultValue={current?.full_description} />
          <Field full label="Included services" name="included_services" textarea defaultValue={current?.included_services} />
          <Field full label="Excluded services" name="excluded_services" textarea defaultValue={current?.excluded_services} />
          <div className="md:col-span-2">
            <Field full label="Main image URL" name="image_url" defaultValue={current?.image_url}
              placeholder="https://uploads.worldjumperbd.com/packages/sample.jpg" />
            <div className="mt-2"><ImageUrlPreview url={current?.image_url ?? null} /></div>
          </div>
          <Field full label="Gallery URLs (comma separated)" name="gallery_urls" textarea defaultValue={current?.gallery_urls} />
          <div className="md:col-span-2">
            <Field full label="Brochure / PDF URL" name="brochure_url" defaultValue={current?.brochure_url}
              placeholder="https://uploads.worldjumperbd.com/documents/sample.pdf" />
            <div className="mt-2"><FileUrlPreview url={current?.brochure_url ?? null} /></div>
          </div>
          <Field label="Featured" name="is_featured" type="checkbox" defaultValue={current?.is_featured ?? false} />
          <Field label="Active" name="is_active" type="checkbox" defaultValue={current?.is_active ?? true} />
          <div className="md:col-span-2 flex items-center justify-end gap-3 border-t border-border pt-3">
            <GhostButton onClick={() => { setEditing(null); setCreating(false); }}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={busy}>{busy ? "Saving..." : "Save"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
}
