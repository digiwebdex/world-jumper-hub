import { useState } from "react";
import { z } from "zod";
import { api } from "@/lib/api";
import { whatsappLink } from "@/lib/site-config";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const SERVICE_TYPES = [
  "Air Ticket", "Tourist Visa", "Business Visa", "Medical Visa",
  "Tour Package", "Medical Tourism", "Umrah", "Other",
] as const;

const baseSchema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(120),
  mobile_number: z.string().trim().min(7, "Valid mobile required").max(30),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
});

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: readonly string[];
  full?: boolean;
}

const baseFields: Field[] = [
  { name: "full_name", label: "Full Name", required: true, placeholder: "Your full name" },
  { name: "mobile_number", label: "Mobile Number", required: true, placeholder: "01XXXXXXXXX" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
];

export interface InquiryFormProps {
  sourcePage: string;
  defaultServiceType?: string;
  defaultDestination?: string;
  variant?: "general" | "air-ticket";
  title?: string;
  subtitle?: string;
}

export function InquiryForm({
  sourcePage,
  defaultServiceType,
  defaultDestination,
  variant = "general",
  title = "Send us an inquiry",
  subtitle = "A consultant will respond within 24 hours.",
}: InquiryFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;

    const parsed = baseSchema.safeParse(raw);
    if (!parsed.success) {
      setSubmitting(false);
      setStatus({ ok: false, msg: parsed.error.issues[0].message });
      return;
    }

    const payload = {
      full_name: raw.full_name?.trim(),
      mobile_number: raw.mobile_number?.trim(),
      email: raw.email?.trim() || null,
      service_type: raw.service_type || defaultServiceType || null,
      destination_country: raw.destination_country?.trim() || defaultDestination || null,
      journey_from: raw.journey_from?.trim() || null,
      journey_to: raw.journey_to?.trim() || null,
      departure_date: raw.departure_date || null,
      return_date: raw.return_date || null,
      travel_date: raw.travel_date || null,
      passengers: raw.passengers?.trim() || null,
      message: raw.message?.trim() || null,
      source_page: sourcePage,
      status: "New",
    };

    // Best-effort: try to persist to backend, but never block the WhatsApp handoff.
    try {
      await api.post("/inquiries", payload);
    } catch (err) {
      console.warn("Inquiry API save failed (continuing to WhatsApp):", err);
    }

    // Build WhatsApp message with inquiry details and open chat with company number
    const lines = [
      "*New Inquiry — World Jumper website*",
      `From page: ${sourcePage}`,
      "",
      `*Name:* ${payload.full_name}`,
      `*Mobile:* ${payload.mobile_number}`,
      payload.email ? `*Email:* ${payload.email}` : null,
      payload.service_type ? `*Service:* ${payload.service_type}` : null,
      payload.destination_country ? `*Destination:* ${payload.destination_country}` : null,
      payload.journey_from ? `*From:* ${payload.journey_from}` : null,
      payload.journey_to ? `*To:* ${payload.journey_to}` : null,
      payload.departure_date ? `*Departure:* ${payload.departure_date}` : null,
      payload.return_date ? `*Return:* ${payload.return_date}` : null,
      payload.travel_date ? `*Travel date:* ${payload.travel_date}` : null,
      payload.passengers ? `*Passengers:* ${payload.passengers}` : null,
      payload.message ? `\n*Message:*\n${payload.message}` : null,
    ].filter(Boolean).join("\n");

    const waUrl = whatsappLink(lines);
    let opened: Window | null = null;
    try {
      opened = window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch {
      opened = null;
    }
    // Popup-blocked fallback — navigate the current tab so the user still reaches WhatsApp.
    if (!opened) {
      window.location.href = waUrl;
    }

    setSubmitting(false);
    setStatus({ ok: true, msg: "Opening WhatsApp to send your details…" });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="rounded-sm border border-border bg-card p-7 shadow-soft md:p-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
        <span className="mr-3 inline-block h-px w-8 bg-accent align-middle" />Form
      </p>
      <h3 className="mt-3 font-display text-3xl leading-tight text-foreground md:text-4xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
        {baseFields.map((f) => (
          <FormInput key={f.name} {...f} />
        ))}

        {variant === "air-ticket" ? (
          <>
            <FormInput name="journey_from" label="Journey From" placeholder="Dhaka" />
            <FormInput name="journey_to" label="Destination" placeholder="Dubai" />
            <FormInput name="departure_date" label="Departure Date" type="date" />
            <FormInput name="return_date" label="Return Date" type="date" />
            <FormInput name="passengers" label="Passengers" placeholder="2 Adults, 1 Child" />
          </>
        ) : (
          <>
            <SelectInput name="service_type" label="Service Type" defaultValue={defaultServiceType ?? ""} options={SERVICE_TYPES} />
            <FormInput name="destination_country" label="Destination Country" placeholder="e.g. Thailand" defaultValue={defaultDestination} />
            <FormInput name="travel_date" label="Travel Date" type="date" />
          </>
        )}

        <div className="md:col-span-2">
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Message</label>
          <textarea
            name="message"
            rows={4}
            placeholder="Tell us about your travel plan…"
            className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] text-background transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Sending…" : "Submit Inquiry"}
            {!submitting && <span className="transition-transform group-hover:translate-x-1">→</span>}
          </button>

          {status && (
            <div className={`inline-flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] ${status.ok ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`}>
              {status.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {status.msg}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function FormInput({
  name, label, type = "text", placeholder, required, defaultValue,
}: Field & { defaultValue?: string }) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}{required && <span className="text-accent"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}

function SelectInput({
  name, label, options, defaultValue,
}: { name: string; label: string; options: readonly string[]; defaultValue?: string }) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
