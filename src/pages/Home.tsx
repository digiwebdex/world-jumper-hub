import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plane, Stamp, MapPin, Stethoscope, Moon, Ticket, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, ServiceCard } from "@/components/site/ui";
import { SafeImage } from "@/components/site/SafeImage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { api, type Package, type VisaCountry } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE } from "@/lib/site-config";

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
        eyebrow={SITE.tagline}
        title="Your trusted partner for visa, tours & air tickets"
        subtitle="Govt. approved travel agency in Bangladesh helping thousands of travelers fly, explore and pilgrimage every year."
        image="https://uploads.worldjumperbd.com/banners/home-banner.jpg"
      />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Our Services</h2>
          <p className="mt-2 text-muted-foreground">Everything you need for your next journey.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard icon={Stamp} title="Visa Services" description="Tourist, business, medical & student visa for 30+ countries." to="/visa" />
          <ServiceCard icon={MapPin} title="Tour Packages" description="Curated holidays across Asia, Europe & beyond." to="/tours" />
          <ServiceCard icon={Plane} title="Air Ticketing" description="Best fares from 50+ airlines, IATA approved." to="/air-ticketing" />
          <ServiceCard icon={Stethoscope} title="Medical Tourism" description="Treatment in India, Thailand, Singapore." to="/medical-tourism" />
          <ServiceCard icon={Moon} title="Umrah Packages" description="Comfortable Umrah programs all year round." to="/umrah" />
          <ServiceCard icon={Ticket} title="All Services" description="View our complete range of travel services." to="/services" />
        </div>
      </section>

      {countries.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold">Featured visa destinations</h2>
                <p className="mt-2 text-muted-foreground">Apply with confidence — full document checklist included.</p>
              </div>
              <Link to="/visa" className="hidden text-sm font-semibold text-primary md:inline-flex">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {countries.slice(0, 8).map(c => (
                <Link key={c.id} to={`/visa#${c.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-brand">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                    <SafeImage src={c.flag_url} alt={c.country_name} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{c.country_name}</h3>
                    {c.short_description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.short_description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {pkgs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Featured Packages</h2>
            <p className="mt-2 text-muted-foreground">Hand-picked tours & offers updated weekly.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pkgs.slice(0, 6).map(p => (
              <article key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <SafeImage src={p.image_url} alt={p.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{p.package_type}</p>
                  <h3 className="mt-1 font-bold">{p.title}</h3>
                  {p.short_description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.short_description}</p>}
                  <div className="mt-3 flex items-center justify-between text-sm">
                    {p.price && <span className="font-bold text-foreground">{p.price}</span>}
                    {p.duration && <span className="text-muted-foreground">{p.duration}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Plan your trip with experts</h2>
            <p className="mt-3 text-muted-foreground">Tell us where you want to go — our travel consultants will design a plan within 24 hours.</p>
          </div>
          <InquiryForm sourcePage="home" />
        </div>
      </section>
    </SiteLayout>
  );
}
