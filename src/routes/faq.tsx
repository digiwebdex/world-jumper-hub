import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "FAQ — World Jumper Tours & Travels" },
      { name: "description", content: "Frequently asked questions about visa, tour, air ticket, Umrah and medical tourism with World Jumper." },
    ],
  }),
});

const FAQS = [
  { q: "Is World Jumper a Govt. approved travel agency?", a: "Yes. We are licensed under No. 0013423 and members of CAAB, IATA, ATAB, TOB, BOTOF, ETAB, e-Cab and Lions International." },
  { q: "How long does visa processing take?", a: "It varies by country and visa type — typically 5 to 15 working days. We provide an exact estimate after reviewing your documents." },
  { q: "Do you offer Umrah packages?", a: "Yes — economy, standard and premium Umrah packages including visa, air ticket, hotel, transport and guided ziyarah." },
  { q: "Can you assist with medical treatment abroad?", a: "Absolutely. We coordinate with top hospitals in India, Thailand and Singapore — including medical visa, hospital appointment, hotel and translator." },
  { q: "What payment methods do you accept?", a: "Bank deposit, mobile banking (bKash / Nagad), card payments and direct office payments." },
  { q: "Do you book domestic air tickets?", a: "Yes. We are an IATA-accredited agent and book all domestic & international airlines." },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteLayout>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="overflow-hidden rounded-xl border border-border bg-card">
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-semibold">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <div className="border-t border-border bg-muted/30 px-5 py-4 text-sm text-muted-foreground">{f.a}</div>}
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
