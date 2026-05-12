import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plane, Stamp, MapPin, Stethoscope, Moon, Ticket, ArrowUpRight, Star, ShieldCheck, Clock, HeartHandshake, Globe2, Sparkles, FileCheck2, Send, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServiceCard, SectionHeading } from "@/components/site/ui";
import { Reveal, StaggerGroup, StaggerItem, ParallaxImage, CountUp } from "@/components/site/motion";
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
  { icon: Moon, title: "Umrah Programs", description: "Comfortable Umrah packages all year round, with hand-picked hotels in Makkah & Madinah.", to: "/umrah" },
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
      {/* HERO — brand-gradient cinematic */}
      <section className="relative isolate overflow-hidden bg-[color:var(--ink-deep)] text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2400&q=70"
            alt="Traveler overlooking mountains"
            className="h-full w-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-hero animate-gradient" />
          {/* Floating orange/blue blobs */}
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[color:var(--brand-orange)]/40 blur-3xl animate-float" />
          <div className="absolute right-0 bottom-10 h-96 w-96 rounded-full bg-[color:var(--brand-blue)]/40 blur-3xl animate-float" style={{ animationDelay: "1.2s" }} />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.4em] text-white/80"
          >
            Govt. Approved · License No. {SITE.licenseNo}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-5xl font-display text-5xl leading-[1.02] md:text-7xl lg:text-[5.75rem]"
          >
            Jump into the world with{" "}
            <span className="bg-clip-text text-transparent bg-[linear-gradient(95deg,#FFB36B,#7CC9FF)]">
              World Jumper
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 max-w-2xl text-base text-white/85 md:text-lg"
          >
            Visas for 30+ countries · curated tour packages · IATA air ticketing ·
            Umrah programs · medical tourism. One trusted travel house — for every
            kind of journey from Bangladesh.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link to="/contact" className="btn-brand inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold">
              Plan my trip <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white hover:text-[color:var(--brand-blue-deep)]">
              <Send className="h-4 w-4" /> WhatsApp us
            </a>
            <a href={`tel:${SITE.primaryPhone}`} className="inline-flex items-center gap-2 text-sm font-medium text-white/90 link-underline">
              <PhoneCall className="h-4 w-4" /> {SITE.primaryPhone}
            </a>
          </motion.div>

          {/* Quick service chips */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-12 flex flex-wrap gap-2"
          >
            {[
              { icon: Stamp, label: "Visa", to: "/visa" },
              { icon: MapPin, label: "Tours", to: "/tours" },
              { icon: Plane, label: "Air Ticket", to: "/air-ticketing" },
              { icon: Moon, label: "Umrah", to: "/umrah" },
              { icon: Stethoscope, label: "Medical", to: "/medical-tourism" },
            ].map(({ icon: I, label, to }) => (
              <Link key={label} to={to}
                className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:border-[color:var(--brand-orange)] hover:bg-[color:var(--brand-orange)]">
                <I className="h-3.5 w-3.5" /> {label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative border-t border-white/15 bg-black/30 backdrop-blur-sm">
          <div className="flex overflow-hidden py-3">
            <div className="flex shrink-0 animate-marquee gap-12 whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex shrink-0 items-center gap-12">
                  <span>✦ Visa Processing</span>
                  <span>✦ Tour Packages</span>
                  <span>✦ Air Ticketing</span>
                  <span>✦ Umrah Programs</span>
                  <span>✦ Medical Tourism</span>
                  <span>✦ IATA · ATAB · TOAB · CAAB</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* INTRO with stats */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">
                <span className="mr-3 inline-block h-px w-10 bg-accent align-middle" />Chapter One
              </p>
              <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground md:text-6xl">
                A travel house, not a booking site.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                For over a decade we have shaped journeys for thousands of
                Bangladeshi families, students, patients and pilgrims. Every
                itinerary is hand-checked, every visa file personally
                shepherded — because travel deserves the kind of care it once
                had.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="md:col-span-5">
            <div className="grid grid-cols-2 gap-6">
              {[
                { n: 10000, s: "+", l: "Travelers Served" },
                { n: 30, s: "+", l: "Countries Covered" },
                { n: 50, s: "+", l: "Airline Partners" },
                { n: 12, s: " yrs", l: "Of Experience" },
              ].map(({ n, s, l }) => (
                <div key={l} className="border-l border-border pl-5">
                  <p className="font-display text-5xl text-foreground"><CountUp to={n} suffix={s} /></p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES — editorial grid */}
      <section className="relative bg-secondary/50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex items-end justify-between gap-10">
            <SectionHeading
              eyebrow="What We Offer"
              title={<>Six disciplines.<br />One travel house.</>}
            />
            <Reveal delay={0.2} className="hidden md:block">
              <Link to="/about" className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-foreground link-underline">
                Our Story <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
          <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <StaggerItem key={s.title}>
                <ServiceCard {...s} index={i} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* DESTINATIONS / VISA */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionHeading
              eyebrow="Visa Atlas"
              title={<>Stamps that<br />open <em className="not-italic text-accent">continents</em>.</>}
              intro="From the bazaars of Istanbul to the alpine spas of Switzerland — full document checklists, processing times and embassy fees, all in one place."
            />
          </div>
          <Reveal delay={0.2} className="md:col-span-5 md:text-right">
            <Link to="/visa" className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] link-underline">
              Browse all destinations <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>

        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          } as VisaCountry))).slice(0, 8).map((c, i) => (
            <StaggerItem key={c.id}>
              <Link to={`/visa#${c.slug}`} className="group relative block overflow-hidden rounded-sm bg-card">
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <SafeImage src={c.flag_url} alt={c.country_name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/70">N° {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 font-display text-2xl">{c.country_name}</h3>
                  {c.short_description && <p className="mt-1 line-clamp-2 text-xs text-cream/80">{c.short_description}</p>}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative overflow-hidden bg-gradient-warm py-24 md:py-32">
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[color:var(--brand-orange)]/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[color:var(--brand-blue)]/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeading
            eyebrow="Why World Jumper"
            title={<>Six promises behind <span className="text-gradient-brand">every journey</span>.</>}
            intro="We are not a booking portal. We are a 12-year-old travel house staffed by real consultants who answer the phone, walk you through your visa file, and stand by you long after departure."
          />
          <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Govt. Approved", body: "Fully licensed by Bangladesh Tourism Board. CAAB · IATA · ATAB · TOAB member." },
              { icon: HeartHandshake, title: "Human Consultants", body: "A real person handles your file end-to-end — no chatbots, no call-center scripts." },
              { icon: Clock, title: "On-Time Processing", body: "Transparent visa timelines, ticket confirmations and reminders so you never miss a deadline." },
              { icon: Globe2, title: "30+ Destinations", body: "Visa, hotel and ground support across Asia, Europe, Middle East, USA, UK & Schengen." },
              { icon: Sparkles, title: "Curated, Not Generic", body: "Itineraries hand-built for your taste, budget and travel style — not copy-pasted templates." },
              { icon: ShieldCheck, title: "After-Trip Care", body: "24/7 emergency support while you're abroad. We answer when others don't." },
            ].map(({ icon: I, title, body }, i) => (
              <StaggerItem key={title}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[color:var(--brand-orange)]/40 hover:shadow-lift">
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-brand opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />
                  <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-brand">
                    <I className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <p className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[color:var(--brand-orange)]">
                    {String(i + 1).padStart(2, "0")} / 06
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
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
                { icon: Stamp, title: "We handle the paperwork", body: "Visa, embassy appointments, insurance, tickets — every document, end-to-end." },
                { icon: Plane, title: "Pack and fly", body: "You receive a full travel pack and a 24/7 helpline for the entire journey." },
              ].map(({ icon: I, title, body }, i) => (
                <StaggerItem key={title}>
                  <div className="relative text-center">
                    <div className="relative mx-auto inline-flex h-[84px] w-[84px] items-center justify-center rounded-full bg-background ring-4 ring-card">
                      <div className="absolute inset-0 rounded-full bg-gradient-brand p-[3px]">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
                          <I className="h-7 w-7 text-[color:var(--brand-blue-deep)]" strokeWidth={1.8} />
                        </div>
                      </div>
                      <span className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white shadow-brand">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-xl text-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          <div className="mt-16 text-center">
            <Link to="/contact" className="btn-brand inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold">
              Start your trip now <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PARALLAX QUOTE */}
      <section className="relative h-[70vh] overflow-hidden">
        <ParallaxImage
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=70"
          alt="Mountain horizon"
          className="absolute inset-0"
          strength={0.35}
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto flex h-full max-w-5xl items-center px-6">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-cream/70">
              <span className="mr-3 inline-block h-px w-10 bg-accent align-middle" />Manifesto
            </p>
            <blockquote className="mt-6 font-display text-3xl italic leading-[1.15] text-cream md:text-6xl">
              “The world is a book, and those who do not travel
              <br /> read only one page.”
            </blockquote>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-cream/60">— Saint Augustine</p>
          </Reveal>
        </div>
      </section>

      {/* PACKAGES */}
      {(pkgs.length > 0 || true) && (
        <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <SectionHeading eyebrow="Featured Journeys" title="Departures worth circling on the calendar." />
          <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <Link to={`/tours`} className="group block overflow-hidden rounded-sm border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <SafeImage src={p.image_url} alt={p.title} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
                    {p.price && (
                      <div className="absolute right-4 top-4 rounded-full bg-cream/95 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">
                        {p.price}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{p.package_type} {p.destination ? `· ${p.destination}` : ""}</p>
                    <h3 className="mt-2 font-display text-2xl leading-tight text-foreground">{p.title}</h3>
                    {p.short_description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.short_description}</p>}
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {p.duration && <span>{p.duration}</span>}
                      <span className="inline-flex items-center gap-1 text-foreground link-underline">View <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} /></span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="relative bg-ink py-24 text-cream md:py-32">
        <div className="absolute inset-0 texture-paper opacity-[0.06]" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-cream/60">
              <span className="mr-3 inline-block h-px w-10 bg-accent align-middle" />Travelers
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] text-cream md:text-6xl">
              Postcards from people<br />who came back delighted.
            </h2>
          </Reveal>
          <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(t => (
              <StaggerItem key={t.name}>
                <figure className="flex h-full flex-col rounded-sm border border-cream/15 bg-cream/[0.04] p-7 backdrop-blur-sm">
                  <div className="flex gap-1 text-accent">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
                  <blockquote className="mt-5 flex-1 font-display text-xl italic leading-snug text-cream">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 border-t border-cream/15 pt-4">
                    <p className="font-medium text-cream">{t.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">{t.trip}</p>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* INQUIRY */}
      <section className="relative bg-cream-deep py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">
                <span className="mr-3 inline-block h-px w-10 bg-accent align-middle" />Begin
              </p>
              <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground md:text-6xl">
                Tell us where<br />you're <em className="not-italic text-accent">going.</em>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                A consultant will be in touch within 24 hours with a tailored
                itinerary, fees and timeline — completely without obligation.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="md:col-span-7">
            <InquiryForm sourcePage="home" />
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
