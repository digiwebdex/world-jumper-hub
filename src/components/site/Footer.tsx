import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Instagram, Facebook } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-ink text-cream">
      <div className="absolute inset-0 texture-paper opacity-[0.06]" aria-hidden />
      <div className="relative">
        {/* Top — invitation */}
        <div className="border-b border-cream/10">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-12 md:px-10">
            <div className="md:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-cream/60">
                <span className="mr-3 inline-block h-px w-10 bg-accent align-middle" />
                Begin your journey
              </p>
              <h2 className="mt-5 font-display text-5xl leading-[1.05] text-cream md:text-7xl">
                Where shall we<br /><em className="text-accent not-italic">take you</em> next?
              </h2>
            </div>
            <div className="md:col-span-5 md:pt-8">
              <p className="text-sm leading-relaxed text-cream/75">
                Bangladesh's trusted partner for visa processing, curated tours,
                and lifelong travel memories. Speak with a consultant — no
                pressure, just possibility.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`tel:${SITE.primaryPhone}`}
                   className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-accent-foreground transition-transform hover:-translate-y-0.5">
                  <Phone className="h-3.5 w-3.5" /> Call us
                </a>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-cream transition-colors hover:bg-cream hover:text-ink">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-12 md:px-10">
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center" aria-label={SITE.brandName}>
              <img
                src={SITE.logoUrl}
                alt={SITE.brandName}
                className="h-14 w-auto object-contain md:h-16"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">{SITE.tagline}</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-cream/55">
              License No. {SITE.licenseNo}
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-accent hover:text-accent">
                <Facebook className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-accent hover:text-accent">
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-cream/55">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {[["/", "Home"], ["/about", "About"], ["/visa", "Visa"], ["/tours", "Tours"], ["/umrah", "Umrah"], ["/medical-tourism", "Medical"], ["/air-ticketing", "Air Ticket"], ["/contact", "Contact"]].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-cream/80 transition-colors hover:text-accent">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-cream/55">Reach Us</h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/80">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-accent" strokeWidth={1.5} />{SITE.address}</li>
              {SITE.phones.slice(0, 3).map(p => (
                <li key={p}><a href={`tel:${p}`} className="transition-colors hover:text-accent">{p}</a></li>
              ))}
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" strokeWidth={1.5} /><a href={`mailto:${SITE.email}`} className="transition-colors hover:text-accent">{SITE.email}</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-cream/55">Member of</h4>
            <ul className="mt-5 flex flex-wrap gap-2 text-[10px]">
              {SITE.memberships.map(m => (
                <li key={m} className="rounded-full border border-cream/20 px-3 py-1 font-mono uppercase tracking-[0.18em] text-cream/70">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-cream/55 md:flex-row md:items-center md:justify-between md:px-10">
            <span>© {new Date().getFullYear()} {SITE.brandName}. All rights reserved.</span>
            <span className="font-mono uppercase tracking-[0.3em]">Crafted in Dhaka</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
