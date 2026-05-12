import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal } from "./motion";

type Accent = "orange" | "blue" | "deep" | "sand";

const ACCENTS: Record<Accent, { bg: string; ring: string; text: string; glow: string; shape: string }> = {
  orange: {
    bg: "bg-[color:var(--brand-orange)]/12",
    ring: "ring-1 ring-[color:var(--brand-orange)]/35",
    text: "text-[color:var(--brand-orange)]",
    glow: "from-[color:var(--brand-orange)]/40 to-transparent",
    shape: "rounded-2xl",
  },
  blue: {
    bg: "bg-[color:var(--brand-blue)]/12",
    ring: "ring-1 ring-[color:var(--brand-blue)]/35",
    text: "text-[color:var(--brand-blue)]",
    glow: "from-[color:var(--brand-blue)]/40 to-transparent",
    shape: "rounded-[28px] rotate-[6deg]",
  },
  deep: {
    bg: "bg-[color:var(--brand-blue-deep)]/12",
    ring: "ring-1 ring-[color:var(--brand-blue-deep)]/35",
    text: "text-[color:var(--brand-blue-deep)]",
    glow: "from-[color:var(--brand-blue-deep)]/40 to-transparent",
    shape: "rounded-full",
  },
  sand: {
    bg: "bg-gradient-to-br from-[color:var(--brand-orange)]/15 to-[color:var(--brand-blue)]/15",
    ring: "ring-1 ring-foreground/10",
    text: "text-foreground",
    glow: "from-[color:var(--brand-orange)]/30 to-[color:var(--brand-blue)]/30",
    shape: "rounded-3xl",
  },
};

export function FancyIcon({
  icon: Icon, accent = "orange", size = 56,
}: { icon: LucideIcon; accent?: Accent; size?: number }) {
  const a = ACCENTS[accent];
  return (
    <span className="relative inline-flex items-center justify-center">
      {/* Outer rotated frame for visual variety */}
      <span className={`relative flex items-center justify-center ${a.shape} ${a.bg} ${a.ring}`} style={{ width: size, height: size }}>
        <span className={`absolute -inset-3 -z-10 rounded-full bg-gradient-to-br ${a.glow} blur-xl opacity-70`} />
        <Icon className={`${a.text} ${accent === "blue" ? "-rotate-[6deg]" : ""}`} style={{ width: size * 0.46, height: size * 0.46 }} strokeWidth={1.75} />
      </span>
    </span>
  );
}

export function ServiceCard({
  icon: Icon, title, description, to, accent = "orange",
}: { icon: LucideIcon; title: string; description: string; to: string; index?: number; accent?: Accent }) {
  return (
    <Link
      to={to}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className={`absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${ACCENTS[accent].glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`} />
      <FancyIcon icon={Icon} accent={accent} />
      <h3 className="mt-6 font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${ACCENTS[accent].text} transition-transform group-hover:gap-2.5`}>
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
