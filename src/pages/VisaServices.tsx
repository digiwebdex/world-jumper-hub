import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, SectionHeading } from "@/components/site/ui";
import { StaggerGroup, StaggerItem } from "@/components/site/motion";
import { usePageTitle } from "@/lib/use-page-title";
import { useVisaServices } from "@/lib/visa-services-db";

export default function VisaServices() {
  usePageTitle(
    "Visa Services — Consultancy, E-Visa, Cross-Border & Legalisation",
    "End-to-end visa services for Bangladeshi travellers."
  );
  const { data: services } = useVisaServices();
  return (
    <SiteLayout>
      <PageHero
        kicker="What we do"
        eyebrow="Visa Services"
        title={<>Visa services,<br /><em className="not-italic text-accent">one trusted desk</em>.</>}
        subtitle="From consultancy to embassy filing, e-visa to apostille — we cover every step of a Bangladeshi visa application."
        image="https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=2400&q=70"
      />

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
        <SectionHeading eyebrow="Services offered" title="Pick the visa service that fits your journey." />
        <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <StaggerItem key={s.slug}>
                <Link to={`/visa/services/${s.slug}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--brand-blue-deep)]/8 text-[color:var(--brand-blue-deep)] transition-colors group-hover:bg-[color:var(--brand-orange)]/10 group-hover:text-[color:var(--brand-orange)]">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">N° {s.number}</span>
                    </div>
                    <h3 className="mt-6 font-display text-2xl leading-tight text-foreground">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-blue-deep)] transition-colors group-hover:text-[color:var(--brand-orange)]">
                    View service details <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>
    </SiteLayout>
  );
}
