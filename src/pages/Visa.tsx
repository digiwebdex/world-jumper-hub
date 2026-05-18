import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, SectionHeading } from "@/components/site/ui";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/motion";
import { SafeImage } from "@/components/site/SafeImage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { useSeo } from "@/lib/use-seo";
import { api, type VisaCountry, type VisaRequirement } from "@/lib/api";
import { VISA_SERVICES } from "@/lib/visa-services";

export default function Visa() {
  useSeo("visa", {
    title: "Visa Services",
    description: "Tourist, business, medical and student visa processing for 30+ countries — full document checklists, embassy fees and processing times from World Jumper, Dhaka.",
    path: "/visa",
  });
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [active, setActive] = useState<VisaCountry | null>(null);
  const [reqs, setReqs] = useState<VisaRequirement[]>([]);

  useEffect(() => {
    api.get<{ items: VisaCountry[] }>("/visa-countries")
      .then(r => setCountries(r.items)).catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (!active) { setReqs([]); return; }
    api.get<{ items: VisaRequirement[] }>(`/visa-requirements?country_id=${active.id}`)
      .then(r => setReqs(r.items)).catch(() => setReqs([]));
  }, [active]);

  return (
    <SiteLayout>
      <PageHero
        kicker="Atlas"
        eyebrow="Visa Services"
        title={<>Stamps that open <em className="not-italic text-accent">continents</em>.</>}
        subtitle="Document checklists, embassy fees and processing times — for every destination we file."
        image="https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=2400&q=70"
      />

      <section className="mx-auto max-w-7xl px-6 pt-20 md:px-10 md:pt-24">
        <SectionHeading
          eyebrow="Services offered"
          title="Six visa services for Bangladeshi travellers."
        />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          From end-to-end consultancy to express 24-hour filing — pick the service that matches your journey, or call us for a personalised plan.
        </p>
        <StaggerGroup className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {VISA_SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <StaggerItem key={s.slug}>
                <Link
                  to={`/visa/services/${s.slug}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--brand-blue-deep)]/8 text-[color:var(--brand-blue-deep)] transition-colors group-hover:bg-[color:var(--brand-orange)]/10 group-hover:text-[color:var(--brand-orange)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        N° {s.number}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-xl leading-tight text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {s.summary}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-blue-deep)] transition-colors group-hover:text-[color:var(--brand-orange)]">
                    View service details <ArrowUpRight className="h-3 w-3" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
        <SectionHeading eyebrow="Choose a destination" title="Where would you like to go?" />
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {countries.map((c, i) => (
            <StaggerItem key={c.id}>
              <button
                onClick={() => { setActive(c); setTimeout(() => document.getElementById("req")?.scrollIntoView({ behavior: "smooth" }), 80); }}
                className={`group relative block w-full overflow-hidden rounded-sm bg-card text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-lift ${active?.id === c.id ? "ring-1 ring-accent" : ""}`}
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <SafeImage src={c.flag_url} alt={c.country_name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/70">N° {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 font-display text-2xl">{c.country_name}</h3>
                  {c.short_description && <p className="mt-1 line-clamp-2 text-xs text-cream/80">{c.short_description}</p>}
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {countries.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">Visa destinations are being curated. Please call us — we file for 30+ countries.</p>
        )}

        {active && (
          <div id="req" className="mt-20 border-t border-border pt-14">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">
                <span className="mr-3 inline-block h-px w-10 bg-accent align-middle" />Requirements
              </p>
              <h2 className="mt-3 font-display text-4xl md:text-6xl">{active.country_name}</h2>
            </Reveal>
            {reqs.length === 0 ? (
              <p className="mt-6 text-muted-foreground">No requirements published yet. Our consultants can share the file by call or email.</p>
            ) : (
              <div className="mt-10 space-y-10">
                {reqs.map(r => (
                  <Reveal key={r.id}>
                    <div className="rounded-sm border border-border bg-card p-8">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{r.visa_type} Visa</p>
                      <dl className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
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
                          <div key={k} className="border-t border-border/60 pt-4">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{k}</dt>
                            <dd className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      {r.important_notes && (
                        <div className="mt-6 rounded-sm border border-accent/30 bg-accent/[0.06] p-4 text-sm text-foreground">
                          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">Important</p>
                          <p className="mt-2 whitespace-pre-line">{r.important_notes}</p>
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="bg-cream-deep py-24 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <InquiryForm sourcePage="visa" defaultServiceType="Tourist Visa" defaultDestination={active?.country_name} />
        </div>
      </section>
    </SiteLayout>
  );
}
