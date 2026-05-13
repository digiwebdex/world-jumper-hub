import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Plane, Stamp, MapPin, Stethoscope, Moon, Ticket, ArrowRight, ArrowUpRight, Star,
  ShieldCheck, Clock, HeartHandshake, Globe2, Sparkles, FileCheck2, Send, PhoneCall, Search,
  ChevronLeft, ChevronRight, Play,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServiceCard, SectionHeading, FancyIcon } from "@/components/site/ui";
import { Reveal, StaggerGroup, StaggerItem, CountUp } from "@/components/site/motion";
import { SafeImage } from "@/components/site/SafeImage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { api, type Package, type VisaCountry } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE, whatsappLink } from "@/lib/site-config";

const SERVICES = [
  { icon: Stamp, title: "Visa Services", description: "Tourist, business, medical & student visas processed for 30+ countries with full documentation support.", to: "/visa", accent: "orange" as const },
  { icon: MapPin, title: "Tour Packages", description: "Hand-curated international holidays across Asia, Europe, Middle East and beyond.", to: "/tours", accent: "blue" as const },
  { icon: Plane, title: "Air Ticketing", description: "IATA-approved fares from 50+ airlines — competitive prices, instant confirmation.", to: "/air-ticketing", accent: "deep" as const },
  { icon: Stethoscope, title: "Medical Tourism", description: "Trusted hospital partnerships in India, Thailand, Singapore and Malaysia.", to: "/medical-tourism", accent: "sand" as const },
  { icon: Moon, title: "Umrah Programs", description: "Comfortable Umrah packages all year round with hand-picked hotels in Makkah & Madinah.", to: "/umrah", accent: "orange" as const },
  { icon: Ticket, title: "Bespoke Itineraries", description: "Custom-designed journeys tailored entirely around your timeline and taste.", to: "/contact", accent: "blue" as const },
];

const TESTIMONIALS = [
  { name: "Rashed Hossain", trip: "Dubai · Family Holiday", quote: "From visa to hotel — every detail was effortless. We just packed and flew." },
  { name: "Nusrat Jahan", trip: "Umrah · 2024", quote: "The team treated my parents like their own. The hotel near Haram was perfect." },
  { name: "Tanvir Ahmed", trip: "Bangkok · Medical", quote: "World Jumper coordinated the hospital, hotel and translator. Truly stress-free." },
];

