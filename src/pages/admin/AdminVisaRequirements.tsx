import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Field, GhostButton, Modal, PrimaryButton, Toolbar } from "@/components/admin/form-bits";
import { api, type VisaCountry, type VisaRequirement } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";
import { Plus, Pencil, Trash2 } from "lucide-react";

const VISA_TYPES = ["Tourist", "Business", "Student", "Medical", "Work", "Family", "Transit"] as const;

export default function AdminVisaRequirements() {
  usePageTitle("Visa Requirements");
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [items, setItems] = useState<VisaRequirement[]>([]);
  const [country, setCountry] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VisaRequirement | null>(null);

  useEffect(() => { api.get<{ items: VisaCountry[] }>("/admin/visa-countries").then(r => setCountries(r.items)); }, []);

  const load = () => {
    const q = country ? `?country_id=${country}` : "";
    api.get<{ items: VisaRequirement[] }>(`/admin/visa-requirements${q}`).then(r => setItems(r.items)).catch(() => setItems([]));
  };
  useEffect(() => { load(); }, [country]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const payload = { ...fd, is_active: fd.is_active === "true" };
    if (editing) await api.put(`/admin/visa-requirements/${editing.id}`, payload);
    else await api.post("/admin/visa-requirements", payload);
    setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await api.delete(`/admin/visa-requirements/${id}`); load();
  };

  return (
    <AdminShell title="Visa Requirements">
      <Toolbar>
        <select value={country} onChange={e => setCountry(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">All countries</option>
          {countries.map(c => <option key={c.id} value={c.id}>{c.country_name}</option>)}
        </select>
        <PrimaryButton onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4" /> Add requirement
        </PrimaryButton>
      </Toolbar>

      <div className="grid gap-3">
        {items.map(r => {
          const cName = countries.find(c => c.id === r.country_id)?.country_name ?? "—";
          return (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-primary">{cName} · {r.visa_type}</p>
                  {r.processing_time && <p className="mt-1 text-sm">Processing: {r.processing_time}</p>}
                  {r.embassy_fee && <p className="text-sm">Embassy fee: {r.embassy_fee}</p>}
                </div>
                <div className="flex gap-2">
                  <GhostButton onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></GhostButton>
                  <GhostButton onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></GhostButton>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal wide open={open} onClose={() => { setOpen(false); setEditing(null); }} title={editing ? "Edit requirement" : "New requirement"}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase">Country *</label>
            <select name="country_id" defaultValue={editing?.country_id ?? country} required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select country</option>
              {countries.map(c => <option key={c.id} value={c.id}>{c.country_name}</option>)}
            </select>
          </div>
          <Field label="Visa Type" name="visa_type" options={VISA_TYPES} defaultValue={editing?.visa_type} required />
          <Field label="Processing Time" name="processing_time" defaultValue={editing?.processing_time ?? ""} />
          <Field label="Embassy Fee" name="embassy_fee" defaultValue={editing?.embassy_fee ?? ""} />
          <Field label="Service Charge" name="service_charge" defaultValue={editing?.service_charge ?? ""} />
          <Field full textarea label="Required Documents" name="required_documents" defaultValue={editing?.required_documents ?? ""} />
          <Field textarea label="Passport" name="passport_requirement" defaultValue={editing?.passport_requirement ?? ""} />
          <Field textarea label="Photo" name="photo_requirement" defaultValue={editing?.photo_requirement ?? ""} />
          <Field textarea label="NID / Birth Cert." name="nid_or_birth_certificate" defaultValue={editing?.nid_or_birth_certificate ?? ""} />
          <Field textarea label="Bank Statement" name="bank_statement" defaultValue={editing?.bank_statement ?? ""} />
          <Field textarea label="Bank Solvency" name="bank_solvency" defaultValue={editing?.bank_solvency ?? ""} />
          <Field textarea label="Job Certificate" name="job_certificate" defaultValue={editing?.job_certificate ?? ""} />
          <Field textarea label="Trade License" name="trade_license" defaultValue={editing?.trade_license ?? ""} />
          <Field textarea label="Hotel Booking" name="hotel_booking" defaultValue={editing?.hotel_booking ?? ""} />
          <Field textarea label="Air Ticket" name="air_ticket_booking" defaultValue={editing?.air_ticket_booking ?? ""} />
          <Field full textarea label="Important Notes" name="important_notes" defaultValue={editing?.important_notes ?? ""} />
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
