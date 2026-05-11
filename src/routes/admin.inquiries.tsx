import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Eye, Mail, Phone, MessageCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Modal, Card, GhostButton } from "@/components/admin/form-bits";
import { supabase, type InquiryStatus } from "@/lib/supabase";
import { whatsappLink } from "@/lib/site-config";

interface Inquiry {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  service_type: string | null;
  destination_country: string | null;
  journey_from: string | null;
  journey_to: string | null;
  departure_date: string | null;
  return_date: string | null;
  travel_date: string | null;
  passengers: string | null;
  message: string | null;
  source_page: string | null;
  status: InquiryStatus;
  created_at: string;
}

const STATUSES: InquiryStatus[] = ["New", "Contacted", "Processing", "Completed", "Cancelled"];
const STATUS_COLOR: Record<InquiryStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  Processing: "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-200 text-gray-700",
};

export const Route = createFileRoute("/admin/inquiries")({
  component: InquiriesAdmin,
  head: () => ({ meta: [{ title: "Inquiries — Admin" }] }),
});

function InquiriesAdmin() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [view, setView] = useState<Inquiry | null>(null);

  const load = async () => {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    setItems((data as Inquiry[]) ?? []);
  };
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => items.filter((i) => {
    if (statusFilter && i.status !== statusFilter) return false;
    if (serviceFilter && i.service_type !== serviceFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      const match = [i.full_name, i.mobile_number, i.email, i.destination_country]
        .filter(Boolean).some((v) => v!.toLowerCase().includes(s));
      if (!match) return false;
    }
    return true;
  }), [items, search, statusFilter, serviceFilter]);

  const services = Array.from(new Set(items.map((i) => i.service_type).filter(Boolean))) as string[];

  const updateStatus = async (id: string, status: InquiryStatus) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) { alert(error.message); return; }
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, status } : i)));
    if (view?.id === id) setView({ ...view, status });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    setItems((arr) => arr.filter((i) => i.id !== id));
    setView(null);
  };

  return (
    <AdminShell title="Customer Inquiries">
      <Card>
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / mobile / email / country..."
              className="w-72 rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All services</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} of {items.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="py-2">Date</th><th>Name</th><th>Mobile</th><th>Service</th><th>Destination</th><th>Status</th><th>Source</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-border last:border-0">
                  <td className="py-2 text-xs text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</td>
                  <td className="font-semibold">{i.full_name}</td>
                  <td>{i.mobile_number}</td>
                  <td className="text-muted-foreground">{i.service_type ?? "—"}</td>
                  <td className="text-muted-foreground">{i.destination_country ?? i.journey_to ?? "—"}</td>
                  <td>
                    <select value={i.status}
                      onChange={(e) => void updateStatus(i.id, e.target.value as InquiryStatus)}
                      className={`rounded-full border-0 px-2 py-1 text-xs font-semibold outline-none ${STATUS_COLOR[i.status]}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="text-xs text-muted-foreground">{i.source_page ?? "—"}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setView(i)} className="rounded-md border border-border p-1.5 hover:bg-muted"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => void remove(i.id)} className="rounded-md border border-border p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">No inquiries found.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal wide open={!!view} onClose={() => setView(null)} title={view?.full_name ?? "Inquiry"}>
        {view && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <a href={`tel:${view.mobile_number}`} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Phone className="h-3.5 w-3.5" /> Call</a>
              <a href={whatsappLink(`Hello ${view.full_name}, regarding your inquiry to World Jumper.`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>
              {view.email && <a href={`mailto:${view.email}`} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold"><Mail className="h-3.5 w-3.5" /> Email</a>}
            </div>
            <dl className="grid gap-3 md:grid-cols-2">
              <Detail k="Submitted" v={new Date(view.created_at).toLocaleString()} />
              <Detail k="Status" v={view.status} />
              <Detail k="Mobile" v={view.mobile_number} />
              <Detail k="Email" v={view.email} />
              <Detail k="Service" v={view.service_type} />
              <Detail k="Destination" v={view.destination_country} />
              <Detail k="Journey From" v={view.journey_from} />
              <Detail k="Journey To" v={view.journey_to} />
              <Detail k="Departure" v={view.departure_date} />
              <Detail k="Return" v={view.return_date} />
              <Detail k="Travel Date" v={view.travel_date} />
              <Detail k="Passengers" v={view.passengers} />
              <Detail k="Source page" v={view.source_page} />
            </dl>
            {view.message && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
                <p className="mt-1 whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-sm">{view.message}</p>
              </div>
            )}
            <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
              <GhostButton onClick={() => setView(null)}>Close</GhostButton>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}

function Detail({ k, v }: { k: string; v: string | null | undefined }) {
  if (!v) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k}</dt>
      <dd className="text-sm font-medium">{v}</dd>
    </div>
  );
}
