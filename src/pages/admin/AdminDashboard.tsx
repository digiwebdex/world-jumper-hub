import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/admin/form-bits";
import { api } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";
import { Globe2, Package, Inbox, FileCheck2 } from "lucide-react";

interface Stats { visa_countries: number; packages: number; inquiries: number; visa_requirements: number }

export default function AdminDashboard() {
  usePageTitle("Admin Dashboard");
  const [s, setS] = useState<Stats | null>(null);
  useEffect(() => { api.get<Stats>("/admin/stats").then(setS).catch(() => setS({ visa_countries: 0, packages: 0, inquiries: 0, visa_requirements: 0 })); }, []);

  const items = [
    { icon: Globe2, label: "Visa Countries", value: s?.visa_countries ?? "—" },
    { icon: FileCheck2, label: "Visa Requirements", value: s?.visa_requirements ?? "—" },
    { icon: Package, label: "Packages", value: s?.packages ?? "—" },
    { icon: Inbox, label: "Inquiries", value: s?.inquiries ?? "—" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(it => (
          <Card key={it.label}>
            <it.icon className="h-6 w-6 text-primary" />
            <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">{it.label}</p>
            <p className="mt-1 text-2xl font-bold">{it.value}</p>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
