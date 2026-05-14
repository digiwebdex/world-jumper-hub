import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/motion";
import { InquiryForm } from "@/components/site/InquiryForm";
import { usePageTitle } from "@/lib/use-page-title";
import { getVisaService, VISA_SERVICES } from "@/lib/visa-services";

export default function VisaServiceDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const service = getVisaService(slug);

  usePageTitle(
    service ? `${service.title} — Visa Service` : "Visa Service",
    service?.summary ?? "Visa service detail page."
  );

  if (!service) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-6 py-32 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">404</p>
          <h1 className="mt-4 font-display text-4xl">Service not found</h1>
          <p className="mt-3 text-muted-foreground">
            The visa service you are looking for is not on our list.
          </p>
          <Link
            to="/visa/services"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue-deep)] px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all services
          </Link>
        </section>
      </SiteLayout>
    );
  }

  const Icon = service.icon;
  const others = VISA_SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--brand-blue-deep)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
          <Link
            to="/visa/services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All visa services
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Icon className="h-7 w-7" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/60">
              Service N° {service.number}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight md:text-6xl">
            {service.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {service.tagline}
          </p>
        </div>
      </section>

      {/* Intro + Highlights */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Overview</p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
              {service.summary}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {service.intro}
            </p>
          </Reveal>
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                What's included
              </p>
              <ul className="mt-5 space-y-3">
                {service.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-orange)]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-cream-deep py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl">Our process, step by step.</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {service.process.map((p, i) => (
              <Reveal key={p.step}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-xl text-foreground">{p.step}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who is it for + FAQs */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              Who it's for
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Built for travellers like you.</h2>
            <ul className="mt-6 space-y-3">
              {service.whoIsItFor.map((w) => (
                <li key={w} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand-orange)]" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">FAQ</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Frequently asked.</h2>
            <div className="mt-6 space-y-4">
              {service.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-border bg-card p-5 transition-colors open:border-[color:var(--brand-orange)]/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground">
                    {f.q}
                    <span className="text-[color:var(--brand-orange)] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Inquiry */}
      <section className="bg-cream-deep py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <InquiryForm
            sourcePage={`visa-service:${service.slug}`}
            defaultServiceType={service.title}
          />
        </div>
      </section>

      {/* Other services */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              Keep exploring
            </p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl">Other visa services</h2>
          </div>
          <Link
            to="/visa/services"
            className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-blue-deep)] hover:text-[color:var(--brand-orange)] md:inline-flex"
          >
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.slice(0, 3).map((o) => {
            const OIcon = o.icon;
            return (
              <Link
                key={o.slug}
                to={`/visa/services/${o.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--brand-blue-deep)]/8 text-[color:var(--brand-blue-deep)] group-hover:bg-[color:var(--brand-orange)]/10 group-hover:text-[color:var(--brand-orange)]">
                  <OIcon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">{o.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{o.summary}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-blue-deep)] group-hover:text-[color:var(--brand-orange)]">
                    Read more <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
