import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { usePartners, type Partner, type PartnerKind } from "@/lib/partners-db";
import { supabase } from "@/integrations/supabase/client";
import { flagUrl, onFlagError } from "@/lib/flag-url";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Loader2, Save, X,
} from "lucide-react";

const EMPTY: Omit<Partner, "id"> = {
  name: "", kind: "airline", country: "", cc: "", display_order: 0, published: true,
};

export default function AdminPartners() {
  const { data, loading, reload } = usePartners(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Partner, "id">>(EMPTY);

  const startCreate = () => {
    const nextOrder = data.length ? Math.max(...data.map(d => d.display_order)) + 10 : 10;
    setForm({ ...EMPTY, display_order: nextOrder });
    setEditing(null);
    setCreating(true);
  };

  const startEdit = (p: Partner) => {
    setForm({
      name: p.name, kind: p.kind, country: p.country, cc: p.cc,
      display_order: p.display_order, published: p.published,
    });
    setEditing(p);
    setCreating(false);
  };

  const cancelForm = () => { setEditing(null); setCreating(false); setForm(EMPTY); };

  const save = async () => {
    if (!form.name.trim() || !form.cc.trim()) {
      alert("Name and country code are required.");
      return;
    }
    const payload = { ...form, cc: form.cc.toUpperCase().trim() };
    setBusy("save");
    if (editing) {
      await supabase.from("partners").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("partners").insert(payload);
    }
    setBusy(null);
    cancelForm();
    reload();
  };

  const togglePublished = async (p: Partner) => {
    setBusy(p.id);
    await supabase.from("partners").update({ published: !p.published }).eq("id", p.id);
    setBusy(null);
    reload();
  };

  const remove = async (p: Partner) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setBusy(p.id);
    await supabase.from("partners").delete().eq("id", p.id);
    setBusy(null);
    reload();
  };

  const move = async (p: Partner, dir: "up" | "down") => {
    const idx = data.findIndex(x => x.id === p.id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= data.length) return;
    const a = data[idx]; const b = data[swap];
    setBusy(p.id);
    await supabase.from("partners").update({ display_order: b.display_order }).eq("id", a.id);
    await supabase.from("partners").update({ display_order: a.display_order }).eq("id", b.id);
    setBusy(null);
    reload();
  };

  const showForm = creating || editing !== null;

  return (
    <AdminShell title="Partners">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data.length} partner{data.length === 1 ? "" : "s"} · shown on the homepage marquee
        </p>
        {!showForm && (
          <button onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
            <Plus className="h-4 w-4" /> New Partner
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg">{editing ? `Edit: ${editing.name}` : "New partner"}</h2>
            <button onClick={cancelForm} className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name *">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input" placeholder="Emirates" />
            </Field>
            <Field label="Country">
              <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                className="input" placeholder="UAE" />
            </Field>
            <Field label="Country code (cc) *">
              <div className="flex items-center gap-3">
                <input value={form.cc} onChange={e => setForm({ ...form, cc: e.target.value.toUpperCase() })}
                  maxLength={3} className="input w-24 uppercase" placeholder="AE" />
                {form.cc && (
                  <img src={flagUrl(form.cc)} data-cc={form.cc} onError={onFlagError}
                    alt="" className="h-8 w-12 rounded ring-1 ring-border object-cover" />
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">ISO-2 code, e.g. AE, BD, US, UN (global).</p>
            </Field>
            <Field label="Kind">
              <select value={form.kind}
                onChange={e => setForm({ ...form, kind: e.target.value as PartnerKind })}
                className="input">
                <option value="airline">Airline</option>
                <option value="hotel">Hotel</option>
                <option value="authority">Authority</option>
              </select>
            </Field>
            <Field label="Display order">
              <input type="number" value={form.display_order}
                onChange={e => setForm({ ...form, display_order: parseInt(e.target.value || "0", 10) })}
                className="input w-32" />
            </Field>
            <Field label="Status">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published}
                  onChange={e => setForm({ ...form, published: e.target.checked })} />
                Published
              </label>
            </Field>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={cancelForm} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
            <button onClick={save} disabled={busy === "save"}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-brand disabled:opacity-60">
              {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Flag</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No partners yet.</td></tr>
            ) : data.map((p, i) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => move(p, "up")} disabled={i === 0 || busy === p.id}
                      className="rounded p-1 hover:bg-muted disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => move(p, "down")} disabled={i === data.length - 1 || busy === p.id}
                      className="rounded p-1 hover:bg-muted disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <span className="ml-1 font-mono text-xs text-muted-foreground">{p.display_order}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <img src={flagUrl(p.cc)} data-cc={p.cc} onError={onFlagError}
                    alt={p.country} className="h-8 w-12 rounded ring-1 ring-border object-cover" />
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 capitalize">{p.kind}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.country} <span className="ml-1 font-mono text-xs">({p.cc})</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePublished(p)} disabled={busy === p.id}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.published ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    }`}>
                    {p.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {p.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(p)}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button onClick={() => remove(p)} disabled={busy === p.id}
                    className="ml-2 inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
