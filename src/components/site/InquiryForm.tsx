import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
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
  subtitle = "Our travel experts will get back to you within 24 hours.",
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

    const { error } = await supabase.from("inquiries").insert(payload);
    setSubmitting(false);
    if (error) {
      setStatus({ ok: false, msg: "Could not submit. Please try again or call us directly." });
      return;
    }
    setStatus({ ok: true, msg: "Inquiry submitted! Our team will contact you soon." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      <h3 className="text-2xl font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
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
            <SelectInput
              name="service_type"
              label="Service Type"
              defaultValue={defaultServiceType ?? ""}
              options={SERVICE_TYPES}
            />
            <FormInput
              name="destination_country"
              label="Destination Country"
              placeholder="e.g. Thailand"
              defaultValue={defaultDestination}
            />
            <FormInput name="travel_date" label="Travel Date" type="date" />
          </>
        )}

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
          <textarea
            name="message"
            rows={4}
            placeholder="Tell us about your travel plan..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-brand transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Submitting..." : "Submit Inquiry"}
          </button>

          {status && (
            <div
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                status.ok
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
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
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}{required && <span className="text-destructive"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
    </div>
  );
}

function SelectInput({
  name, label, options, defaultValue,
}: { name: string; label: string; options: readonly string[]; defaultValue?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
