import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useMemberships, type Membership } from "@/lib/memberships-db";
import { api } from "@/lib/api";
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Loader2, Save, X, Upload } from "lucide-react";

const EMPTY: Omit<Membership, "id"> = {
  name: "", logo_url: null, link_url: null, display_order: 0, published: true,
};

export default function AdminMemberships() {
  const { data, loading, reload } = useMemberships(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<Membership | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Membership, "id">>(EMPTY);
  const [uploading, setUploading] = useState(false);

  const startCreate = () => {
    const nextOrder = data.length ? Math.max(...data.map(d => d.display_order)) + 10 : 10;
    setForm({ ...EMPTY, display_order: nextOrder });
    setEditing(null);
    setCreating(true);
  };

  const startEdit = (m: Membership) => {
    setForm({
      name: m.name, logo_url: m.logo_url, link_url: m.link_url,
      display_order: m.display_order, published: m.published,
    });
    setEditing(m);
    setCreating(false);
  };

  const cancelForm = () => { setEditing(null); setCreating(false); setForm(EMPTY); };

  const save = async () => {
    if (!form.name.trim()) { alert("Name is required."); return; }
    setBusy("save");
    try {
      if (editing) {
        await api.put(`/memberships/${editing.id}`, form);
      } else {
        await api.post("/memberships", form);
      }
    } catch (e) {
      alert(`Save failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setBusy(null);
    }
    cancelForm();
    reload();
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.upload<{ url: string }>("/admin/uploads?category=memberships", fd);
      setForm(f => ({ ...f, logo_url: res.url }));
    } catch (e) {
      alert(`Upload failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  const togglePublished = async (m: Membership) => {
    setBusy(m.id);
    await api.put(`/memberships/${m.id}`, { published: !m.published });
    setBusy(null);
    reload();
  };

  const move = async (m: Membership, dir: -1 | 1) => {
    const sorted = [...data].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex(x => x.id === m.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    setBusy(m.id);
    await Promise.all([
      api.put(`/memberships/${m.id}`, { display_order: swap.display_order }),
      api.put(`/memberships/${swap.id}`, { display_order: m.display_order }),
    ]);
    setBusy(null);
    reload();
  };

  const remove = async (m: Membership) => {
    if (!confirm(`Delete "${m.name}"?`)) return;
    setBusy(m.id);
    await api.delete(`/memberships/${m.id}`);
    setBusy(null);
    reload();
  };

  const showForm = creating || editing !== null;

  return (
    <AdminShell title="Memberships">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage the "Member of" logo strip shown on the home page.</p>
        {!showForm && (
          <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90">
            <Plus className="h-4 w-4" /> Add membership
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">{editing ? "Edit membership" : "New membership"}</h2>
            <button onClick={cancelForm} className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Name *</span>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="IATA" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Display order</span>
              <input type="number" className="input" value={form.display_order} onChange={e => setForm({ ...form, display_order: Number(e.target.value) || 0 })} />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Logo URL</span>
              <input className="input" value={form.logo_url || ""} onChange={e => setForm({ ...form, logo_url: e.target.value || null })} placeholder="https://... or upload below" />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Upload logo image</span>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted/70">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Uploading..." : "Choose file"}
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                </label>
                {form.logo_url && (
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-white ring-1 ring-border">
                    <img src={form.logo_url} alt="preview" className="h-full w-full object-contain" />
                  </div>
                )}
              </div>
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Link URL (optional)</span>
              <input className="input" value={form.link_url || ""} onChange={e => setForm({ ...form, link_url: e.target.value || null })} placeholder="https://www.iata.org" />
            </label>
            <label className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
              <span className="text-sm">Published (visible on site)</span>
            </label>
          </div>
          <div className="mt-5 flex gap-2">
            <button onClick={save} disabled={busy === "save"} className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 disabled:opacity-50">
              {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
            <button onClick={cancelForm} className="rounded-md border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center p-10 text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No memberships yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Logo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(m => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-white ring-1 ring-border">
                      {m.logo_url ? (
                        <img src={m.logo_url} alt={m.name} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.display_order}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${m.published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                      {m.published ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => move(m, -1)} disabled={busy === m.id} className="rounded p-1.5 hover:bg-muted disabled:opacity-50" title="Move up"><ArrowUp className="h-4 w-4" /></button>
                      <button onClick={() => move(m, 1)} disabled={busy === m.id} className="rounded p-1.5 hover:bg-muted disabled:opacity-50" title="Move down"><ArrowDown className="h-4 w-4" /></button>
                      <button onClick={() => togglePublished(m)} disabled={busy === m.id} className="rounded p-1.5 hover:bg-muted disabled:opacity-50" title={m.published ? "Hide" : "Publish"}>
                        {m.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button onClick={() => startEdit(m)} className="rounded p-1.5 hover:bg-muted" title="Edit"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(m)} disabled={busy === m.id} className="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