const DESTINATIONS = [
  { name: "Maldives",  tag: "Island Escape",   img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2400&q=70" },
  { name: "Dubai",     tag: "City of Gold",    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=70" },
  { name: "Makkah",    tag: "Umrah & Hajj",    img: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=2400&q=70" },
  { name: "Bangkok",   tag: "Medical & Tour",  img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=2400&q=70" },
  { name: "Switzerland", tag: "Alps & Lakes",  img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2400&q=70" },
];

const QUICK_TABS = [
  { key: "visa",     label: "Visa",     icon: Stamp,       to: "/visa",            placeholder: "Search country (e.g. Schengen)" },
  { key: "tour",     label: "Tours",    icon: MapPin,      to: "/tours",           placeholder: "Search destination (e.g. Bali)" },
  { key: "air",      label: "Air",      icon: Plane,       to: "/air-ticketing",   placeholder: "From DAC to ..." },
  { key: "umrah",    label: "Umrah",    icon: Moon,        to: "/umrah",           placeholder: "Choose Umrah package" },
  { key: "medical",  label: "Medical",  icon: Stethoscope, to: "/medical-tourism", placeholder: "Hospital or city" },
] as const;

export default function Home() {
  usePageTitle(
    "World Jumper Tours & Travels — Jump into the World",
    "Govt. approved travel agency in Bangladesh (License 0013423). Visa processing for 30+ countries, curated tour packages, air tickets, Umrah programs and medical tourism — plan your trip in 30 seconds."
  );
  const [pkgs, setPkgs] = useState<Package[]>([]);
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [destIndex, setDestIndex] = useState(0);
  const [tab, setTab] = useState<typeof QUICK_TABS[number]["key"]>("visa");
  const [query, setQuery] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const bgX = useTransform(sx, [-1, 1], ["-2.5%", "2.5%"]);
  const bgY = useTransform(sy, [-1, 1], ["-2.5%", "2.5%"]);
  const blobX = useTransform(sx, [-1, 1], ["-30px", "30px"]);
  const blobY = useTransform(sy, [-1, 1], ["-30px", "30px"]);

  function onMouseMove(e: React.MouseEvent) {
    const r = heroRef.current?.getBoundingClientRect(); if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top)  / r.height) * 2 - 1);
  }

  // Auto-rotate destinations
  useEffect(() => {
    const id = setInterval(() => setDestIndex(i => (i + 1) % DESTINATIONS.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    api.get<{ items: Package[] }>("/packages?featured=1").then(r => setPkgs(r.items)).catch(() => setPkgs([]));
    api.get<{ items: VisaCountry[] }>("/visa-countries?featured=1").then(r => setCountries(r.items)).catch(() => setCountries([]));
  }, []);

  const activeDest = DESTINATIONS[destIndex];
  const activeTab = QUICK_TABS.find(t => t.key === tab)!;

  return (
    <SiteLayout>
      {/* HERO — interactive: rotating destinations + mouse parallax + tabbed search */}
      <section
        ref={heroRef}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
        className="relative isolate overflow-hidden bg-[color:var(--ink-deep)] text-white"
      >
        {/* Crossfading destination backgrounds with mouse parallax */}
        <motion.div className="absolute inset-0" style={{ x: bgX, y: bgY, scale: 1.06 }}>
          <AnimatePresence mode="sync">
            <motion.img
              key={activeDest.img}
              src={activeDest.img}
              alt={activeDest.name}
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1.04 }}
              exit={{ opacity: 0, scale: 1.0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </motion.div>

        {/* Cinematic dark wash — keeps imagery vivid, adds legibility */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,32,0.55)_0%,rgba(8,12,32,0.25)_35%,rgba(8,12,32,0.85)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,12,32,0.75)_0%,rgba(8,12,32,0.35)_45%,rgba(8,12,32,0)_75%)]" />
        {/* Subtle brand accent (very low opacity, no multiply) */}
        <motion.div style={{ x: blobX, y: blobY }} className="absolute -left-32 top-20 h-[26rem] w-[26rem] rounded-full bg-[color:var(--brand-orange)]/25 blur-[120px] animate-float" />
        <motion.div style={{ x: blobX, y: blobY }} className="absolute -right-20 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[color:var(--brand-blue)]/30 blur-[140px] animate-float" />
        {/* Film grain / vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-28 pt-32 md:grid-cols-12 md:px-10 md:pb-36 md:pt-40">
          {/* LEFT — copy */}
          <div className="md:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-orange)] animate-pulse" />
              Govt. Approved · License No. {SITE.licenseNo}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-6 font-display text-5xl font-extrabold leading-[1.02] md:text-6xl lg:text-7xl"
            >
              Jump into{" "}
              <span className="relative inline-block min-w-[6ch] align-baseline overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeDest.name}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(95deg, #FFD8A8, #BFE3FF)" }}
                  >
                    {activeDest.name}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />with World Jumper.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/90 md:text-lg"
            >
              Your trusted travel partner in Bangladesh for visas, curated tours,
              air tickets, Umrah and medical journeys. Real consultants, transparent
              pricing, care from booking to homecoming.
            </motion.p>

            {/* Destination chips — click to switch hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-7 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-white/60">Trending →</span>
              {DESTINATIONS.map((d, i) => (
                <button
                  key={d.name}
                  onClick={() => setDestIndex(i)}
                  className={`group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                    i === destIndex
                      ? "border-[color:var(--brand-orange)] bg-[color:var(--brand-orange)] text-white shadow-brand"
                      : "border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/20"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${i === destIndex ? "bg-white" : "bg-white/60"}`} />
                  {d.name}
                </button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[color:var(--brand-blue-deep)] shadow-lift transition-all hover:-translate-y-0.5 hover:bg-[color:var(--brand-orange)] hover:text-white"
              >
                Plan my trip
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={whatsappLink()}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-white hover:bg-white/10"
              >
                <Send className="h-4 w-4" /> WhatsApp us
              </a>
            </motion.div>

            {/* Hero progress dots */}
            <div className="mt-10 flex items-center gap-3">
              <button
                aria-label="Previous"
                onClick={() => setDestIndex(i => (i - 1 + DESTINATIONS.length) % DESTINATIONS.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex flex-1 items-center gap-1.5 max-w-xs">
                {DESTINATIONS.map((_, i) => (
                  <div key={i} className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                    {i === destIndex && (
                      <motion.div
                        key={`bar-${destIndex}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[color:var(--brand-orange)] to-white"
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                aria-label="Next"
                onClick={() => setDestIndex(i => (i + 1) % DESTINATIONS.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="ml-2 font-mono text-xs text-white/70">
                {String(destIndex + 1).padStart(2, "0")}<span className="text-white/40"> / {String(DESTINATIONS.length).padStart(2, "0")}</span>
              </span>
            </div>
          </div>

          {/* RIGHT — interactive tabbed quick-search card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="md:col-span-5"
          >
            <VisaSearchCard />

            {/* Live activity strip */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-[11px] backdrop-blur-md">
              <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                12 inquiries today
              </span>
              <a href={`tel:${SITE.primaryPhone}`} className="inline-flex items-center gap-1 font-semibold text-white hover:text-[color:var(--brand-orange)]">
                <PhoneCall className="h-3 w-3" /> {SITE.primaryPhone}
              </a>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand-orange)]" />
              Now showing{" "}
              <span className="font-bold text-white">{activeDest.name}</span>
              <span>· {activeDest.tag}</span>
            </div>
          </motion.div>
        </div>

        {/* Member strip */}
        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-white/70 md:px-10">
            <span className="text-white">Member of</span>
            {SITE.memberships.slice(0, 6).map(m => (
              <span key={m} className="rounded-md bg-white/10 px-2.5 py-1 backdrop-blur-md transition hover:bg-white/20">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative -mt-10 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="grid gap-px overflow-hidden rounded-3xl bg-border shadow-lift sm:grid-cols-2 md:grid-cols-4">
              {[
                { n: 10000, s: "+", l: "Travelers Served" },
                { n: 30, s: "+", l: "Countries Covered" },
                { n: 50, s: "+", l: "Airline Partners" },
                { n: 12, s: " yrs", l: "Of Experience" },
              ].map(({ n, s, l }) => (
                <div key={l} className="bg-card px-6 py-7 text-center md:px-8 md:py-9">
                  <p className="font-display text-4xl font-extrabold text-[color:var(--brand-blue-deep)] md:text-5xl">
                    <CountUp to={n} suffix={s} />
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="What We Offer"
              title={<>Everything you need for <span className="text-gradient-brand">a perfect trip</span>.</>}
              intro="Six travel services under one trusted Bangladeshi roof."
            />
            <Reveal delay={0.15}>
              <Link to="/about" className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--brand-blue-deep)] hover:text-[color:var(--brand-orange)]">
                Our story <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(s => (
              <StaggerItem key={s.title}><ServiceCard {...s} /></StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative overflow-hidden bg-gradient-warm py-24 md:py-32">
        <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-[color:var(--brand-orange)]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[color:var(--brand-blue)]/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeading
            align="center"
            eyebrow="Why World Jumper"
            title={<>Six promises behind <span className="text-gradient-brand">every journey</span>.</>}
            intro="A 12-year-old travel house staffed by real consultants who answer the phone, walk you through your visa file, and stand by you long after departure."
          />
          <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ShieldCheck,    accent: "orange" as const, title: "Govt. Approved",       body: "Fully licensed by Bangladesh Tourism Board. CAAB · IATA · ATAB · TOAB member." },
              { icon: HeartHandshake, accent: "blue"   as const, title: "Human Consultants",     body: "A real person handles your file end-to-end — no chatbots, no scripts." },
              { icon: Clock,          accent: "deep"   as const, title: "On-Time Processing",    body: "Transparent visa timelines, ticket confirmations and reminders so you never miss a deadline." },
              { icon: Globe2,         accent: "sand"   as const, title: "30+ Destinations",      body: "Visa, hotel and ground support across Asia, Europe, Middle East, USA, UK & Schengen." },
              { icon: Sparkles,       accent: "orange" as const, title: "Curated, Not Generic",  body: "Itineraries hand-built for your taste, budget and travel style." },
              { icon: ShieldCheck,    accent: "blue"   as const, title: "After-Trip Care",       body: "24/7 emergency support while you're abroad. We answer when others don't." },
            ].map(({ icon: I, accent, title, body }) => (
              <StaggerItem key={title}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/80 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[color:var(--brand-orange)]/40 hover:shadow-lift">
                  <FancyIcon icon={I} accent={accent} />
                  <h3 className="mt-6 font-display text-xl font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Visa Atlas"
            title={<>Stamps that <span className="text-gradient-brand">open continents</span>.</>}
            intro="From Istanbul bazaars to Swiss alpine spas — full document checklists, processing times and embassy fees."
          />
          <Reveal delay={0.15}>
            <Link to="/visa" className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--brand-blue-deep)] hover:text-[color:var(--brand-orange)]">
              Browse all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(countries.length ? countries : Array.from({ length: 4 }).map((_, i) => ({
            id: `f${i}`, country_name: ["Thailand", "Malaysia", "Türkiye", "Dubai"][i],
            slug: ["thailand", "malaysia", "turkey", "dubai"][i],
            flag_url: [
              "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=70",
              "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=900&q=70",
              "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=70",
              "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=70",
            ][i],
            short_description: "On-arrival processing & full document support.", is_featured: true, is_active: true,
          } as VisaCountry))).slice(0, 8).map((c) => (
            <StaggerItem key={c.id}>
              <Link to={`/visa#${c.slug}`} className="group relative block overflow-hidden rounded-2xl bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <SafeImage src={c.flag_url} alt={c.country_name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink-deep)]/90 via-[color:var(--ink-deep)]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-display text-xl font-bold">{c.country_name}</h3>
                  {c.short_description && <p className="mt-1 line-clamp-2 text-xs text-white/80">{c.short_description}</p>}
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[color:#FFD8A8]">
                    Apply now <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative bg-card py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeading
            align="center"
            eyebrow="How It Works"
            title={<>Four simple steps from <span className="text-gradient-brand">dream to departure</span>.</>}
          />
          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-[42px] hidden h-px bg-gradient-to-r from-transparent via-[color:var(--brand-orange)]/40 to-transparent md:block" />
            <StaggerGroup className="grid gap-10 md:grid-cols-4">
              {[
                { icon: PhoneCall, title: "Tell us your dream", body: "Call, WhatsApp or fill the form. Share where, when and how you want to travel." },
                { icon: FileCheck2, title: "Get a tailored quote", body: "Within 24h we send a custom itinerary with visa, hotels, flights and total cost." },
                { icon: Stamp, title: "We handle the paperwork", body: "Visa, embassy, insurance, tickets — every document, end-to-end." },
                { icon: Plane, title: "Pack and fly", body: "You receive a full travel pack and a 24/7 helpline for the entire journey." },
              ].map(({ icon: I, title, body }, i) => (
                <StaggerItem key={title}>
                  <div className="relative text-center">
                    <div className="relative mx-auto inline-flex h-[84px] w-[84px] items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-brand p-[3px]">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
                          <I className="h-7 w-7 text-[color:var(--brand-blue-deep)]" strokeWidth={2} />
                        </div>
                      </div>
                      <span className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-xs font-extrabold text-white shadow-brand">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-lg font-bold text-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeading
          eyebrow="Featured Journeys"
          title={<>Trips worth <span className="text-gradient-brand">circling on the calendar</span>.</>}
        />
        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(pkgs.length ? pkgs : Array.from({ length: 3 }).map((_, i) => ({
            id: `f${i}`, title: ["Phuket Island Escape", "Cappadocia & Istanbul", "Maldives Overwater"][i],
            slug: "", package_type: "Tour" as const,
            destination: ["Thailand", "Türkiye", "Maldives"][i],
            duration: ["5N / 6D", "7N / 8D", "4N / 5D"][i],
            price: ["৳ 64,500", "৳ 1,28,000", "৳ 1,75,000"][i],
            short_description: "Hand-curated itinerary with vetted hotels and private transfers.",
            full_description: null, included_services: null, excluded_services: null,
            image_url: [
              "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=1200&q=70",
              "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1200&q=70",
              "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=70",
            ][i],
            gallery_urls: null, brochure_url: null, is_featured: true, is_active: true,
          } as Package))).slice(0, 6).map(p => (
            <StaggerItem key={p.id}>
              <Link to="/tours" className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <SafeImage src={p.image_url} alt={p.title} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[color:var(--ink-deep)]/70 to-transparent" />
                  {p.price && (
                    <div className="absolute right-4 top-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-extrabold text-[color:var(--brand-blue-deep)] shadow-brand">
                      {p.price}
                    </div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-gradient-brand px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    {p.package_type}{p.destination ? ` · ${p.destination}` : ""}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold leading-tight text-foreground">{p.title}</h3>
                  {p.short_description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.short_description}</p>}
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
                    {p.duration && <span>{p.duration}</span>}
                    <span className="inline-flex items-center gap-1 text-[color:var(--brand-blue-deep)] group-hover:text-[color:var(--brand-orange)]">
                      View details <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* TRAVEL INSPIRATION — Bento mosaic */}
      <section className="relative bg-card py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeading
            eyebrow="Travel Inspiration"
            title={<>A world that <span className="text-gradient-brand">never sleeps</span>.</>}
            intro="Snapshots from the journeys we've built — from quiet mountain mornings to neon city nights."
          />
          <Reveal className="mt-12">
            <div className="grid grid-cols-4 grid-rows-2 gap-3 md:gap-4 h-[420px] md:h-[560px]">
              {[
                { src: "https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?auto=format&fit=crop&w=1400&q=70", label: "Maldives", tag: "Beach", span: "col-span-2 row-span-2" },
                { src: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=900&q=70", label: "Dubai",    tag: "City",  span: "col-span-2 row-span-1" },
                { src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=900&q=70", label: "Makkah",   tag: "Umrah", span: "col-span-1 row-span-1" },
                { src: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=70", label: "Alps",     tag: "Nature", span: "col-span-1 row-span-1" },
              ].map(p => (
                <Link
                  key={p.label}
                  to="/tours"
                  className={`group relative overflow-hidden rounded-2xl ${p.span}`}
                >
                  <SafeImage src={p.src} alt={p.label} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink-deep)]/80 via-[color:var(--ink-deep)]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white md:p-5">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                        {p.tag}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-extrabold md:text-2xl">{p.label}</h3>
                    </div>
                    <span className="flex h-9 w-9 -translate-y-1 items-center justify-center rounded-full bg-white text-[color:var(--brand-blue-deep)] opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUSTED PARTNERS — Marquee */}
      <section className="relative overflow-hidden border-y border-border bg-gradient-warm py-14">
        <div className="mx-auto mb-6 max-w-7xl px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
              Trusted by travelers · Recognized by industry
            </p>
            <p className="text-xs font-semibold text-muted-foreground">
              50+ airline partners · 30+ embassies · 200+ hotel chains
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[color:var(--cream)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[color:var(--cream)] to-transparent" />
          <div className="flex gap-3 overflow-hidden">
            {[0, 1].map(loop => (
              <div key={loop} className="flex shrink-0 items-center gap-3 animate-marquee" aria-hidden={loop === 1}>
                {[
                  "Emirates", "Qatar Airways", "Singapore Airlines", "Turkish Airlines", "Etihad",
                  "Biman Bangladesh", "Saudia", "Cathay Pacific", "Thai Airways", "Malaysia Airlines",
                  "IATA", "ATAB", "TOAB", "CAAB", "Bangladesh Tourism Board",
                ].map((n, i) => (
                  <div
                    key={`${loop}-${n}-${i}`}
                    className="flex h-16 min-w-[200px] items-center justify-center rounded-2xl border border-border bg-card/80 px-6 font-display text-base font-bold text-[color:var(--brand-blue-deep)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[color:var(--brand-orange)]/40 hover:text-[color:var(--brand-orange)]"
                  >
                    {n}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER — animated split */}
      <section className="relative px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] border border-border bg-[color:var(--ink-deep)] p-10 text-white shadow-lift md:p-16">
              <div
                className="absolute inset-0 animate-gradient opacity-90"
                style={{ backgroundImage: "linear-gradient(120deg, rgba(245,130,32,0.85), rgba(217,82,65,0.6) 40%, rgba(50,90,180,0.85) 80%)" }}
              />
              <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-[color:var(--brand-orange)]/40 blur-3xl" />

              <div className="relative grid items-center gap-10 md:grid-cols-12">
                <div className="md:col-span-8">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" /> Limited time
                  </span>
                  <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-5xl">
                    Free 30-min consultation —<br className="hidden md:block" /> we map your trip on a real map.
                  </h2>
                  <p className="mt-4 max-w-xl text-base text-white/85">
                    Sit with a senior consultant (in person or on Zoom) and walk through visa eligibility, ideal dates, hidden costs and the perfect itinerary — all on the house.
                  </p>
                </div>
                <div className="md:col-span-4">
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/contact"
                      className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-[color:var(--brand-blue-deep)] shadow-lift transition hover:-translate-y-0.5 hover:bg-[color:var(--brand-orange)] hover:text-white"
                    >
                      Book my free session
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <a
                      href={whatsappLink()}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/50 px-6 py-4 text-sm font-bold backdrop-blur-md transition hover:border-white hover:bg-white/10"
                    >
                      <Send className="h-4 w-4" /> WhatsApp us
                    </a>
                    <p className="text-center text-[11px] uppercase tracking-widest text-white/70">No obligation · Replies in 5 min</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[color:var(--ink-deep)] py-24 text-white md:py-32">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-[color:var(--brand-orange)]/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[color:var(--brand-blue)]/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/85 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-orange)]" />
              Travelers
            </span>
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight md:text-5xl">
              Postcards from people<br />who came back delighted.
            </h2>
          </Reveal>
          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(t => (
              <StaggerItem key={t.name}>
                <figure className="glass-dark flex h-full flex-col rounded-2xl p-7 text-white">
                  <div className="flex gap-1 text-[color:var(--brand-orange)]">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <blockquote className="mt-5 flex-1 text-base leading-relaxed text-white/90">"{t.quote}"</blockquote>
                  <figcaption className="mt-6 border-t border-white/15 pt-4">
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-xs text-white/65">{t.trip}</p>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* INQUIRY */}
      <section className="relative bg-gradient-warm py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Begin"
                title={<>Tell us where <span className="text-gradient-brand">you're going</span>.</>}
                intro="A consultant will be in touch within 24 hours with a tailored itinerary, fees and timeline — completely without obligation."
              />
              <div className="mt-8 space-y-3">
                <a href={`tel:${SITE.primaryPhone}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white"><PhoneCall className="h-4 w-4" /></span>
                  <div><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Call</p><p className="font-bold text-foreground">{SITE.primaryPhone}</p></div>
                </a>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white"><Send className="h-4 w-4" /></span>
                  <div><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">WhatsApp</p><p className="font-bold text-foreground">Message us instantly</p></div>
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="md:col-span-7">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-lift">
              <InquiryForm sourcePage="home" />
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
