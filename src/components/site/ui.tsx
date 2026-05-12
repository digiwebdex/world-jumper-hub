import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal } from "./motion";

export function ServiceCard({
  icon: Icon, title, description, to,
}: { icon: LucideIcon; title: string; description: string; to: string; index?: number }) {
  return (
    <Link
      to={to}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30" />
      <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-brand">
        <Icon className="h-6 w-6" strokeWidth={2} />
      </div>
      <h3 className="mt-6 font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-blue-deep)] transition-colors group-hover:text-[color:var(--brand-orange)]">
        Learn more
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
      </span>
    </Link>
  );
}

export function PageHero({
  eyebrow, title, subtitle, image, imageAlt,
}: {
  eyebrow?: string; title: React.ReactNode; subtitle?: React.ReactNode;
  image?: string; imageAlt?: string; kicker?: React.ReactNode;
}) {
  const fallback = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=70";
  const heroImg = image ?? fallback;
  return (
    <section className="relative isolate overflow-hidden bg-[color:var(--ink-deep)] text-white">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt={imageAlt ?? ""}
          aria-hidden={imageAlt ? undefined : true}
          className="h-full w-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[color:var(--brand-orange)]/35 blur-3xl animate-float" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-[color:var(--brand-blue)]/35 blur-3xl animate-float" style={{ animationDelay: "1.2s" }} />
      </div>

      <div className="relative mx-auto flex min-h-[58vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-orange)]" />
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-5 max-w-2xl text-base text-white/85 md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow, title, intro, align = "left",
}: { eyebrow?: string; title: React.ReactNode; intro?: React.ReactNode; align?: "left" | "center" }) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-orange)]/30 bg-[color:var(--brand-orange)]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[color:var(--brand-orange)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-orange)]" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] text-foreground md:text-5xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {intro}
        </p>
      )}
    </Reveal>
  );
}

import { ParallaxImage } from "./motion";

export function EditorialItem({
  index, title, body, image,
}: { index: number; title: string; body: string; image?: string }) {
  return (
    <Reveal className="grid gap-6 border-t border-border py-10 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-2">
        <p className="font-mono text-sm font-bold tracking-widest text-[color:var(--brand-orange)]">
          {String(index).padStart(2, "0")}
        </p>
      </div>
      <div className="md:col-span-5">
        <h3 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
      {image && (
        <div className="md:col-span-5">
          <ParallaxImage src={image} alt={title} className="aspect-[4/3] w-full rounded-2xl" strength={0.15} />
        </div>
      )}
    </Reveal>
  );
}
