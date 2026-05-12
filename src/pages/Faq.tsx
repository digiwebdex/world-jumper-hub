import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import { usePageTitle } from "@/lib/use-page-title";

const FAQS = [
  { q: "How long does visa processing take?", a: "It depends on the country — usually 7 to 21 working days after the embassy receives all documents." },
  { q: "Do you provide air ticket only?", a: "Yes, we are an IATA-approved agent and issue tickets for 50+ airlines worldwide." },
  { q: "Can I customize a tour package?", a: "Absolutely. Share your dates, destination and budget — our consultant will design a plan within 24 hours." },
  { q: "Do you arrange Umrah year-round?", a: "Yes, we operate Umrah programs every month with multiple hotel categories." },
  { q: "How do I pay?", a: "We accept bKash, bank transfer, card payment and cash at our office." },
];

export default function Faq() {
  usePageTitle("FAQ");
  return (
    <SiteLayout>
      <PageHero eyebrow="Help" title="Frequently Asked Questions" />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <details key={i} className="group rounded-xl border border-border bg-card p-5">
              <summary className="cursor-pointer list-none font-semibold text-foreground">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
