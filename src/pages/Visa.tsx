import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import { SafeImage } from "@/components/site/SafeImage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { usePageTitle } from "@/lib/use-page-title";
import { api, type VisaCountry, type VisaRequirement } from "@/lib/api";

export default function Visa() {
  usePageTitle("Visa Services");
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [active, setActive] = useState<VisaCountry | null>(null);
  const [reqs, setReqs] = useState<VisaRequirement[]>([]);

  useEffect(() => {
    api.get<{ items: VisaCountry[] }>("/visa-countries").then(r => setCountries(r.items)).catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (!active) { setReqs([]); return; }
    api.get<{ items: VisaRequirement[] }>(`/visa-requirements?country_id=${active.id}`).then(r => setReqs(r.items)).catch(() => setReqs([]));
  }, [active]);

  return (
    <SiteLayout>
      <PageHero eyebrow="Visa" title="Visa Services" subtitle="Document checklists, processing time, fees — all in one place." />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {countries.map(c => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className={`group overflow-hidden rounded-2xl border bg-card text-left transition hover:-translate-y-1 hover:shadow-brand ${active?.id === c.id ? "border-primary" : "border-border"}`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                <SafeImage src={c.flag_url} alt={c.country_name} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{c.country_name}</h3>
                {c.short_description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.short_description}</p>}
              </div>
            </button>
          ))}
        </div>

        {active && (
          <div className="mt-12 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-2xl font-bold">{active.country_name} — Requirements</h2>
            {reqs.length === 0 ? (
              <p className="mt-3 text-muted-foreground">No requirements published yet for this country.</p>
            ) : (
              <div className="mt-5 grid gap-6">
                {reqs.map(r => (
                  <div key={r.id} className="rounded-xl border border-border p-4">
                    <h3 className="text-lg font-bold text-primary">{r.visa_type}</h3>
                    <dl className="mt-3 grid gap-3 md:grid-cols-2">
                      {([
                        ["Required Documents", r.required_documents],
                        ["Passport", r.passport_requirement],
                        ["Photo", r.photo_requirement],
                        ["NID / Birth Cert.", r.nid_or_birth_certificate],
                        ["Bank Statement", r.bank_statement],
                        ["Bank Solvency", r.bank_solvency],
                        ["Job Certificate", r.job_certificate],
                        ["Trade License", r.trade_license],
                        ["Hotel Booking", r.hotel_booking],
                        ["Air Ticket", r.air_ticket_booking],
                        ["Processing Time", r.processing_time],
                        ["Embassy Fee", r.embassy_fee],
                        ["Service Charge", r.service_charge],
                      ] as const).filter(([, v]) => v).map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-xs font-semibold uppercase text-muted-foreground">{k}</dt>
                          <dd className="mt-0.5 whitespace-pre-line text-sm">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    {r.important_notes && (
                      <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                        <strong>Note:</strong> {r.important_notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <InquiryForm sourcePage="visa" defaultServiceType="Tourist Visa" defaultDestination={active?.country_name} />
        </div>
      </section>
    </SiteLayout>
  );
}
