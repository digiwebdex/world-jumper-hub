import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ParallaxImage, Reveal } from "./motion";

export function ServiceCard({
  icon: Icon, title, description, to, index,
}: { icon: LucideIcon; title: string; description: string; to: string; index?: number }) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-border/70 bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lift"
    >
      <div className="flex items-start justify-between">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors group-hover:border-accent group-hover:text-accent">
          <Icon className="h-5 w-5" strokeWidth={1.4} />
        </div>
        {typeof index === "number" && (
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / —
          </span>
        )}
      </div>
      <h3 className="mt-6 font-display text-2xl leading-tight text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-colors group-hover:text-accent">
        Discover
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
      </span>
    </Link>
  );
}

export function PageHero({
  eyebrow, title, subtitle, image, imageAlt, kicker,
}: {
  eyebrow?: string; title: string; subtitle?: string;
  image?: string; imageAlt?: string; kicker?: string;
}) {
  const fallback = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=70";
  const heroImg = image ?? fallback;
  return (
    <section className="relative isolate overflow-hidden bg-ink text-cream">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt={imageAlt ?? ""}
          aria-hidden={imageAlt ? undefined : true}
          className="h-full w-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <div className="relative mx-auto flex min-h-[68vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
        {kicker && (
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-mono text-[11px] uppercase tracking-[0.4em] text-cream/70"
          >
            {kicker}
          </motion.p>
        )}
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 inline-flex items-center text-xs font-medium uppercase tracking-[0.35em] text-accent"
          >
            <span className="mr-3 h-px w-10 bg-accent" />{eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] text-cream md:text-7xl lg:text-[5.5rem]"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-6 max-w-2xl text-base text-cream/80 md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Bottom marquee tagline */}
      <div className="relative border-t border-cream/10 bg-ink-deep/40 backdrop-blur-sm">
        <div className="flex overflow-hidden py-3">
          <div className="flex shrink-0 animate-marquee gap-12 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.35em] text-cream/55">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-12">
                <span>Visa Processing</span><span>·</span>
                <span>Tour Packages</span><span>·</span>
                <span>Air Ticketing</span><span>·</span>
                <span>Umrah Programs</span><span>·</span>
                <span>Medical Tourism</span><span>·</span>
                <span>IATA · ATAB · TOAB</span><span>·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow, title, intro, align = "left",
}: { eyebrow?: string; title: string; intro?: string; align?: "left" | "center" }) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <p className={`font-mono text-[11px] uppercase tracking-[0.35em] text-accent ${align === "center" ? "" : ""}`}>
          <span className={`inline-block h-px w-10 bg-accent align-middle ${align === "center" ? "mr-3" : "mr-3"}`} />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          {intro}
        </p>
      )}
    </Reveal>
  );
}

/** Editorial split: index number + title + body. */
export function EditorialItem({
  index, title, body, image,
}: { index: number; title: string; body: string; image?: string }) {
  return (
    <Reveal className="grid gap-6 border-t border-border py-10 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-2">
        <p className="font-mono text-sm tracking-widest text-muted-foreground">
          {String(index).padStart(2, "0")}
        </p>
      </div>
      <div className="md:col-span-5">
        <h3 className="font-display text-3xl leading-tight text-foreground md:text-4xl">{title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
      {image && (
        <div className="md:col-span-5">
          <ParallaxImage src={image} alt={title} className="aspect-[4/3] w-full rounded-sm" strength={0.15} />
        </div>
      )}
    </Reveal>
  );
}
