import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Map } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { InquiryForm } from "@/components/site/InquiryForm";
import { supabase, type Package } from "@/lib/supabase";

export const Route = createFileRoute("/tours")({
  component: ToursPage,
  head: () => ({
    meta: [
      { title: "Tour Packages — World Jumper Tours & Travels" },
      { name: "description", content: "Curated international tour packages — Thailand, Malaysia, Singapore, Dubai, Turkey, Europe and more." },
    ],
  }),
});

function ToursPage() {
  const [items, setItems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void supabase.from("packages").select("*")
      .eq("is_active", true).eq("package_type", "Tour")
      .order("is_featured", { ascending: false })
      .then(({ data }) => { setItems((data as Package[]) ?? []); setLoading(false); });
  }, []);

  return (
    <SiteLayout>
      <PageHero eyebrow="Tour Packages" title="Curated tour packages" subtitle="Hand-picked international tours with transparent pricing." />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <PackageGrid items={items} loading={loading} emptyText="No tour packages available right now." />
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <InquiryForm sourcePage="tours" defaultServiceType="Tour Package" title="Plan your tour" subtitle="Tell us your destination and dates — we'll craft the perfect itinerary." />
      </section>
    </SiteLayout>
  );
}

export function PackageGrid({ items, loading, emptyText }: { items: Package[]; loading: boolean; emptyText: string }) {
  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => <PackageCard key={p.id} p={p} />)}
    </div>
  );
}

function PackageCard({ p }: { p: Package }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-brand">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {p.image_url ? (
          <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground"><Map className="h-10 w-10" /></div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">{p.package_type}</span>
          {p.destination && <span className="text-xs text-muted-foreground">· {p.destination}</span>}
        </div>
        <h3 className="mt-2 text-lg font-bold">{p.title}</h3>
        {p.short_description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.short_description}</p>}
        {p.included_services && (
          <p className="mt-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground/80">Includes:</span> {p.included_services}</p>
        )}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">{p.price ?? "Quote on request"}</span>
          {p.duration && <span className="text-muted-foreground">{p.duration}</span>}
        </div>
        <div className="mt-4 flex gap-2">
          <WhatsAppButton message={`Hello World Jumper, I'm interested in: ${p.title}.`} className="flex-1">Inquire on WhatsApp</WhatsAppButton>
        </div>
      </div>
    </article>
  );
}
