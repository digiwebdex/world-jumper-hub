import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ServiceCard({
  icon: Icon, title, description, to,
}: { icon: LucideIcon; title: string; description: string; to: string }) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-brand"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-brand">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function PageHero({
  eyebrow, title, subtitle, image, imageAlt,
}: { eyebrow?: string; title: string; subtitle?: string; image?: string; imageAlt?: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      {image && (
        <>
          <img
            src={image}
            alt={imageAlt ?? ""}
            aria-hidden={imageAlt ? undefined : true}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.05_260)/0.85] via-[oklch(0.22_0.08_255)/0.65] to-transparent" />
        </>
      )}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage:
          "radial-gradient(circle at 20% 30%, white 0, transparent 40%), radial-gradient(circle at 80% 70%, white 0, transparent 30%)",
      }} />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[color:var(--brand-orange)]/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        {eyebrow && (
          <p className="mb-3 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur animate-fade-in">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-3xl font-bold leading-tight drop-shadow-md md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
