import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown, Map as MapIcon, Phone, FileCheck2, Search, Sparkles,
  Plane, Briefcase, HeartPulse, GraduationCap, BadgeCheck, Moon,
  Globe2, Clock, ShieldCheck, ArrowRight,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { InquiryForm } from "@/components/site/InquiryForm";
import { supabase, type VisaCountry, type VisaRequirement } from "@/lib/supabase";
import { SITE } from "@/lib/site-config";

import heroImg from "@/assets/hero-visa.jpg";

export const Route = createFileRoute("/visa")({
  component: VisaPage,
  head: () => ({
    meta: [
      { title: "Visa Services — World Jumper Tours & Travels" },
      { name: "description", content: "Visa processing for India, Thailand, Malaysia, UAE, Saudi Arabia, UK, USA, Canada, Schengen and more — Tourist, Business, Medical, Student, Work, Umrah." },
    ],
  }),
});

const VISA_TYPES = [
  { key: "Tourist",  icon: Plane,         label: "Tourist",  blurb: "Holiday & leisure travel",     gradient: "from-sky-500 to-cyan-400" },
  { key: "Business", icon: Briefcase,     label: "Business", blurb: "Meetings, trade, conferences", gradient: "from-indigo-500 to-violet-500" },
  { key: "Medical",  icon: HeartPulse,    label: "Medical",  blurb: "Treatment & medical tourism",  gradient: "from-rose-500 to-pink-500" },
  { key: "Student",  icon: GraduationCap, label: "Student",  blurb: "Study abroad pathways",        gradient: "from-emerald-500 to-teal-500" },
  { key: "Work",     icon: BadgeCheck,    label: "Work",     blurb: "Employment & job visas",       gradient: "from-amber-500 to-orange-500" },
  { key: "Umrah",    icon: Moon,          label: "Umrah",    blurb: "Sacred journey support",       gradient: "from-fuchsia-500 to-purple-500" },
];

const RELATED_SERVICES = [
  { to: "/air-ticketing",   icon: Plane,      title: "Air Ticketing",   desc: "Best fares worldwide" },
  { to: "/tours",           icon: Globe2,     title: "Tour Packages",   desc: "Curated holidays" },
  { to: "/medical-tourism", icon: HeartPulse, title: "Medical Tourism", desc: "Top hospitals abroad" },
  { to: "/umrah",           icon: Moon,       title: "Umrah Packages",  desc: "Faithful & affordable" },
];

