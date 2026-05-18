import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/lib/site-config";
import { VISA_SERVICES } from "@/lib/visa-services";
import { useNavMenu } from "@/lib/cms";

type NavItem = { to: string; label: string; end?: boolean; hasDropdown?: boolean };

const FALLBACK_NAV: NavItem[] = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/visa", label: "Visa", hasDropdown: true },
  { to: "/tours", label: "Tours" },
  { to: "/umrah", label: "Umrah" },
  { to: "/medical-tourism", label: "Medical" },
  { to: "/air-ticketing", label: "Air Ticket" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visaOpen, setVisaOpen] = useState(false);
  const [mobileVisaOpen, setMobileVisaOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const cmsNav = useNavMenu();
  const NAV: NavItem[] = useMemo(() => {
    if (!cmsNav.data.length) return FALLBACK_NAV;
    return cmsNav.data.map((n) => ({
      to: n.url,
      label: n.label,
      end: n.url === "/",
      hasDropdown: n.url === "/visa",
    }));
  }, [cmsNav.data]);

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
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)} aria-label="World Jumper Tours & Travels">
          <img
            src={SITE.logoUrl}
            alt="World Jumper Tours & Travels"
            className="h-10 w-auto object-contain md:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            if (n.hasDropdown && n.to === "/visa") {
              return (
                <div
                  key={n.to}
                  className="relative"
                  onMouseEnter={() => setVisaOpen(true)}
                  onMouseLeave={() => setVisaOpen(false)}
                >
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      `relative inline-flex items-center gap-1 px-3 py-2 text-[13px] font-semibold tracking-wide transition-colors ${
                        isActive
                          ? transparent ? "text-white" : "text-[color:var(--brand-blue-deep)]"
                          : transparent ? "text-white/85 hover:text-white" : "text-foreground/75 hover:text-[color:var(--brand-orange)]"
                      } link-underline`
                    }
                  >
                    {n.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${visaOpen ? "rotate-180" : ""}`} />
                  </NavLink>

                  <AnimatePresence>
                    {visaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-3"
                      >
                        <div className="rounded-2xl border border-border bg-white p-4 text-foreground shadow-[0_24px_60px_-16px_rgba(8,12,32,0.28)]">
                          <div className="mb-2 flex items-center justify-between px-2">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                              Visa Services
                            </p>
                            <Link
                              to="/visa/services"
                              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-blue-deep)] hover:text-[color:var(--brand-orange)]"
                            >
                              View all →
                            </Link>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {VISA_SERVICES.map((s) => {
                              const Icon = s.icon;
                              return (
                                <Link
                                  key={s.slug}
                                  to={`/visa/services/${s.slug}`}
                                  onClick={() => setVisaOpen(false)}
                                  className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[color:var(--cream)]"
                                >
                                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--brand-blue-deep)]/8 text-[color:var(--brand-blue-deep)] group-hover:bg-[color:var(--brand-orange)]/10 group-hover:text-[color:var(--brand-orange)]">
                                    <Icon className="h-4 w-4" />
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold leading-tight text-foreground">
                                      {s.shortTitle}
                                    </p>
                                    <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                                      {s.tagline}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            return (
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
            );
          })}
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
              {NAV.map((n) => {
                if (n.hasDropdown && n.to === "/visa") {
                  return (
                    <div key={n.to} className="border-b border-border/60">
                      <button
                        type="button"
                        onClick={() => setMobileVisaOpen((v) => !v)}
                        className="flex w-full items-center justify-between py-3 font-display text-2xl leading-tight text-foreground"
                      >
                        Visa
                        <ChevronDown className={`h-5 w-5 transition-transform ${mobileVisaOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileVisaOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 pb-3 pl-2">
                              <NavLink
                                to="/visa"
                                end
                                onClick={() => setOpen(false)}
                                className="block rounded-md px-3 py-2 text-sm font-semibold text-[color:var(--brand-blue-deep)] hover:bg-[color:var(--cream)]"
                              >
                                Visa overview
                              </NavLink>
                              <NavLink
                                to="/visa/services"
                                onClick={() => setOpen(false)}
                                className="block rounded-md px-3 py-2 text-sm font-semibold text-[color:var(--brand-blue-deep)] hover:bg-[color:var(--cream)]"
                              >
                                All visa services
                              </NavLink>
                              {VISA_SERVICES.map((s) => (
                                <NavLink
                                  key={s.slug}
                                  to={`/visa/services/${s.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-[color:var(--cream)]"
                                >
                                  {s.shortTitle}
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
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
                );
              })}
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
