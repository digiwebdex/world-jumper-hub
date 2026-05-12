import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard, Globe2, FileCheck2, Package, Inbox, Settings, LogOut, Menu,
} from "lucide-react";
import { useState } from "react";
import { useAdminAuth, adminSignOut } from "@/lib/use-admin-auth";
import { SITE } from "@/lib/site-config";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/visa-countries", label: "Visa Countries", icon: Globe2 },
  { to: "/admin/visa-requirements", label: "Visa Requirements", icon: FileCheck2 },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!auth.loading && (!auth.session || !auth.isAdmin)) {
      void navigate({ to: "/admin/login" });
    }
  }, [auth.loading, auth.session, auth.isAdmin, navigate]);

  if (auth.loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }
  if (!auth.session || !auth.isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Redirecting...</div>;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <img src={SITE.logoUrl} alt="World Jumper" className="h-9 w-auto" />
          <span className="text-sm font-bold">Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((n) => {
            const active = n.to === "/admin" ? path === n.to : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-gradient-brand text-white shadow-brand" : "text-foreground/80 hover:bg-muted"
                }`}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3">
          <p className="mb-2 truncate px-2 text-xs text-muted-foreground">{auth.email}</p>
          <button
            onClick={async () => { await adminSignOut(); void navigate({ to: "/admin/login" }); }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="rounded-md p-2 lg:hidden"><Menu className="h-5 w-5" /></button>
            <h1 className="text-lg font-bold">{title}</h1>
          </div>
          <Link to="/" className="text-sm font-medium text-primary hover:underline">View site →</Link>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
