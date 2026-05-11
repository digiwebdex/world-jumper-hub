import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe2, FileCheck2, Package, Inbox } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/admin/form-bits";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Admin Dashboard — World Jumper" }] }),
});

function Dashboard() {
  const [stats, setStats] = useState({ countries: 0, requirements: 0, packages: 0, inquiries: 0, newInquiries: 0 });
  useEffect(() => {
    void (async () => {
      const head = { count: "exact" as const, head: true };
      const [c, r, p, i, ni] = await Promise.all([
        supabase.from("visa_countries").select("*", head),
        supabase.from("visa_requirements").select("*", head),
        supabase.from("packages").select("*", head),
        supabase.from("inquiries").select("*", head),
        supabase.from("inquiries").select("*", head).eq("status", "New"),
      ]);
      setStats({
        countries: c.count ?? 0, requirements: r.count ?? 0, packages: p.count ?? 0,
        inquiries: i.count ?? 0, newInquiries: ni.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Visa Countries", value: stats.countries, to: "/admin/visa-countries", icon: Globe2 },
    { label: "Visa Requirements", value: stats.requirements, to: "/admin/visa-requirements", icon: FileCheck2 },
    { label: "Packages", value: stats.packages, to: "/admin/packages", icon: Package },
    { label: "Inquiries (New)", value: `${stats.newInquiries} / ${stats.inquiries}`, to: "/admin/inquiries", icon: Inbox },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="block">
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gradient-brand">{c.value}</p>
                </div>
                <c.icon className="h-8 w-8 text-primary/60" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-bold">Quick actions</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/admin/visa-countries" className="text-primary hover:underline">+ Add new visa country</Link></li>
            <li><Link to="/admin/visa-requirements" className="text-primary hover:underline">+ Add visa requirement</Link></li>
            <li><Link to="/admin/packages" className="text-primary hover:underline">+ Add new package</Link></li>
            <li><Link to="/admin/inquiries" className="text-primary hover:underline">View customer inquiries</Link></li>
            <li><Link to="/admin/settings" className="text-primary hover:underline">Update site settings</Link></li>
          </ul>
        </Card>
        <Card>
          <h3 className="font-bold">Image hosting reminder</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload images and PDFs to your Hostinger File Manager under <code className="rounded bg-muted px-1.5 py-0.5">public_html/uploads/</code> and paste the public URL into the relevant form. The admin shows a live preview of any URL you enter.
          </p>
        </Card>
      </div>
    </AdminShell>
  );
}
