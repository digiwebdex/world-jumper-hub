import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import { Reveal } from "@/components/site/motion";
import { InquiryForm } from "@/components/site/InquiryForm";
import { useSeo } from "@/lib/use-seo";
import { SITE, whatsappLink } from "@/lib/site-config";
import { useSiteContact } from "@/lib/site-settings";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  useSeo("contact", {
    title: "Contact Us",
    description: "Talk to a senior travel consultant at World Jumper. Call, WhatsApp or send an inquiry — we reply within 24 hours with a tailored visa, tour or ticket plan.",
    path: "/contact",
  });
  const contact = useSiteContact();
  return (
    <SiteLayout>
      <PageHero
        kicker="Conversation"
        eyebrow="Contact"
        title={<>Let's plan something <em className="not-italic text-accent">memorable</em>.</>}
        subtitle="Call, write or knock — a consultant responds within 24 hours, every day."
        image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=70"
      />
      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:grid-cols-12 md:px-10 md:py-32">
        <Reveal className="md:col-span-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">
            <span className="mr-3 inline-block h-px w-10 bg-accent align-middle" />Reach us
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">{contact.brandName}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{contact.tagline}</p>

          <ul className="mt-10 space-y-6 text-sm">
            <li className="flex items-start gap-4 border-t border-border pt-5">
              <MapPin className="mt-0.5 h-5 w-5 text-accent" strokeWidth={1.5} />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Studio</p>
                <p className="mt-1 text-foreground">{contact.address}</p>
              </div>
            </li>
            <li className="flex items-start gap-4 border-t border-border pt-5">
              <Phone className="mt-0.5 h-5 w-5 text-accent" strokeWidth={1.5} />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Telephone</p>
                <div className="mt-1 flex flex-col gap-0.5">
                  {contact.phones.map(p => <a key={p} href={`tel:${p}`} className="text-foreground hover:text-accent">{p}</a>)}
                </div>
              </div>
            </li>
            <li className="flex items-start gap-4 border-t border-border pt-5">
              <Mail className="mt-0.5 h-5 w-5 text-accent" strokeWidth={1.5} />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Correspondence</p>
                <a href={`mailto:${contact.email}`} className="mt-1 block text-foreground hover:text-accent">{contact.email}</a>
              </div>
            </li>
          </ul>

          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
             className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-white transition-transform hover:-translate-y-0.5">
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </Reveal>
        <Reveal delay={0.15} className="md:col-span-7">
          <InquiryForm sourcePage="contact" />
        </Reveal>
      </section>
    </SiteLayout>
  );
}
