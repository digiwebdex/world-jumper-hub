import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Plane, Stamp, MapPin, Stethoscope, Moon, Ticket, ArrowRight, ArrowUpRight, Star,
  ShieldCheck, Clock, HeartHandshake, Globe2, Sparkles, FileCheck2, Send, PhoneCall, Search,
  ChevronLeft, ChevronRight, Play,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServiceCard, SectionHeading } from "@/components/site/ui";
import { Reveal, StaggerGroup, StaggerItem, CountUp } from "@/components/site/motion";
import { SafeImage } from "@/components/site/SafeImage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { api, type Package, type VisaCountry } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE, whatsappLink } from "@/lib/site-config";

const SERVICES = [
  { icon: Stamp, title: "Visa Services", description: "Tourist, business, medical & student visas processed for 30+ countries with full documentation support.", to: "/visa" },
  { icon: MapPin, title: "Tour Packages", description: "Hand-curated international holidays across Asia, Europe, Middle East and beyond.", to: "/tours" },
  { icon: Plane, title: "Air Ticketing", description: "IATA-approved fares from 50+ airlines — competitive prices, instant confirmation.", to: "/air-ticketing" },
  { icon: Stethoscope, title: "Medical Tourism", description: "Trusted hospital partnerships in India, Thailand, Singapore and Malaysia.", to: "/medical-tourism" },
  { icon: Moon, title: "Umrah Programs", description: "Comfortable Umrah packages all year round with hand-picked hotels in Makkah & Madinah.", to: "/umrah" },
  { icon: Ticket, title: "Bespoke Itineraries", description: "Custom-designed journeys tailored entirely around your timeline and taste.", to: "/contact" },
];

const TESTIMONIALS = [
  { name: "Rashed Hossain", trip: "Dubai · Family Holiday", quote: "From visa to hotel — every detail was effortless. We just packed and flew." },
  { name: "Nusrat Jahan", trip: "Umrah · 2024", quote: "The team treated my parents like their own. The hotel near Haram was perfect." },
  { name: "Tanvir Ahmed", trip: "Bangkok · Medical", quote: "World Jumper coordinated the hospital, hotel and translator. Truly stress-free." },
];

export default function Home() {
  usePageTitle("Home");
  const [pkgs, setPkgs] = useState<Package[]>([]);
  const [countries, setCountries] = useState<VisaCountry[]>([]);

  useEffect(() => {
    api.get<{ items: Package[] }>("/packages?featured=1").then(r => setPkgs(r.items)).catch(() => setPkgs([]));
    api.get<{ items: VisaCountry[] }>("/visa-countries?featured=1").then(r => setCountries(r.items)).catch(() => setCountries([]));
  }, []);

  return (
    <SiteLayout>
      {/* HERO — orange→blue gradient with floating glass card */}
      <section className="relative isolate overflow-hidden bg-[color:var(--ink-deep)] text-white">
        {/* Background image + brand wash */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2400&q=70"
            alt=""
            aria-hidden
            className="h-full w-full object-cover animate-ken-burns"
          />
          <div
            className="absolute inset-0 animate-gradient"
            style={{ backgroundImage: "linear-gradient(115deg, rgba(245,130,32,0.85) 0%, rgba(217,82,65,0.75) 35%, rgba(50,90,180,0.8) 70%, rgba(20,40,90,0.92) 100%)" }}
          />
          <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-[color:var(--brand-orange)]/45 blur-3xl animate-float" />
          <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[color:var(--brand-blue)]/45 blur-3xl animate-float" style={{ animationDelay: "1.4s" }} />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-32 md:grid-cols-12 md:px-10 md:pb-32 md:pt-40">
          {/* LEFT — copy */}
          <div className="md:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-orange)]" />
              Govt. Approved · License No. {SITE.licenseNo}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-6 font-display text-5xl font-extrabold leading-[1.02] md:text-6xl lg:text-7xl"
            >
              Jump into the world with{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #FFD8A8, #BFE3FF)" }}>
                World Jumper
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/90 md:text-lg"
            >
              Your trusted travel partner in Bangladesh for visas, curated tours,
              air tickets, Umrah and medical journeys. Real consultants, transparent
              pricing, and care from booking to homecoming.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
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

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.7 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-widest text-white/70"
            >
              <span>Member of</span>
              {SITE.memberships.slice(0, 6).map(m => (
                <span key={m} className="rounded-md bg-white/10 px-2.5 py-1 backdrop-blur-md">{m}</span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — floating glass quick-quote card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="md:col-span-5"
          >
            <div className="glass relative rounded-3xl p-7 text-foreground md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--brand-orange)]">Quick Quote</p>
              <h3 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
                Where do you want to go?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">Pick a service — we'll get back in 24 hours.</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { icon: Stamp, label: "Visa", to: "/visa" },
                  { icon: MapPin, label: "Tours", to: "/tours" },
                  { icon: Plane, label: "Air Ticket", to: "/air-ticketing" },
                  { icon: Moon, label: "Umrah", to: "/umrah" },
                  { icon: Stethoscope, label: "Medical", to: "/medical-tourism" },
                  { icon: Search, label: "Other", to: "/contact" },
                ].map(({ icon: I, label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-white/70 px-4 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-orange)] hover:bg-white hover:shadow-soft"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand text-white">
                      <I className="h-4 w-4" strokeWidth={2} />
                    </span>
                    {label}
                  </Link>
                ))}
              </div>

              <Link
                to="/contact"
                className="btn-brand mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold"
              >
                Get free consultation <ArrowUpRight className="h-4 w-4" />
              </Link>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
                <a href={`tel:${SITE.primaryPhone}`} className="inline-flex items-center gap-1.5 font-semibold text-[color:var(--brand-blue-deep)]">
                  <PhoneCall className="h-3.5 w-3.5" /> {SITE.primaryPhone}
                </a>
                <span className="text-muted-foreground">10,000+ happy travelers</span>
              </div>
            </div>
          </motion.div>
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
              { icon: ShieldCheck, title: "Govt. Approved", body: "Fully licensed by Bangladesh Tourism Board. CAAB · IATA · ATAB · TOAB member." },
              { icon: HeartHandshake, title: "Human Consultants", body: "A real person handles your file end-to-end — no chatbots, no scripts." },
              { icon: Clock, title: "On-Time Processing", body: "Transparent visa timelines, ticket confirmations and reminders so you never miss a deadline." },
              { icon: Globe2, title: "30+ Destinations", body: "Visa, hotel and ground support across Asia, Europe, Middle East, USA, UK & Schengen." },
              { icon: Sparkles, title: "Curated, Not Generic", body: "Itineraries hand-built for your taste, budget and travel style." },
              { icon: ShieldCheck, title: "After-Trip Care", body: "24/7 emergency support while you're abroad. We answer when others don't." },
            ].map(({ icon: I, title, body }) => (
              <StaggerItem key={title}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/80 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[color:var(--brand-orange)]/40 hover:shadow-lift">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-brand">
                    <I className="h-6 w-6" strokeWidth={2} />
                  </div>
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

      {/* TESTIMONIALS */}
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
