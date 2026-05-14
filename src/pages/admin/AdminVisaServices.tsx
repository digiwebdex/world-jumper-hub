import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { useVisaServices } from "@/lib/visa-services-db";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

export default function AdminVisaServices() {
  const { data, loading, reload } = useVisaServices(true);
  const [busy, setBusy] = useState<string | null>(null);

  const togglePublished = async (id: string, current: boolean) => {
    setBusy(id);
    await supabase.from("visa_services").update({ published: !current }).eq("id", id);
    setBusy(null);
    reload();
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(id);
    await supabase.from("visa_services").delete().eq("id", id);
    setBusy(null);
    reload();
  };

  const move = async (id: string, dir: "up" | "down") => {
    const idx = data.findIndex((s) => s.id === id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= data.length) return;
    const a = data[idx]; const b = data[swap];
    setBusy(id);
    await supabase.from("visa_services").update({ display_order: b.displayOrder ?? 0 }).eq("id", a.id!);
    await supabase.from("visa_services").update({ display_order: a.displayOrder ?? 0 }).eq("id", b.id!);
    setBusy(null);
    reload();
  };

  return (
    <AdminShell title="Visa Services">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{data.length} service{data.length === 1 ? "" : "s"}</p>
        <Link to="/admin/visa-services/new"
          className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
          <Plus className="h-4 w-4" /> New Service
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
              </td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No services yet.</td></tr>
            ) : data.map((s, i) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => move(s.id!, "up")} disabled={i === 0 || busy === s.id}
                      className="rounded p-1 hover:bg-muted disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => move(s.id!, "down")} disabled={i === data.length - 1 || busy === s.id}
                      className="rounded p-1 hover:bg-muted disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <span className="ml-1 font-mono text-xs text-muted-foreground">{s.number}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{s.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.slug}</td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePublished(s.id!, !!s.published)} disabled={busy === s.id}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      s.published ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    }`}>
                    {s.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {s.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/visa-services/${s.id}`} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted">
                    <Pencil className="h-3 w-3" /> Edit
                  </Link>
                  <button onClick={() => remove(s.id!, s.title)} disabled={busy === s.id}
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
