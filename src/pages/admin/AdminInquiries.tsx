import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, GhostButton, Toolbar } from "@/components/admin/form-bits";
import { api, type InquiryStatus } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";
import { Trash2 } from "lucide-react";

interface Inquiry {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  service_type: string | null;
  destination_country: string | null;
  message: string | null;
  source_page: string | null;
  status: InquiryStatus;
  created_at: string;
}

const STATUSES: InquiryStatus[] = ["New", "Contacted", "Processing", "Completed", "Cancelled"];

export default function AdminInquiries() {
  usePageTitle("Inquiries");
  const [items, setItems] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<string>("");

  const load = () => {
    const q = filter ? `?status=${filter}` : "";
    api.get<{ items: Inquiry[] }>(`/admin/inquiries${q}`).then(r => setItems(r.items)).catch(() => setItems([]));
  };
  useEffect(load, [filter]);

  const setStatus = async (id: string, status: InquiryStatus) => {
    await api.patch(`/admin/inquiries/${id}`, { status }); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await api.delete(`/admin/inquiries/${id}`); load();
  };

  return (
    <AdminShell title="Inquiries">
      <Toolbar>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <p className="text-sm text-muted-foreground">{items.length} total</p>
      </Toolbar>

      <div className="grid gap-3">
        {items.map(i => (
          <Card key={i.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{i.full_name}</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">{i.status}</span>
                </div>
                <p className="text-sm">
                  <a href={`tel:${i.mobile_number}`} className="text-primary">{i.mobile_number}</a>
                  {i.email && <> · <a href={`mailto:${i.email}`} className="text-primary">{i.email}</a></>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {i.service_type ?? "—"} {i.destination_country ? `· ${i.destination_country}` : ""} · {i.source_page} · {new Date(i.created_at).toLocaleString()}
                </p>
                {i.message && <p className="mt-2 whitespace-pre-line text-sm">{i.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <select value={i.status} onChange={e => setStatus(i.id, e.target.value as InquiryStatus)}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <GhostButton onClick={() => remove(i.id)}><Trash2 className="h-4 w-4" /></GhostButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
