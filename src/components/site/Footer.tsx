import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site-config";


export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={logo} alt={SITE.brandName} className="h-12 w-auto" />
          <p className="mt-3 text-sm text-muted-foreground">
            {SITE.tagline}
          </p>
          <p className="mt-2 text-xs font-semibold text-foreground/80">
            License No: {SITE.licenseNo}
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              ["/", "Home"], ["/about", "About Us"], ["/visa", "Visa Services"],
              ["/tours", "Tour Packages"], ["/medical-tourism", "Medical Tourism"],
              ["/umrah", "Umrah"], ["/air-ticketing", "Air Ticketing"], ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">Contact</h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {SITE.phones.map((p) => (
              <li key={p}><a href={`tel:${p}`} className="hover:text-primary">{p}</a></li>
            ))}
            <li className="pt-2"><a href={`mailto:${SITE.email}`} className="hover:text-primary">{SITE.email}</a></li>
            <li>{SITE.address}</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">Memberships</h4>
          <div className="flex flex-wrap gap-2">
            {SITE.memberships.map((m) => (
              <span key={m} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
