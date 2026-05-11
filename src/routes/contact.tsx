import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import heroImg from "@/assets/hero-contact.jpg";
import { InquiryForm } from "@/components/site/InquiryForm";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — World Jumper Tours & Travels" },
      { name: "description", content: "Contact World Jumper for visa, air ticket, tour, Umrah and medical tourism inquiries. Call 01687072001." },
    ],
  }),
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Contact" title="Get in touch with World Jumper"
        subtitle="We're here to help — call, WhatsApp or send an inquiry below."
        image={heroImg} imageAlt="Friendly travel consultant at desk" />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-3 inline-flex items-center gap-2 font-bold"><Phone className="h-5 w-5 text-primary" /> Call us</h3>
              <ul className="space-y-2 text-sm">
                {SITE.phones.map((p) => (
                  <li key={p}><a href={`tel:${p}`} className="font-semibold text-primary hover:underline">{p}</a></li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-3 inline-flex items-center gap-2 font-bold"><Mail className="h-5 w-5 text-primary" /> Email</h3>
              <a href={`mailto:${SITE.email}`} className="text-sm font-semibold text-primary hover:underline">{SITE.email}</a>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-3 inline-flex items-center gap-2 font-bold"><MapPin className="h-5 w-5 text-primary" /> Address</h3>
              <p className="text-sm text-muted-foreground">{SITE.address}</p>
            </div>
            <WhatsAppButton className="w-full !py-3 !text-base">Chat on WhatsApp</WhatsAppButton>
          </div>
          <InquiryForm sourcePage="contact" />
        </div>
      </section>
    </SiteLayout>
  );
}
