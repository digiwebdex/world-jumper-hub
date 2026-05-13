import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/motion";
import { SafeImage } from "@/components/site/SafeImage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { usePageTitle } from "@/lib/use-page-title";
import { api, type VisaCountry, type VisaRequirement } from "@/lib/api";

export default function VisaCountryDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const preferredType = searchParams.get("type") || "";

  const [country, setCountry] = useState<VisaCountry | null>(null);
  const [reqs, setReqs] = useState<VisaRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  usePageTitle(
    country ? `${country.country_name} Visa from Bangladesh` : "Visa Details",
    country?.short_description ||
      "Document checklist, embassy fee, processing time and requirements.",
  );

  // Load country by slug (find from active list)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    api
      .get<{ countries: VisaCountry[] }>("/visa-countries")
      .then((r) => {
        if (cancelled) return;
        const found = (r.countries || []).find((c) => c.slug === slug);
        if (!found) {
          setCountry(null);
          setNotFound(true);
        } else {
          setCountry(found);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Load requirements for that country
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

  // Sort: preferred type first
  const sortedReqs = useMemo(() => {
    if (!preferredType) return reqs;
    const lower = preferredType.toLowerCase();
    return [...reqs].sort((a, b) => {
      const aMatch = a.visa_type?.toLowerCase().includes(lower) ? -1 : 0;
      const bMatch = b.visa_type?.toLowerCase().includes(lower) ? -1 : 0;
      return aMatch - bMatch;
    });
  }, [reqs, preferredType]);

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
      {/* HERO */}
      <section className="relative overflow-hidden bg-[color:var(--ink-deep)] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,32,0.55)_0%,rgba(8,12,32,0.85)_100%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
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
                Visa from Bangladesh
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
          {preferredType && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              Showing: {preferredType}
            </p>
          )}
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        {sortedReqs.length === 0 ? (
          <div className="rounded-sm border border-border bg-card p-10 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
              Coming soon
            </p>
            <h2 className="mt-3 font-display text-3xl">
              Requirements not published yet
            </h2>
            <p className="mt-3 text-muted-foreground">
              Our consultants can share the full document checklist by call or WhatsApp.
              Submit the form below and we'll reach out within an hour.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {sortedReqs.map((r) => (
              <Reveal key={r.id}>
                <div className="rounded-sm border border-border bg-card p-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--brand-orange)]">
                    {r.visa_type}
                  </p>
                  <dl className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
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
                      .map(([k, v]) => (
                        <div key={k} className="border-t border-border/60 pt-4">
                          <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            {k}
                          </dt>
                          <dd className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
                            {v}
                          </dd>
                        </div>
                      ))}
                  </dl>
                  {r.important_notes && (
                    <div className="mt-6 rounded-sm border border-[color:var(--brand-orange)]/30 bg-[color:var(--brand-orange)]/[0.06] p-4 text-sm text-foreground">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--brand-orange)]">
                        Important
                      </p>
                      <p className="mt-2 whitespace-pre-line">{r.important_notes}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* INQUIRY */}
      <section className="bg-cream-deep py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <InquiryForm
            sourcePage={`visa-${country.slug}`}
            defaultServiceType={preferredType || "Tourist Visa"}
            defaultDestination={country.country_name}
          />
        </div>
      </section>
    </SiteLayout>
  );
}
