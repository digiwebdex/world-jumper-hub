import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FileCheck2,
  MapPin,
  Moon,
  Stethoscope,
  Plane,
  CheckCircle2,
  Phone,
  MessageCircle,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/motion";
import { SafeImage } from "@/components/site/SafeImage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { usePageTitle } from "@/lib/use-page-title";
import { api, type VisaCountry, type VisaRequirement } from "@/lib/api";
import { FALLBACK_COUNTRIES } from "@/lib/fallback-countries";
import { FALLBACK_REQUIREMENTS } from "@/lib/fallback-requirements";

type TabKey = "visa" | "tours" | "umrah" | "medical" | "airticket";

const TABS: { key: TabKey; label: string; icon: typeof FileCheck2 }[] = [
  { key: "visa", label: "Visa", icon: FileCheck2 },
  { key: "tours", label: "Tours", icon: MapPin },
  { key: "umrah", label: "Umrah", icon: Moon },
  { key: "medical", label: "Medical", icon: Stethoscope },
  { key: "airticket", label: "Air Ticket", icon: Plane },
];

export default function VisaCountryDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const preferredType = searchParams.get("type") || "";
  const tabParam = (searchParams.get("tab") as TabKey) || "visa";
  const [activeTab, setActiveTab] = useState<TabKey>(
    TABS.find((t) => t.key === tabParam) ? tabParam : "visa",
  );

  const [country, setCountry] = useState<VisaCountry | null>(null);
  const [reqs, setReqs] = useState<VisaRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  usePageTitle(
    country ? `${country.country_name} Visa from Bangladesh` : "Visa Details",
    country?.short_description ||
      "Document checklist, embassy fee, processing time and requirements.",
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    api
      .get<{ countries: VisaCountry[] }>("/visa-countries")
      .then((r) => {
        if (cancelled) return;
        const list = r.countries || [];
        let found = list.find((c) => c.slug === slug);
        if (!found) {
          found = FALLBACK_COUNTRIES.find((c) => c.slug === slug);
        }
        if (!found) {
          setCountry(null);
          setNotFound(true);
        } else {
          setCountry(found);
        }
      })
      .catch(() => {
        if (cancelled) return;
        const found = FALLBACK_COUNTRIES.find((c) => c.slug === slug);
        if (found) {
          setCountry(found);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!country) {
      setReqs([]);
      return;
    }
    api
      .get<{ requirements: VisaRequirement[] }>(
        `/visa-requirements?country_id=${country.id}`,
      )
      .then((r) => setReqs(r.requirements || []))
      .catch(() => setReqs([]));
  }, [country]);

  const sortedReqs = useMemo(() => {
    if (!preferredType) return reqs;
    const lower = preferredType.toLowerCase();
    return [...reqs].sort((a, b) => {
      const aMatch = a.visa_type?.toLowerCase().includes(lower) ? -1 : 0;
      const bMatch = b.visa_type?.toLowerCase().includes(lower) ? -1 : 0;
      return aMatch - bMatch;
    });
  }, [reqs, preferredType]);

  function switchTab(key: TabKey) {
    setActiveTab(key);
    const next = new URLSearchParams(searchParams);
    next.set("tab", key);
    setSearchParams(next, { replace: true });
  }

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-6 py-32 text-center">
          <p className="text-muted-foreground">Loading visa details…</p>
        </div>
      </SiteLayout>
    );
  }

  if (notFound || !country) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
            Not found
          </p>
          <h1 className="mt-3 font-display text-4xl">Country not available</h1>
          <p className="mt-3 text-muted-foreground">
            We couldn't find that destination. Browse all countries we file visas for.
          </p>
          <Link
            to="/visa"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-orange)] px-5 py-2.5 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All visa countries
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* TABS — top of page */}
      <section className="sticky top-0 z-30 border-b border-border bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 md:px-10">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => switchTab(t.key)}
                className={`relative flex shrink-0 items-center gap-2 px-4 py-4 text-sm font-bold transition ${
                  active
                    ? "text-[color:var(--brand-orange)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                {active && (
                  <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t bg-[color:var(--brand-orange)]" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[color:var(--ink-deep)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,40,0.18),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(40,90,200,0.25),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <Link
            to="/visa"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All visa destinations
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            {country.flag_url && (
              <SafeImage
                src={country.flag_url}
                alt={country.country_name}
                className="h-16 w-24 rounded-md object-cover ring-2 ring-white/30"
              />
            )}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[color:var(--brand-orange)]">
                Bangladesh → {country.country_name}
              </p>
              <h1 className="mt-2 font-display text-4xl font-extrabold md:text-6xl">
                {country.country_name}
              </h1>
            </div>
          </div>
          {country.short_description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {country.short_description}
            </p>
          )}

          {/* Quick stat strip */}
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Visa Types", String(reqs.length || "—")],
              ["Avg. Processing", reqs[0]?.processing_time?.split(/[,;\n]/)[0] || "7–15 days"],
              ["Embassy Fee", reqs[0]?.embassy_fee?.split(/[,;\n]/)[0] || "On request"],
              ["Service Charge", reqs[0]?.service_charge?.split(/[,;\n]/)[0] || "On request"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
                  {k}
                </p>
                <p className="mt-1 truncate text-sm font-bold">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TAB CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        {activeTab === "visa" && (
          <VisaTab reqs={sortedReqs} preferredType={preferredType} />
        )}
        {activeTab === "tours" && (
          <ServiceTab
            country={country.country_name}
            title="Tour Packages"
            tagline="Curated holidays with hotels, transfers and sightseeing."
            rows={[
              ["Package Style", "City Break · Family · Honeymoon · Group"],
              ["Duration", "3 to 12 nights, fully customisable"],
              ["Includes", "Hotel, airport transfer, sightseeing, SIM, guide"],
              ["Hotel Class", "3★ / 4★ / 5★ — your choice"],
              ["Group Size", "Solo, couple, family or group up to 30 pax"],
              ["Booking Lead Time", "7–10 days recommended"],
              ["Starting From", "Quote on request — depends on season & class"],
            ]}
            ctaLabel="Get Tour Quote"
          />
        )}
        {activeTab === "umrah" && (
          <ServiceTab
            country={country.country_name}
            title="Umrah Programs"
            tagline="Comfortable Umrah journeys with hand-picked hotels near Haram."
            rows={[
              ["Departure Months", "All year round (Economy / Ramadan / Hajj season)"],
              ["Duration", "10, 14 or 21 nights"],
              ["Hotel — Makkah", "Walking distance to Masjid Al-Haram"],
              ["Hotel — Madinah", "Walking distance to Masjid An-Nabawi"],
              ["Includes", "Visa, air ticket, hotel, ziyarah, transport, guide"],
              ["Group Size", "Family, group or VIP private packages"],
              ["Starting From", "Quote on request — economy & premium tiers"],
            ]}
            ctaLabel="Request Umrah Package"
          />
        )}
        {activeTab === "medical" && (
          <ServiceTab
            country={country.country_name}
            title="Medical Tourism"
            tagline="End-to-end coordination with trusted hospital partners."
            rows={[
              ["Top Specialties", "Cardiology · Oncology · Orthopaedic · Fertility · Cosmetic"],
              ["Hospital Partners", "Apollo, Fortis, Bumrungrad, Mount Elizabeth & more"],
              ["Visa Type", "Medical Visa + Attendant Visa supported"],
              ["Includes", "Doctor appointment, hospital booking, hotel, translator"],
              ["Documents", "Medical reports, prescription, doctor referral"],
              ["Pickup", "Airport pickup & ambulance arranged on request"],
              ["Starting From", "Free consultation — package quoted after diagnosis"],
            ]}
            ctaLabel="Get Medical Estimate"
          />
        )}
        {activeTab === "airticket" && (
          <ServiceTab
            country={country.country_name}
            title="Air Ticket"
            tagline="IATA-accredited fares from Dhaka & Chattogram on 50+ airlines."
            rows={[
              ["Trip Type", "One-way · Round-trip · Multi-city · Group"],
              ["Cabin Class", "Economy · Premium Economy · Business · First"],
              ["Airlines", "Emirates, Qatar, Turkish, Singapore, Biman, US-Bangla & more"],
              ["Baggage", "Up to 40kg available on selected fares"],
              ["Booking Lead Time", "Same-day issuance possible"],
              ["Refundable", "Refundable & flexible fares available"],
              ["Starting From", "Live fare on request — best price guaranteed"],
            ]}
            ctaLabel="Get Best Air Fare"
          />
        )}
      </section>

      {/* INQUIRY */}
      <section className="bg-cream-deep py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <InquiryForm
            sourcePage={`visa-${country.slug}-${activeTab}`}
            defaultServiceType={
              activeTab === "visa"
                ? preferredType || "Tourist Visa"
                : activeTab === "tours"
                  ? "Tour Package"
                  : activeTab === "umrah"
                    ? "Umrah Package"
                    : activeTab === "medical"
                      ? "Medical Tourism"
                      : "Air Ticket"
            }
            defaultDestination={country.country_name}
          />
        </div>
      </section>
    </SiteLayout>
  );
}

/* -------- Visa tab -------- */

function VisaTab({
  reqs,
  preferredType,
}: {
  reqs: VisaRequirement[];
  preferredType: string;
}) {
  if (reqs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
          Coming soon
        </p>
        <h2 className="mt-3 font-display text-3xl">
          Requirements not published yet
        </h2>
        <p className="mt-3 text-muted-foreground">
          Our consultants can share the full document checklist by call or WhatsApp.
          Submit the inquiry form below and we'll reach out within an hour.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {preferredType && (
        <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-orange)]/30 bg-[color:var(--brand-orange)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-orange)]">
          Highlighted: {preferredType}
        </p>
      )}
      {reqs.map((r) => (
        <Reveal key={r.id}>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border bg-[color:var(--cream)] px-6 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--brand-orange)]">
                  Visa Type
                </p>
                <h3 className="mt-1 font-display text-xl font-extrabold">
                  {r.visa_type}
                </h3>
              </div>
              {r.processing_time && (
                <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold text-foreground/80 shadow-sm md:inline-flex">
                  ⏱ {r.processing_time.split(/[,;\n]/)[0]}
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {(
                    [
                      ["Required Documents", r.required_documents],
                      ["Passport", r.passport_requirement],
                      ["Photo", r.photo_requirement],
                      ["NID / Birth Cert.", r.nid_or_birth_certificate],
                      ["Bank Statement", r.bank_statement],
                      ["Bank Solvency", r.bank_solvency],
                      ["Job Certificate", r.job_certificate],
                      ["Trade License", r.trade_license],
                      ["Student ID", r.student_id],
                      ["Invitation Letter", r.invitation_letter],
                      ["Medical Documents", r.medical_documents],
                      ["Hotel Booking", r.hotel_booking],
                      ["Air Ticket", r.air_ticket_booking],
                      ["Travel Itinerary", r.travel_itinerary],
                      ["Processing Time", r.processing_time],
                      ["Embassy Fee", r.embassy_fee],
                      ["Service Charge", r.service_charge],
                      ["Eligibility Notes", r.eligibility_notes],
                    ] as const
                  )
                    .filter(([, v]) => v)
                    .map(([k, v], idx) => (
                      <tr
                        key={k}
                        className={idx % 2 === 0 ? "bg-white" : "bg-[color:var(--cream)]/40"}
                      >
                        <td className="w-1/3 border-b border-border/60 px-6 py-3 align-top font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {k}
                        </td>
                        <td className="border-b border-border/60 px-6 py-3 align-top text-sm leading-relaxed text-foreground">
                          <span className="whitespace-pre-line">{v}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {r.important_notes && (
              <div className="border-t border-[color:var(--brand-orange)]/30 bg-[color:var(--brand-orange)]/[0.06] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--brand-orange)]">
                  Important
                </p>
                <p className="mt-2 whitespace-pre-line text-sm">{r.important_notes}</p>
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* -------- Generic service tab (Tours / Umrah / Medical / Airticket) -------- */

function ServiceTab({
  country,
  title,
  tagline,
  rows,
  ctaLabel,
}: {
  country: string;
  title: string;
  tagline: string;
  rows: [string, string][];
  ctaLabel: string;
}) {
  return (
    <Reveal>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-[color:var(--cream)] px-6 py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--brand-orange)]">
              {country}
            </p>
            <h3 className="mt-1 font-display text-2xl font-extrabold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {rows.map(([k, v], idx) => (
                <tr
                  key={k}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[color:var(--cream)]/40"}
                >
                  <td className="w-1/3 border-b border-border/60 px-6 py-3 align-top font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {k}
                  </td>
                  <td className="border-b border-border/60 px-6 py-3 align-top text-sm leading-relaxed text-foreground">
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-[color:var(--brand-blue-deep)] to-[color:var(--ink-deep)] p-6 text-white">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
              Why World Jumper
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                "Govt. approved · License 0013423",
                "IATA, ATAB, TOAB members",
                "Real consultants — no chatbots",
                "Transparent pricing, no hidden fee",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-orange)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="tel:+8801687072001"
            className="flex items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand-orange)] px-5 py-4 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
          >
            <Phone className="h-4 w-4" /> Call: 01687-072001
          </a>
          <a
            href="https://wa.me/8801687072001"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-4 text-sm font-bold text-foreground transition hover:border-[color:var(--brand-orange)]"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp · {ctaLabel}
          </a>
        </aside>
      </div>
    </Reveal>
  );
}
