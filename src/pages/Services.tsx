import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, ServiceCard } from "@/components/site/ui";
import { usePageTitle } from "@/lib/use-page-title";
import { Plane, Stamp, MapPin, Stethoscope, Moon } from "lucide-react";

export default function Services() {
  usePageTitle("Services");
  return (
    <SiteLayout>
      <PageHero eyebrow="What we do" title="Our Travel Services" subtitle="One agency for all your travel needs." />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard icon={Stamp} title="Visa Services" description="Tourist, business, medical & student visa for 30+ countries." to="/visa" />
          <ServiceCard icon={MapPin} title="Tour Packages" description="Curated holidays across Asia, Europe & beyond." to="/tours" />
          <ServiceCard icon={Plane} title="Air Ticketing" description="Best fares from 50+ airlines, IATA approved." to="/air-ticketing" />
          <ServiceCard icon={Stethoscope} title="Medical Tourism" description="Treatment in India, Thailand, Singapore." to="/medical-tourism" />
          <ServiceCard icon={Moon} title="Umrah Packages" description="Comfortable Umrah programs all year round." to="/umrah" />
        </div>
      </section>
    </SiteLayout>
  );
}
