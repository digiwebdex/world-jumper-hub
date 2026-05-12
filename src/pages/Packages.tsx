import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, SectionHeading } from "@/components/site/ui";
import { StaggerGroup, StaggerItem } from "@/components/site/motion";
import { SafeImage } from "@/components/site/SafeImage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { usePageTitle } from "@/lib/use-page-title";
import { api, type Package } from "@/lib/api";
import { ArrowUpRight } from "lucide-react";

const META: Record<Package["package_type"], { hero: string; kicker: string }> = {
  "Tour": { hero: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=70", kicker: "International" },
  "Umrah": { hero: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=2400&q=70", kicker: "Pilgrimage" },
  "Medical Tourism": { hero: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=2400&q=70", kicker: "Healthcare" },
  "Air Ticket Offer": { hero: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2400&q=70", kicker: "Aviation" },
};

export function PackagesPage({
  type, title, subtitle, sourcePage, serviceType,
}: {
  type: Package["package_type"]; title: React.ReactNode; subtitle: string;
  sourcePage: string; serviceType: string;
}) {
  usePageTitle(typeof title === "string" ? title : type);
  const [pkgs, setPkgs] = useState<Package[]>([]);
  useEffect(() => {
    api.get<{ items: Package[] }>(`/packages?type=${encodeURIComponent(type)}`)
      .then(r => setPkgs(r.items)).catch(() => setPkgs([]));
  }, [type]);

  const meta = META[type];

  return (
    <SiteLayout>
      <PageHero kicker={meta.kicker} eyebrow={type} title={title} subtitle={subtitle} image={meta.hero} />
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
        <SectionHeading eyebrow="Selected" title="Departures worth circling on the calendar." />
        {pkgs.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            No packages published yet. Call us for tailored options — every itinerary is hand-built.
          </p>
        ) : (
          <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pkgs.map(p => (
              <StaggerItem key={p.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <SafeImage src={p.image_url} alt={p.title} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
                    {p.price && <div className="absolute right-4 top-4 rounded-full bg-cream/95 px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">{p.price}</div>}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{p.destination ?? type}</p>
                    <h3 className="mt-2 font-display text-2xl leading-tight">{p.title}</h3>
                    {p.short_description && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.short_description}</p>}
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs uppercase tracking-[0.2em]">
                      {p.duration && <span className="text-muted-foreground">{p.duration}</span>}
                      <span className="inline-flex items-center gap-1 text-foreground link-underline">Inquire <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} /></span>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>
      <section className="bg-cream-deep py-24 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <InquiryForm sourcePage={sourcePage} defaultServiceType={serviceType} />
        </div>
      </section>
    </SiteLayout>
  );
}

export const Tours = () => <PackagesPage type="Tour" title={<>Tour <em className="not-italic text-accent">Packages</em></>} subtitle="Curated international holidays from Bangladesh." sourcePage="tours" serviceType="Tour Package" />;
export const Umrah = () => <PackagesPage type="Umrah" title={<>Umrah <em className="not-italic text-accent">Programs</em></>} subtitle="Comfortable Umrah journeys, all year round." sourcePage="umrah" serviceType="Umrah" />;
export const Medical = () => <PackagesPage type="Medical Tourism" title={<>Medical <em className="not-italic text-accent">Tourism</em></>} subtitle="Treatment in India, Thailand, Singapore & Malaysia." sourcePage="medical-tourism" serviceType="Medical Tourism" />;
export const AirTicketing = () => <PackagesPage type="Air Ticket Offer" title={<>Air <em className="not-italic text-accent">Ticketing</em></>} subtitle="IATA-approved fares from 50+ airlines worldwide." sourcePage="air-ticketing" serviceType="Air Ticket" />;