function VisaPage() {
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [requirements, setRequirements] = useState<VisaRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("All");
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

  const reqByCountry = useMemo(() => {
    const map = new Map<string, VisaRequirement[]>();
    requirements.forEach((r) => {
      const arr = map.get(r.country_id) ?? [];
      arr.push(r);
      map.set(r.country_id, arr);
    });
    return map;
  }, [requirements]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return countries.filter((c) => {
      const matchesText = c.country_name.toLowerCase().includes(q);
      if (!matchesText) return false;
      if (activeType === "All") return true;
      const reqs = reqByCountry.get(c.id) ?? [];
      return reqs.some((r) => r.visa_type?.toLowerCase().includes(activeType.toLowerCase()));
    });
  }, [countries, search, activeType, reqByCountry]);

  return (
    <SiteLayout>
      {/* ============ HERO BANNER ============ */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <img src={heroImg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.05_260)/0.85] via-[oklch(0.22_0.08_255)/0.6] to-transparent" />
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-[color:var(--brand-orange)]/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
          <div className="animate-fade-in">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Visa Services
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] md:text-6xl">
              Your passport to <span className="text-gradient-brand bg-clip-text">100+ countries</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
              Tourist, Business, Medical, Student, Work & Umrah visas — handled end-to-end by experts who know every embassy by heart.
            </p>

            {/* Stat strip */}
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {[
                { n: "100+", l: "Countries" },
                { n: "98%",  l: "Approval" },
                { n: "10+",  l: "Years" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-white/15 bg-white/5 p-3 text-center backdrop-blur">
                  <div className="text-2xl font-bold">{s.n}</div>
                  <div className="text-[11px] uppercase tracking-wider text-white/70">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#countries" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-brand transition hover:scale-[1.02]">
                Browse countries <ArrowRight className="h-4 w-4" />
              </a>
              <WhatsAppButton message="Hello, I'd like to apply for a visa." className="!rounded-full !bg-[color:var(--brand-orange)] !px-5 !py-3">
                Talk to an expert
              </WhatsAppButton>
            </div>
          </div>

          {/* Hero search card */}
          <div className="relative animate-scale-in">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-white/30 to-transparent blur-2xl" />
            <div className="relative rounded-3xl border border-white/20 bg-white/95 p-6 text-foreground shadow-2xl backdrop-blur">
              <h2 className="text-lg font-bold">Find your destination</h2>
              <p className="mt-1 text-sm text-muted-foreground">Search any country to see visa types & fees.</p>
              <label className="mt-4 flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2.5 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Thailand, Schengen, UAE..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["India", "Thailand", "Malaysia", "UAE", "Schengen", "UK"].map((p) => (
                  <button key={p} onClick={() => setSearch(p)}
                    className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium hover:border-primary/40 hover:text-primary">
                    {p}
                  </button>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px]">
                <Trust icon={ShieldCheck} label="Trusted" />
                <Trust icon={Clock}        label="Fast turnaround" />
                <Trust icon={BadgeCheck}   label="Genuine fees" />
              </div>
            </div>
          </div>
        </div>

        {/* wave divider */}
        <svg className="block w-full text-background" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0,32 C240,80 480,80 720,48 C960,16 1200,16 1440,48 L1440,80 L0,80 Z" />
        </svg>
      </section>

      {/* ============ VISA TYPE BANNERS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Visa Categories</p>
            <h2 className="mt-1 text-2xl font-bold md:text-3xl">Pick the visa that matches your journey</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TypeCard
            active={activeType === "All"}
            onClick={() => setActiveType("All")}
            gradient="from-slate-700 to-slate-900"
            icon={Globe2} label="All Visas" blurb="Browse every destination"
          />
          {VISA_TYPES.map((t) => (
            <TypeCard key={t.key}
              active={activeType === t.key}
              onClick={() => { setActiveType(t.key); document.getElementById("countries")?.scrollIntoView({ behavior: "smooth" }); }}
              gradient={t.gradient}
              icon={t.icon} label={`${t.label} Visa`} blurb={t.blurb}
            />
          ))}
        </div>
      </section>

      {/* ============ COUNTRIES ============ */}
      <section id="countries" className="mx-auto max-w-7xl px-4 pb-12">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-gradient-to-r from-secondary to-background p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-brand">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold">Destinations</h3>
              <p className="text-xs text-muted-foreground">
                {activeType === "All" ? "Showing all visa types" : `Filtered by ${activeType}`} · {filtered.length} countries
              </p>
            </div>
          </div>
          <label className="flex w-full items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 md:max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl border border-border bg-muted/40" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">No countries match your filter.</p>
            <button onClick={() => { setSearch(""); setActiveType("All"); }}
              className="mt-3 text-sm font-semibold text-primary underline">Reset filters</button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((c) => {
              const reqs = reqByCountry.get(c.id) ?? [];
              const isOpen = openId === c.id;
              return (
                <article key={c.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-brand">
                  <div className="flex gap-4 p-4">
                    <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border">
                      {c.flag_url ? (
                        <img src={c.flag_url} alt={c.country_name} loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground"><MapIcon className="h-7 w-7" /></div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                        {c.country_name}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{c.country_name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.short_description}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {reqs.length > 0 ? (
                          reqs.map((r) => (
                            <span key={r.id}
                              className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent ring-1 ring-accent/20">
                              {r.visa_type}
                            </span>
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
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
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
                    <div className="animate-fade-in border-t border-border p-4">
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

      {/* ============ RELATED SERVICES BANNER ============ */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 text-white md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-[color:var(--brand-orange)]/30 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Travel further with us</p>
            <h2 className="mt-1 text-2xl font-bold md:text-4xl">Related services you might love</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/85 md:text-base">
              Visa is just the start. Pair it with flights, tours, medical care or Umrah — all under one trusted roof.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {RELATED_SERVICES.map(({ to, icon: Icon, title, desc }) => (
                <Link key={to} to={to}
                  className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/20">
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold">{title}</h3>
                  <p className="mt-1 text-xs text-white/80">{desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                    Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ INQUIRY ============ */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <InquiryForm sourcePage="visa" defaultServiceType="Tourist Visa"
          title="Apply for a visa" subtitle="Tell us your destination and we'll get back with the exact requirements & fees." />
      </section>
    </SiteLayout>
  );
}

function Trust({ icon: Icon, label }: { icon: typeof ShieldCheck; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/60 p-2">
      <Icon className="h-4 w-4 text-primary" />
      <span className="font-semibold text-foreground/80">{label}</span>
    </div>
  );
}

function TypeCard({
  icon: Icon, label, blurb, gradient, active, onClick,
}: {
  icon: typeof Plane; label: string; blurb: string; gradient: string;
  active?: boolean; onClick?: () => void;
}) {
  return (
    <button onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all hover:-translate-y-1 hover:shadow-brand ${
        active ? "border-primary ring-2 ring-primary/30" : "border-border"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl transition-transform group-hover:scale-125" />
      <div className="relative flex items-start gap-3 text-white">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30 backdrop-blur">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold">{label}</h3>
          <p className="mt-0.5 text-xs text-white/85">{blurb}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">
            View countries <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </button>
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
