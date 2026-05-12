import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import { SafeImage } from "@/components/site/SafeImage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { usePageTitle } from "@/lib/use-page-title";
import { api, type Package } from "@/lib/api";

export function PackagesPage({
  type, title, subtitle, sourcePage, serviceType,
}: {
  type: Package["package_type"];
  title: string;
  subtitle: string;
  sourcePage: string;
  serviceType: string;
}) {
  usePageTitle(title);
  const [pkgs, setPkgs] = useState<Package[]>([]);
  useEffect(() => {
    api.get<{ items: Package[] }>(`/packages?type=${encodeURIComponent(type)}`)
      .then(r => setPkgs(r.items)).catch(() => setPkgs([]));
  }, [type]);

  return (
    <SiteLayout>
      <PageHero eyebrow={type} title={title} subtitle={subtitle} />
      <section className="mx-auto max-w-7xl px-4 py-12">
        {pkgs.length === 0 ? (
          <p className="text-center text-muted-foreground">No packages published yet. Check back soon or contact us for custom plans.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pkgs.map(p => (
              <article key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <SafeImage src={p.image_url} alt={p.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold">{p.title}</h3>
                  {p.destination && <p className="mt-1 text-xs uppercase tracking-wide text-primary">{p.destination}</p>}
                  {p.short_description && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.short_description}</p>}
                  <div className="mt-3 flex items-center justify-between text-sm">
                    {p.price && <span className="font-bold text-foreground">{p.price}</span>}
                    {p.duration && <span className="text-muted-foreground">{p.duration}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <InquiryForm sourcePage={sourcePage} defaultServiceType={serviceType} />
        </div>
      </section>
    </SiteLayout>
  );
}

export const Tours = () => <PackagesPage type="Tour" title="Tour Packages" subtitle="Curated international holidays from Bangladesh." sourcePage="tours" serviceType="Tour Package" />;
export const Umrah = () => <PackagesPage type="Umrah" title="Umrah Packages" subtitle="Comfortable Umrah programs all year round." sourcePage="umrah" serviceType="Umrah" />;
export const Medical = () => <PackagesPage type="Medical Tourism" title="Medical Tourism" subtitle="Treatment in India, Thailand, Singapore & Malaysia." sourcePage="medical-tourism" serviceType="Medical Tourism" />;
export const AirTicketing = () => <PackagesPage type="Air Ticket Offer" title="Air Ticketing" subtitle="Best fares from 50+ airlines worldwide." sourcePage="air-ticketing" serviceType="Air Ticket" />;
