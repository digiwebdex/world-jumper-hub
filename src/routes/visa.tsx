import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Map, Phone, FileCheck2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { InquiryForm } from "@/components/site/InquiryForm";
import { supabase, type VisaCountry, type VisaRequirement } from "@/lib/supabase";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/visa")({
  component: VisaPage,
  head: () => ({
    meta: [
      { title: "Visa Services — World Jumper Tours & Travels" },
      { name: "description", content: "Visa processing for India, Thailand, Malaysia, UAE, Saudi Arabia, UK, USA, Canada, Schengen and more — Tourist, Business, Medical, Student, Work, Umrah." },
    ],
  }),
});

function VisaPage() {
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [requirements, setRequirements] = useState<VisaRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const [c, r] = await Promise.all([
        supabase.from("visa_countries").select("*").eq("is_active", true).order("country_name"),
        supabase.from("visa_requirements").select("*").eq("is_active", true),
      ]);
      setCountries((c.data as VisaCountry[]) ?? []);
      setRequirements((r.data as VisaRequirement[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(
    () => countries.filter((c) => c.country_name.toLowerCase().includes(search.toLowerCase())),
    [countries, search]
  );

  const reqByCountry = useMemo(() => {
    const map = new Map<string, VisaRequirement[]>();
    requirements.forEach((r) => {
      const arr = map.get(r.country_id) ?? [];
      arr.push(r);
      map.set(r.country_id, arr);
    });
    return map;
  }, [requirements]);

  return (
    <SiteLayout>
      <PageHero eyebrow="Visa Services"
        title="Visa processing for 100+ countries"
        subtitle="Tourist, Business, Medical, Student, Work & Umrah visa support — handled end-to-end." />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country..."
            className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 md:max-w-sm"
          />
          <p className="text-sm text-muted-foreground">{filtered.length} countries</p>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading visa data...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No countries found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((c) => {
              const reqs = reqByCountry.get(c.id) ?? [];
              const isOpen = openId === c.id;
              return (
                <article key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="flex gap-4 p-4">
                    <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {c.flag_url ? (
                        <img src={c.flag_url} alt={c.country_name} loading="lazy" className="h-full w-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground"><Map className="h-7 w-7" /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{c.country_name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.short_description}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {reqs.length > 0 ? (
                          reqs.map((r) => (
                            <span key={r.id} className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">{r.visa_type}</span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Contact us for details</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 border-t border-border bg-muted/30 px-4 py-3">
                    <button
                      onClick={() => setOpenId(isOpen ? null : c.id)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      {isOpen ? "Hide details" : "View details"}
                    </button>
                    <WhatsAppButton message={`Hello World Jumper, I want ${c.country_name} visa info.`} className="!px-3 !py-1.5 !text-xs">WhatsApp</WhatsAppButton>
                    <a href={`tel:${SITE.primaryPhone}`} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:border-primary/40">
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                  </div>
                  {isOpen && (
                    <div className="border-t border-border p-4">
                      {reqs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Detailed requirements coming soon. Please contact us — we'll guide you through every document.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {reqs.map((r) => <RequirementBlock key={r.id} r={r} />)}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <InquiryForm sourcePage="visa" defaultServiceType="Tourist Visa"
          title="Apply for a visa" subtitle="Tell us your destination and we'll get back with the exact requirements & fees." />
      </section>
    </SiteLayout>
  );
}

function RequirementBlock({ r }: { r: VisaRequirement }) {
  const fields: [string, string | null][] = [
    ["Required Documents", r.required_documents],
    ["Passport", r.passport_requirement],
    ["Photo", r.photo_requirement],
    ["NID / Birth Certificate", r.nid_or_birth_certificate],
    ["Bank Statement", r.bank_statement],
    ["Bank Solvency", r.bank_solvency],
    ["Job Certificate", r.job_certificate],
    ["Trade License", r.trade_license],
    ["Student ID", r.student_id],
    ["Invitation Letter", r.invitation_letter],
    ["Medical Documents", r.medical_documents],
    ["Hotel Booking", r.hotel_booking],
    ["Air Ticket Booking", r.air_ticket_booking],
    ["Travel Itinerary", r.travel_itinerary],
    ["Processing Time", r.processing_time],
    ["Embassy Fee", r.embassy_fee],
    ["Service Charge", r.service_charge],
    ["Eligibility Notes", r.eligibility_notes],
    ["Important Notes", r.important_notes],
  ];
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h4 className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-primary">
        <FileCheck2 className="h-4 w-4" /> {r.visa_type} Visa
      </h4>
      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {fields.filter(([, v]) => v && v.trim()).map(([k, v]) => (
          <div key={k} className="text-sm">
            <dt className="font-semibold text-foreground">{k}</dt>
            <dd className="text-muted-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
