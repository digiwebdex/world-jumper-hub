import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, Modal, PrimaryButton, GhostButton, Card } from "@/components/admin/form-bits";
import { supabase, type VisaCountry, type VisaRequirement } from "@/lib/supabase";

export const Route = createFileRoute("/admin/visa-requirements")({
  component: VisaReqAdmin,
  head: () => ({ meta: [{ title: "Visa Requirements — Admin" }] }),
});

const VISA_TYPES = ["Tourist", "Business", "Medical", "Student", "Umrah", "Work", "Other"] as const;

const FIELDS: { name: keyof VisaRequirement; label: string; textarea?: boolean }[] = [
  { name: "required_documents", label: "Required Documents (summary)", textarea: true },
  { name: "passport_requirement", label: "Passport" },
  { name: "photo_requirement", label: "Photo" },
  { name: "nid_or_birth_certificate", label: "NID / Birth Certificate" },
  { name: "bank_statement", label: "Bank Statement" },
  { name: "bank_solvency", label: "Bank Solvency" },
  { name: "job_certificate", label: "Job Certificate" },
  { name: "trade_license", label: "Trade License" },
  { name: "student_id", label: "Student ID" },
  { name: "invitation_letter", label: "Invitation Letter" },
  { name: "medical_documents", label: "Medical Documents" },
  { name: "hotel_booking", label: "Hotel Booking" },
  { name: "air_ticket_booking", label: "Air Ticket Booking" },
  { name: "travel_itinerary", label: "Travel Itinerary" },
  { name: "processing_time", label: "Processing Time" },
  { name: "embassy_fee", label: "Embassy Fee" },
  { name: "service_charge", label: "Service Charge" },
  { name: "eligibility_notes", label: "Eligibility Notes", textarea: true },
  { name: "important_notes", label: "Important Notes", textarea: true },
];

function VisaReqAdmin() {
  const [items, setItems] = useState<VisaRequirement[]>([]);
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [filterCountry, setFilterCountry] = useState("");
  const [editing, setEditing] = useState<VisaRequirement | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [r, c] = await Promise.all([
      supabase.from("visa_requirements").select("*").order("created_at", { ascending: false }),
      supabase.from("visa_countries").select("*").order("country_name"),
    ]);
    setItems((r.data as VisaRequirement[]) ?? []);
    setCountries((c.data as VisaCountry[]) ?? []);
  };
  useEffect(() => { void load(); }, []);

  const countryName = (id: string) => countries.find((c) => c.id === id)?.country_name ?? "—";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      country_id: String(fd.get("country_id") ?? ""),
      visa_type: String(fd.get("visa_type") ?? ""),
      is_active: fd.get("is_active") === "true",
    };
    FIELDS.forEach((f) => {
      const v = String(fd.get(f.name as string) ?? "").trim();
      payload[f.name as string] = v || null;
    });
    const op = editing
      ? supabase.from("visa_requirements").update(payload).eq("id", editing.id)
      : supabase.from("visa_requirements").insert(payload);
    const { error } = await op;
    setBusy(false);
    if (error) { alert(error.message); return; }
    setEditing(null); setCreating(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this requirement?")) return;
    const { error } = await supabase.from("visa_requirements").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    await load();
  };

  const filtered = filterCountry ? items.filter((i) => i.country_id === filterCountry) : items;
  const current = editing;

  return (
    <AdminShell title="Visa Requirements">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">All countries</option>
            {countries.map((c) => <option key={c.id} value={c.id}>{c.country_name}</option>)}
          </select>
          <PrimaryButton onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add requirement</PrimaryButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="py-2">Country</th><th>Visa Type</th><th>Processing</th><th>Active</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="py-2 font-semibold">{countryName(r.country_id)}</td>
                  <td><span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">{r.visa_type}</span></td>
                  <td className="text-muted-foreground">{r.processing_time ?? "—"}</td>
                  <td>{r.is_active ? <span className="text-green-600">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(r)} className="rounded-md border border-border p-1.5 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => void remove(r.id)} className="rounded-md border border-border p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">No requirements yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal wide open={creating || !!editing} onClose={() => { setEditing(null); setCreating(false); }}
        title={editing ? "Edit visa requirement" : "Add visa requirement"}>
        <form onSubmit={submit} className="grid max-h-[70vh] gap-4 overflow-y-auto pr-2 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground/80">Country *</label>
            <select name="country_id" required defaultValue={current?.country_id ?? ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select country...</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.country_name}</option>)}
            </select>
          </div>
          <Field label="Visa type" name="visa_type" required options={VISA_TYPES} defaultValue={current?.visa_type} />
          {FIELDS.map((f) => (
            <Field key={f.name as string} label={f.label} name={f.name as string} textarea={f.textarea}
              full={f.textarea} defaultValue={(current?.[f.name] as string | null) ?? ""} />
          ))}
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
