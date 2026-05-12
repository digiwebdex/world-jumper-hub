import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Field, PrimaryButton } from "@/components/admin/form-bits";
import { ImageUrlPreview } from "@/components/admin/ImageUrlPreview";
import { api } from "@/lib/api";
import { usePageTitle } from "@/lib/use-page-title";

interface Settings {
  company_name: string | null;
  tagline: string | null;
  logo_url: string | null;
  primary_phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp_number: string | null;
  home_banner_url: string | null;
}

export default function AdminSettings() {
  usePageTitle("Site Settings");
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<{ settings: Settings }>("/site-settings").then(r => setS(r.settings)).catch(() => setS({
      company_name: "World Jumper Tours & Travels", tagline: "Govt. Approved Travel Agency",
      logo_url: "https://uploads.worldjumperbd.com/logo/world-jumper-logo.jpeg",
      primary_phone: "01687072001", email: "info@worldjumperbd.com", address: "Dhaka, Bangladesh",
      whatsapp_number: "8801687072001", home_banner_url: "https://uploads.worldjumperbd.com/banners/home-banner.jpg",
    }));
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    await api.put("/admin/site-settings", fd);
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  if (!s) return <AdminShell title="Site Settings"><p className="text-muted-foreground">Loading…</p></AdminShell>;

  return (
    <AdminShell title="Site Settings">
      <Card>
        <p className="mb-3 text-xs text-muted-foreground">
          Media URLs should use <code>https://uploads.worldjumperbd.com/</code> — files are hosted on the VPS uploads folder.
        </p>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Company Name" name="company_name" defaultValue={s.company_name ?? ""} />
          <Field label="Tagline" name="tagline" defaultValue={s.tagline ?? ""} />
          <Field full label="Logo URL" name="logo_url" defaultValue={s.logo_url ?? ""} placeholder="https://uploads.worldjumperbd.com/logo/world-jumper-logo.jpeg" />
          <div className="md:col-span-2"><ImageUrlPreview url={s.logo_url} /></div>
          <Field full label="Home Banner URL" name="home_banner_url" defaultValue={s.home_banner_url ?? ""} placeholder="https://uploads.worldjumperbd.com/banners/home-banner.jpg" />
          <div className="md:col-span-2"><ImageUrlPreview url={s.home_banner_url} /></div>
          <Field label="Primary Phone" name="primary_phone" defaultValue={s.primary_phone ?? ""} />
          <Field label="WhatsApp (intl)" name="whatsapp_number" defaultValue={s.whatsapp_number ?? ""} placeholder="8801687072001" />
          <Field label="Email" name="email" type="email" defaultValue={s.email ?? ""} />
          <Field label="Address" name="address" defaultValue={s.address ?? ""} />
          <div className="md:col-span-2 flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-green-700">Saved!</span>}
            <PrimaryButton type="submit">Save settings</PrimaryButton>
          </div>
        </form>
      </Card>
    </AdminShell>
  );
}
