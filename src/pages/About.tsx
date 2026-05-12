import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE } from "@/lib/site-config";
import { ShieldCheck, Award, Users } from "lucide-react";

export default function About() {
  usePageTitle("About Us");
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About"
        title={SITE.brandName}
        subtitle={`Govt. Approved Travel & Tourism Company in Bangladesh — License No. ${SITE.licenseNo}`}
      />
      <section className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-lg leading-relaxed text-muted-foreground">
          {SITE.brandName} is a trusted, government-approved travel and tourism company in Bangladesh.
          We help travelers across the country with visa processing, international tour packages,
          air ticketing, medical tourism and Umrah programs. Our experienced consultants make every
          step — from documentation to departure — simple and stress-free.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Govt. Approved", body: `Licensed travel agency #${SITE.licenseNo}.` },
            { icon: Award, title: "Industry Memberships", body: SITE.memberships.slice(0, 5).join(", ") + "…" },
            { icon: Users, title: "10,000+ Travelers", body: "Served happy clients across Bangladesh." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
