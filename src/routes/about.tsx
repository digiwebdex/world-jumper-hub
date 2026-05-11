import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Award, Users, Globe2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us — World Jumper Tours & Travels" },
      { name: "description", content: "World Jumper is a Govt. approved (License 0013423) travel & tourism company in Bangladesh. Member of CAAB, IATA, ATAB, TOB, BOTOF, ETAB, e-Cab, Lions International." },
    ],
  }),
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About Us"
        title="Your trusted travel partner in Bangladesh"
        subtitle={`${SITE.tagline} · License No: ${SITE.licenseNo}`}
      />
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="prose max-w-none text-foreground/90">
          <p className="text-lg leading-relaxed">
            <strong>{SITE.brandName}</strong> is a Government-approved travel and tourism company in
            Bangladesh providing comprehensive travel services — from international air ticketing
            and visa processing to curated tour packages, Umrah and medical tourism support.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We are proud members of the country's most respected travel associations and a
            recognized IATA agent. Our team works closely with embassies, hospitals, hotels and
            airline partners to deliver a smooth, transparent and reliable travel experience.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, t: "Govt. Approved", d: `License No: ${SITE.licenseNo}` },
            { icon: Award, t: "8 Memberships", d: "CAAB, IATA, ATAB & more" },
            { icon: Users, t: "Expert Team", d: "Specialists in visa & travel ops" },
            { icon: Globe2, t: "Worldwide", d: "Visa & tour support globally" },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl border border-border bg-card p-6 text-center">
              <b.icon className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-3 font-bold">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-hero p-8 text-white">
          <h3 className="text-xl font-bold">Memberships & Affiliations</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {SITE.memberships.map((m) => (
              <span key={m} className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold backdrop-blur">{m}</span>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
