import { createFileRoute } from "@tanstack/react-router";
import { Plane } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import heroImg from "@/assets/hero-air.jpg";
import { InquiryForm } from "@/components/site/InquiryForm";

export const Route = createFileRoute("/air-ticketing")({
  component: AirTicketPage,
  head: () => ({
    meta: [
      { title: "Air Ticketing — World Jumper Tours & Travels" },
      { name: "description", content: "Best fares on domestic & international air tickets. IATA-accredited travel agency in Bangladesh." },
    ],
  }),
});

function AirTicketPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Air Ticketing" title="Best fares, all major airlines"
        subtitle="Domestic & international air tickets — share your route and we'll quote the best fare."
        image={heroImg} imageAlt="Airliner taking off into sunset" />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <Plane className="h-10 w-10 text-primary" />
            <h2 className="mt-3 text-xl font-bold">Why book with us?</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>· IATA-accredited agent</li>
              <li>· Special corporate & group fares</li>
              <li>· Flexible date / route advisory</li>
              <li>· 24/7 ticketing support</li>
              <li>· Hassle-free refunds & re-issues</li>
            </ul>
          </div>
          <InquiryForm sourcePage="air-ticketing" variant="air-ticket" defaultServiceType="Air Ticket"
            title="Request a fare quote" subtitle="Fill in your travel details — our team replies with options shortly." />
        </div>
      </section>
    </SiteLayout>
  );
}
