import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, SectionHeading } from "@/components/site/ui";
import { Reveal } from "@/components/site/motion";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "@/lib/use-page-title";
import { Plus } from "lucide-react";

const FAQS = [
  { q: "How long does visa processing take?", a: "It depends on the country — typically 7 to 21 working days after the embassy receives all documents. We share the exact timeline before any payment." },
  { q: "Do you provide air tickets only?", a: "Yes — we are an IATA-approved agent and issue tickets for 50+ international airlines, with or without a tour package." },
  { q: "Can I customize a tour package?", a: "Absolutely. Share your dates, destination and budget and a consultant will design a tailored plan within 24 hours." },
  { q: "Do you arrange Umrah year-round?", a: "Yes, we operate Umrah programs every month with multiple hotel categories near Haram in both Makkah and Madinah." },
  { q: "How do I pay?", a: "We accept bKash, bank transfer, card payment, and cash at our office. Payment plans are available for major bookings." },
  { q: "Is World Jumper licensed?", a: "Yes — we are a Government-approved travel & tourism agency (License No. 0013423) with memberships in IATA, ATAB, TOAB, ETAB and more." },
];

export default function Faq() {
  usePageTitle(
    "FAQ",
    "Answers to common questions about visa processing, payment, refunds, embassy appointments and travel support from World Jumper Tours & Travels."
  );
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteLayout>
      <PageHero
        kicker="Help"
        eyebrow="Questions"
        title={<>The <em className="not-italic text-accent">small print</em>, made plain.</>}
        subtitle="Everything we get asked — answered honestly, in plain language."
        image="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=2400&q=70"
      />
      <section className="mx-auto max-w-4xl px-6 py-24 md:py-32">
        <SectionHeading eyebrow="FAQ" title="Frequently asked." />
        <div className="mt-12 divide-y divide-border border-y border-border">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-6 py-7 text-left transition-colors hover:text-accent"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs tracking-widest text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-2xl leading-tight md:text-3xl">{f.q}</span>
                  </div>
                  <Plus className={`mt-2 h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-45 text-accent" : ""}`} strokeWidth={1.5} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pl-12 pr-12 text-base leading-relaxed text-muted-foreground">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
