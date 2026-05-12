import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/lib/site-config";

const NAV: { to: string; label: string; end?: boolean }[] = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/visa", label: "Visa" },
  { to: "/tours", label: "Tours" },
  { to: "/umrah", label: "Umrah" },
  { to: "/medical-tourism", label: "Medical" },
  { to: "/air-ticketing", label: "Air Ticket" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Header is transparent over hero on home, solid elsewhere or after scroll.
  const transparent = isHome && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        transparent
          ? "bg-transparent text-white"
          : "border-b border-border/70 bg-background/90 text-foreground shadow-sm backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 md:px-10">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className={`inline-flex items-center justify-center rounded-xl px-2 py-1 transition-all ${
            transparent ? "bg-white/95 shadow-lift" : ""
          }`}>
            <img
              src={SITE.logoUrl}
              alt="World Jumper Tours & Travels"
              className="h-9 w-auto md:h-12"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `relative px-3 py-2 text-[13px] font-semibold tracking-wide transition-colors ${
                  isActive
                    ? transparent ? "text-white" : "text-[color:var(--brand-blue-deep)]"
                    : transparent ? "text-white/85 hover:text-white" : "text-foreground/75 hover:text-[color:var(--brand-orange)]"
                } link-underline`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${SITE.primaryPhone}`}
            className="btn-brand group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={2} />
            {SITE.primaryPhone}
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          className={`rounded-full p-2 transition-colors lg:hidden ${transparent ? "text-white" : "text-foreground"}`}
          onClick={() => setOpen((s) => !s)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background text-foreground lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `border-b border-border/60 py-3 font-display text-2xl leading-tight transition-colors ${
                      isActive ? "text-accent" : "text-foreground hover:text-accent"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <a
                href={`tel:${SITE.primaryPhone}`}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-accent-foreground"
              >
                <Phone className="h-4 w-4" /> {SITE.primaryPhone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
