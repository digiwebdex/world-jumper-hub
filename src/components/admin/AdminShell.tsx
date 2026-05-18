import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Globe2, FileCheck2, Package, Inbox, Settings, LogOut, Menu, Users, Award, MessageCircle,
  Home, Info, ListTree, Navigation, Search, Newspaper,
} from "lucide-react";
import { useAdminAuth, adminSignOut } from "@/lib/use-admin-auth";
import { SITE } from "@/lib/site-config";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/home-cms", label: "Home CMS", icon: Home },
  { to: "/admin/about-cms", label: "About CMS", icon: Info },
  { to: "/admin/services-faqs", label: "Services & FAQs", icon: ListTree },
  { to: "/admin/nav-footer", label: "Nav & Footer", icon: Navigation },
  { to: "/admin/seo", label: "SEO / Meta", icon: Search },
  { to: "/admin/blog", label: "Blog Posts", icon: Newspaper },
  { to: "/admin/visa-countries", label: "Visa Countries", icon: Globe2 },
  { to: "/admin/visa-requirements", label: "Visa Requirements", icon: FileCheck2 },
  { to: "/admin/visa-services", label: "Visa Services CMS", icon: FileCheck2 },
  { to: "/admin/partners", label: "Partners", icon: Users },
  { to: "/admin/memberships", label: "Memberships", icon: Award },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!auth.loading && !auth.isAdmin) {
      navigate("/admin/login");
    }
  }, [auth.loading, auth.isAdmin, navigate]);

  if (auth.loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }
  if (!auth.isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Redirecting...</div>;
  }

  return (
    <div className="flex min-h-screen bg-cream-deep">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-ink text-cream transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-3 border-b border-cream/10 px-5">
          <img src={SITE.logoUrl} alt="World Jumper" className="h-8 w-auto brightness-0 invert" />
          <span className="font-display text-lg">Admin</span>
        </div>
        <nav className="flex flex-col gap-0.5 overflow-y-auto p-3 pb-24" style={{ maxHeight: "calc(100vh - 4rem - 5rem)" }}>
          {NAV.map((n) => {
            const active = n.to === "/admin" ? path === n.to : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                  active ? "bg-accent text-accent-foreground" : "text-cream/70 hover:bg-cream/5 hover:text-cream"
                }`}
              >
                <n.icon className="h-4 w-4" strokeWidth={1.5} /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-cream/10 p-3">
          <p className="mb-2 truncate px-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/55">{auth.email}</p>
          <button
            onClick={async () => { await adminSignOut(); navigate("/admin/login"); }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-cream/20 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-cream/5"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-ink/60 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="rounded-sm p-2 lg:hidden"><Menu className="h-5 w-5" /></button>
            <h1 className="font-display text-2xl">{title}</h1>
          </div>
          <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground hover:text-accent">View site →</Link>
        </header>
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
