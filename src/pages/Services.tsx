import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, ServiceCard, SectionHeading } from "@/components/site/ui";
import { StaggerGroup, StaggerItem } from "@/components/site/motion";
import { usePageTitle } from "@/lib/use-page-title";
import { Plane, Stamp, MapPin, Stethoscope, Moon, Ticket } from "lucide-react";

const ITEMS = [
  { icon: Stamp, title: "Visa Services", description: "Tourist, business, medical, student & work visa across 30+ countries.", to: "/visa" },
  { icon: MapPin, title: "Tour Packages", description: "Curated holidays — Asia, Europe, Middle East, Maldives & beyond.", to: "/tours" },
  { icon: Plane, title: "Air Ticketing", description: "IATA-approved fares from 50+ international airlines.", to: "/air-ticketing" },
  { icon: Stethoscope, title: "Medical Tourism", description: "Hospital partners across India, Thailand, Singapore & Malaysia.", to: "/medical-tourism" },
  { icon: Moon, title: "Umrah Programs", description: "Comfortable Umrah packages all year, hand-picked hotels.", to: "/umrah" },
  { icon: Ticket, title: "Bespoke Travel", description: "Custom-designed journeys around your timeline and taste.", to: "/contact" },
];

export default function Services() {
  usePageTitle("Services");
  return (
    <SiteLayout>
      <PageHero
        kicker="What we do"
        eyebrow="Services"
        title={<>One agency,<br /><em className="not-italic text-accent">every</em> way to travel.</>}
        subtitle="Visas, tours, air tickets, Umrah and medical journeys — under one roof, with one consultant."
        image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2400&q=70"
      />
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeading eyebrow="Disciplines" title="Six pillars of our practice." />
        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((s, i) => (
            <StaggerItem key={s.title}><ServiceCard {...s} index={i} /></StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </SiteLayout>
  );
}
