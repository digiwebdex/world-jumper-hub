import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, EditorialItem } from "@/components/site/ui";
import { Reveal, ParallaxImage, CountUp } from "@/components/site/motion";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE } from "@/lib/site-config";

const PILLARS = [
  { title: "Govt. approved & licensed", body: `Operating under official Bangladesh travel agency license #${SITE.licenseNo} — your trips are documented, audited and protected.`, image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=70" },
  { title: "A consultant per traveler", body: "Every booking is paired with a named consultant who knows your file from the first call to the airport drop-off.", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=70" },
  { title: "Quietly global, deeply local", body: "Memberships across IATA, ATAB, TOAB and more — but the warmth of a Dhaka travel house that remembers your name.", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=70" },
];

export default function About() {
  usePageTitle("About Us");
  return (
    <SiteLayout>
      <PageHero
        kicker="Our Story"
        eyebrow="About"
        title={<>A travel house, <em className="not-italic text-accent">Dhaka-born</em>.</>}
        subtitle={`Govt. Approved Travel & Tourism Company — License No. ${SITE.licenseNo}.`}
        image="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=2400&q=70"
      />

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">
              <span className="mr-3 inline-block h-px w-10 bg-accent align-middle" />Founding note
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
              We believe travel<br />should feel like a gift,<br />not a transaction.
            </h2>
          </Reveal>
          <Reveal delay={0.2} className="md:col-span-7 md:pt-6">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {SITE.brandName} began with a simple frustration: too many trips
              were sold like commodities, too few were treated as memories in
              the making. Today our consultants design visa files, holidays,
              Umrah programs and medical journeys for thousands of travelers
              across Bangladesh.
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              We are licensed, audited, IATA-approved and proudly accredited
              by every major travel body in the country — but our quiet pride
              is the consultant who answers your call by name.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-6 border-y border-border py-10 md:grid-cols-4">
          {[
            { n: 10000, s: "+", l: "Travelers" },
            { n: 30, s: "+", l: "Countries" },
            { n: 50, s: "+", l: "Airline Partners" },
            { n: 12, s: " yrs", l: "In Practice" },
          ].map(s => (
            <div key={s.l}>
              <p className="font-display text-5xl text-foreground"><CountUp to={s.n} suffix={s.s} /></p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          {PILLARS.map((p, i) => <EditorialItem key={p.title} index={i + 1} {...p} />)}
        </div>
      </section>

      <section className="relative h-[60vh] overflow-hidden">
        <ParallaxImage src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=2400&q=70" alt="" className="absolute inset-0" strength={0.3} />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative mx-auto flex h-full max-w-5xl items-center px-6">
          <Reveal>
            <blockquote className="font-display text-4xl italic leading-[1.1] text-cream md:text-6xl">
              “Not all those who wander are lost — <br/>some are simply <em className="text-accent">in good hands.</em>”
            </blockquote>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
