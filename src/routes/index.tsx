import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Plane, FileCheck2, Map, Stethoscope, MoonStar, ShieldCheck,
  Award, Phone, ArrowRight, Star,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServiceCard } from "@/components/site/ui";
import { SafeImage } from "@/components/site/SafeImage";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { InquiryForm } from "@/components/site/InquiryForm";
import { SITE } from "@/lib/site-config";
import { supabase, type Package, type VisaCountry } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "World Jumper Tours & Travels — Visa, Air Ticket, Tour, Umrah & Medical Tourism" },
      { name: "description", content: "Govt. Approved Travel Agency in Bangladesh (License 0013423). Visa processing, air ticketing, tour packages, Umrah & medical tourism." },
    ],
  }),
});

const SERVICES = [
  { icon: Plane, title: "Air Ticketing", description: "Best fares on domestic & international airlines.", to: "/air-ticketing" },
  { icon: FileCheck2, title: "Visa Processing", description: "Tourist, Business, Medical, Student & Work visas.", to: "/visa" },
  { icon: Map, title: "Tour Packages", description: "Curated tours across Asia, Europe & beyond.", to: "/tours" },
  { icon: Stethoscope, title: "Medical Tourism", description: "End-to-end medical travel support.", to: "/medical-tourism" },
  { icon: MoonStar, title: "Umrah Packages", description: "Economy & premium Umrah packages.", to: "/umrah" },
] as const;

function HomePage() {
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    void (async () => {
      const [c, p] = await Promise.all([
        supabase.from("visa_countries").select("*").eq("is_active", true).eq("is_featured", true).limit(8),
        supabase.from("packages").select("*").eq("is_active", true).eq("is_featured", true).limit(6),
      ]);
      setCountries((c.data as VisaCountry[]) ?? []);
      setPackages((p.data as Package[]) ?? []);
    })();
  }, []);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, white 0, transparent 35%), radial-gradient(circle at 85% 75%, white 0, transparent 30%)",
        }} />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              <ShieldCheck className="h-4 w-4" /> Govt. Approved · License No: {SITE.licenseNo}
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              {SITE.brandName}
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/90 md:text-lg">
              {SITE.tagline}. Visa processing, air ticketing, tours, Umrah and medical tourism — handled end-to-end by our experts.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/visa" className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-primary shadow-xl hover:bg-white/95">
                Apply for Visa <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/air-ticketing" className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white shadow-xl hover:opacity-95">
                Book Air Ticket
              </Link>
              <a href={`tel:${SITE.primaryPhone}`} className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
                <Phone className="h-4 w-4" /> {SITE.primaryPhone}
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <div className="grid grid-cols-2 gap-4">
                {SERVICES.slice(0, 4).map((s) => (
                  <Link key={s.title} to={s.to} className="rounded-2xl bg-white/15 p-4 transition-colors hover:bg-white/25">
                    <s.icon className="mb-2 h-7 w-7" />
                    <p className="text-sm font-semibold">{s.title}</p>
                  </Link>
                ))}
              </div>
              <Link to="/umrah" className="mt-4 flex items-center justify-between rounded-2xl bg-accent p-4 hover:opacity-95">
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-90">Featured</p>
                  <p className="font-semibold">Umrah Packages 2026</p>
                </div>
                <MoonStar className="h-7 w-7" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="border-y border-border bg-secondary/40 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Proud member of
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SITE.memberships.map((m) => (
              <span key={m} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground/85">
                <Award className="h-3.5 w-3.5 text-accent" /> {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Our Services</h2>
          <p className="mt-2 text-muted-foreground">Everything you need for hassle-free travel.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SERVICES.map((s) => <ServiceCard key={s.title} {...s} />)}
        </div>
      </section>

      {/* POPULAR VISA */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Popular Visa Destinations</h2>
              <p className="mt-2 text-muted-foreground">Featured countries for visa processing.</p>
            </div>
            <Link to="/visa" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline md:inline-flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {countries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading visa destinations...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {countries.map((c) => (
                <Link key={c.id} to="/visa" className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-brand">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                    {c.flag_url ? (
                      <img src={c.flag_url} alt={c.country_name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground"><Map className="h-10 w-10" /></div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{c.country_name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.short_description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PACKAGES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Featured Packages</h2>
            <p className="mt-2 text-muted-foreground">Tours, Umrah, medical & air ticket offers.</p>
          </div>
          <Link to="/tours" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline md:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {packages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading packages...</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <article key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-brand">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <SafeImage
                    src={p.image_url}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    fallback={<Map className="h-10 w-10 opacity-60" />}
                  />
                </div>
                <div className="p-5">
                  <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">{p.package_type}</span>
                  <h3 className="mt-2 text-lg font-bold">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.short_description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary">{p.price ?? "Quote on request"}</span>
                    <span className="text-muted-foreground">{p.duration}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <WhatsAppButton message={`Hello World Jumper, I'm interested in ${p.title}.`} className="flex-1">Inquire</WhatsAppButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-gradient-hero text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Why Choose World Jumper</h2>
            <p className="mt-2 text-white/85">Trusted by thousands of travellers across Bangladesh.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, t: "Govt. Approved", d: "Licensed (0013423) and recognized agency." },
              { icon: Award, t: "IATA & ATAB Member", d: "Member of all major travel associations." },
              { icon: Star, t: "10+ Years Experience", d: "Decade of trusted travel expertise." },
              { icon: Phone, t: "24/7 Support", d: "We're a phone call away, anytime." },
            ].map((b) => (
              <div key={b.t} className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                <b.icon className="mb-3 h-8 w-8" />
                <h3 className="font-bold">{b.t}</h3>
                <p className="mt-1 text-sm text-white/80">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INQUIRY */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Get in touch</h2>
            <p className="mt-3 text-muted-foreground">
              Tell us about your travel plans — visa, air ticket, tour, Umrah or medical. Our team replies within 24 hours.
            </p>
            <div className="mt-6 space-y-3">
              {SITE.phones.map((p) => (
                <a key={p} href={`tel:${p}`} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{p}</span>
                </a>
              ))}
              <WhatsAppButton className="w-full">Chat on WhatsApp</WhatsAppButton>
            </div>
          </div>
          <InquiryForm sourcePage="home" />
        </div>
      </section>
    </SiteLayout>
  );
}
