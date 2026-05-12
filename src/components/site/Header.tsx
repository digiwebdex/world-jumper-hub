import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { SITE } from "@/lib/site-config";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/visa", label: "Visa" },
  { to: "/tours", label: "Tours" },
  { to: "/medical-tourism", label: "Medical" },
  { to: "/umrah", label: "Umrah" },
  { to: "/air-ticketing", label: "Air Ticket" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={SITE.logoUrl} alt="World Jumper Tours & Travels" className="h-10 w-auto md:h-12" />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                  isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <a
            href={`tel:${SITE.primaryPhone}`}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-brand transition-transform hover:scale-[1.02]"
          >
            <Phone className="h-4 w-4" /> {SITE.primaryPhone}
          </a>
        </div>
        <button
          aria-label="Toggle menu"
          className="rounded-md p-2 text-foreground lg:hidden"
          onClick={() => setOpen((s) => !s)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                    isActive ? "text-primary bg-muted" : "text-foreground/80"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <a
              href={`tel:${SITE.primaryPhone}`}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4" /> Call {SITE.primaryPhone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
