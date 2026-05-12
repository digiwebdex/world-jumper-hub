import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import { InquiryForm } from "@/components/site/InquiryForm";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE, whatsappLink } from "@/lib/site-config";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  usePageTitle("Contact Us");
  return (
    <SiteLayout>
      <PageHero eyebrow="Get in touch" title="Contact Us" subtitle="We respond within 24 hours, every day of the week." />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">{SITE.brandName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{SITE.tagline}</p>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <span>{SITE.address}</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex flex-col">
                {SITE.phones.map(p => <a key={p} href={`tel:${p}`} className="hover:text-primary">{p}</a>)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <a href={`mailto:${SITE.email}`} className="hover:text-primary">{SITE.email}</a>
            </div>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 font-semibold text-white">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
        <InquiryForm sourcePage="contact" />
      </section>
    </SiteLayout>
  );
}
