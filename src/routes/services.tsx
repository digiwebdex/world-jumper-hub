import { createFileRoute } from "@tanstack/react-router";
import { Plane, FileCheck2, Map, Stethoscope, MoonStar } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, ServiceCard } from "@/components/site/ui";
import heroImg from "@/assets/hero-services.jpg";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Our Services — World Jumper Tours & Travels" },
      { name: "description", content: "Air ticketing, visa processing, tour packages, Umrah and medical tourism — full travel services from World Jumper." },
    ],
  }),
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="What we do"
        title="Comprehensive travel & tourism services"
        subtitle="From visas to vacations, we handle every step."
        image={heroImg} imageAlt="Airplane wing above sunset clouds"
      />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard icon={Plane} title="Air Ticketing" to="/air-ticketing"
            description="Domestic & international tickets at the best fares. IATA-accredited agency." />
          <ServiceCard icon={FileCheck2} title="Visa Processing" to="/visa"
            description="Tourist, Business, Medical, Student, Work & Umrah visa support for 100+ countries." />
          <ServiceCard icon={Map} title="Tour Packages" to="/tours"
            description="Curated leisure tours — Asia, Middle East, Europe and beyond." />
          <ServiceCard icon={Stethoscope} title="Medical Tourism" to="/medical-tourism"
            description="End-to-end coordination with top hospitals in India, Thailand, Singapore." />
          <ServiceCard icon={MoonStar} title="Umrah Packages" to="/umrah"
            description="Economy & premium Umrah packages with full visa, hotel & transport." />
        </div>
      </section>
    </SiteLayout>
  );
}
