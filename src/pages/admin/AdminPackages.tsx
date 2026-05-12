import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Field, GhostButton, Modal, PrimaryButton, Toolbar } from "@/components/admin/form-bits";
import { ImageUrlPreview } from "@/components/admin/ImageUrlPreview";
import { api, type Package } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";
import { Plus, Pencil, Trash2 } from "lucide-react";

const TYPES = ["Tour", "Umrah", "Medical Tourism", "Air Ticket Offer"] as const;

export default function AdminPackages() {
  usePageTitle("Packages");
  const [items, setItems] = useState<Package[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);

  const load = () => api.get<{ items: Package[] }>("/admin/packages").then(r => setItems(r.items)).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const payload = {
      ...fd,
      is_featured: fd.is_featured === "true",
      is_active: fd.is_active === "true",
    };
    if (editing) await api.put(`/admin/packages/${editing.id}`, payload);
    else await api.post("/admin/packages", payload);
    setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await api.delete(`/admin/packages/${id}`); load();
  };

  return (
    <AdminShell title="Packages">
      <Toolbar>
        <p className="text-sm text-muted-foreground">{items.length} total</p>
        <PrimaryButton onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4" /> Add package
        </PrimaryButton>
      </Toolbar>

      <div className="grid gap-3">
        {items.map(p => (
          <Card key={p.id}>
            <div className="flex items-start gap-4">
              <ImageUrlPreview url={p.image_url} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">{p.package_type}</span>
                  {p.is_featured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">Featured</span>}
                  {!p.is_active && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-800">Inactive</span>}
                </div>
                <h3 className="mt-1 font-bold">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.destination} · {p.duration} · {p.price}</p>
              </div>
              <div className="flex gap-2">
                <GhostButton onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></GhostButton>
                <GhostButton onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></GhostButton>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal wide open={open} onClose={() => { setOpen(false); setEditing(null); }} title={editing ? "Edit package" : "New package"}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Title" name="title" defaultValue={editing?.title} required />
          <Field label="Slug" name="slug" defaultValue={editing?.slug} required />
          <Field label="Type" name="package_type" options={TYPES} defaultValue={editing?.package_type ?? "Tour"} required />
          <Field label="Destination" name="destination" defaultValue={editing?.destination ?? ""} />
          <Field label="Duration" name="duration" defaultValue={editing?.duration ?? ""} placeholder="5 Days 4 Nights" />
          <Field label="Price" name="price" defaultValue={editing?.price ?? ""} placeholder="৳ 45,000" />
          <Field full label="Image URL" name="image_url" defaultValue={editing?.image_url ?? ""} placeholder="https://uploads.worldjumperbd.com/packages/thailand-tour.jpg" />
          <Field full label="Brochure URL" name="brochure_url" defaultValue={editing?.brochure_url ?? ""} placeholder="https://uploads.worldjumperbd.com/documents/sample-document.pdf" />
          <Field full textarea label="Short Description" name="short_description" defaultValue={editing?.short_description ?? ""} />
          <Field full textarea rows={5} label="Full Description" name="full_description" defaultValue={editing?.full_description ?? ""} />
          <Field full textarea label="Included Services" name="included_services" defaultValue={editing?.included_services ?? ""} />
          <Field full textarea label="Excluded Services" name="excluded_services" defaultValue={editing?.excluded_services ?? ""} />
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
