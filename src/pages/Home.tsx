import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plane, Stamp, MapPin, Stethoscope, Moon, Ticket, ArrowUpRight, Star } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, ServiceCard, SectionHeading } from "@/components/site/ui";
import { Reveal, StaggerGroup, StaggerItem, ParallaxImage, CountUp } from "@/components/site/motion";
import { SafeImage } from "@/components/site/SafeImage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { api, type Package, type VisaCountry } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE } from "@/lib/site-config";

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
      <PageHero
        kicker={`Est. — License No. ${SITE.licenseNo}`}
        eyebrow="Govt. Approved Travel Atelier"
        title={<>The world,<br /><em className="not-italic text-accent">curated</em> for Bangladesh.</>}
        subtitle="Visas, tours, air tickets and pilgrimage — designed by travelers, for travelers. From a single passport stamp to a fortnight across continents."
        image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2400&q=70"
        imageAlt="Traveler overlooking mountains"
      />

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
