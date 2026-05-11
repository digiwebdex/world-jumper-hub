import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, PrimaryButton, Card } from "@/components/admin/form-bits";
import { ImageUrlPreview } from "@/components/admin/ImageUrlPreview";
import { supabase } from "@/lib/supabase";

interface SiteSettings {
  id?: string;
  company_name: string | null;
  brand_name: string | null;
  license_no: string | null;
  primary_phone: string | null;
  secondary_phone: string | null;
  other_phones: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  memberships: string | null;
  logo_url: string | null;
  banner_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
}

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
});

function SettingsAdmin() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void supabase.from("site_settings").select("*").order("updated_at", { ascending: false }).limit(1)
      .maybeSingle().then(({ data }) => setS(data as SiteSettings | null));
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setSaved(false);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string | null> = {};
    [
      "company_name", "brand_name", "license_no", "primary_phone", "secondary_phone",
      "other_phones", "whatsapp_number", "email", "address", "memberships",
      "logo_url", "banner_url", "facebook_url", "instagram_url", "linkedin_url",
      "youtube_url", "website_url",
    ].forEach((k) => {
      const v = String(fd.get(k) ?? "").trim();
      payload[k] = v || null;
    });
    const op = s?.id
      ? supabase.from("site_settings").update(payload).eq("id", s.id)
      : supabase.from("site_settings").insert(payload);
    const { error } = await op;
    setBusy(false);
    if (error) { alert(error.message); return; }
    setSaved(true);
    const { data } = await supabase.from("site_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle();
    setS(data as SiteSettings | null);
  };

  return (
    <AdminShell title="Site Settings">
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Company name" name="company_name" defaultValue={s?.company_name} />
          <Field label="Brand name" name="brand_name" defaultValue={s?.brand_name} />
          <Field label="License No" name="license_no" defaultValue={s?.license_no} />
          <Field label="Primary phone" name="primary_phone" defaultValue={s?.primary_phone} />
          <Field label="Secondary phone" name="secondary_phone" defaultValue={s?.secondary_phone} />
          <Field label="Other phones (comma separated)" name="other_phones" defaultValue={s?.other_phones} />
          <Field label="WhatsApp number" name="whatsapp_number" defaultValue={s?.whatsapp_number} />
          <Field label="Email" name="email" type="email" defaultValue={s?.email} />
          <Field full label="Address" name="address" textarea defaultValue={s?.address} />
          <Field full label="Memberships (comma separated)" name="memberships" defaultValue={s?.memberships} />

          <div className="md:col-span-2">
            <Field full label="Logo URL" name="logo_url" defaultValue={s?.logo_url}
              placeholder="https://worldjumperbd.com/uploads/logo/world-jumper-logo.png" />
            <div className="mt-2"><ImageUrlPreview url={s?.logo_url} /></div>
          </div>
          <div className="md:col-span-2">
            <Field full label="Banner URL" name="banner_url" defaultValue={s?.banner_url} />
            <div className="mt-2"><ImageUrlPreview url={s?.banner_url} /></div>
          </div>

          <Field label="Facebook URL" name="facebook_url" defaultValue={s?.facebook_url} />
          <Field label="Instagram URL" name="instagram_url" defaultValue={s?.instagram_url} />
          <Field label="LinkedIn URL" name="linkedin_url" defaultValue={s?.linkedin_url} />
          <Field label="YouTube URL" name="youtube_url" defaultValue={s?.youtube_url} />
          <Field full label="Website URL" name="website_url" defaultValue={s?.website_url} />

          <div className="md:col-span-2 flex items-center justify-end gap-3 border-t border-border pt-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" /> Saved
              </span>
            )}
            <PrimaryButton type="submit" disabled={busy}>{busy ? "Saving..." : "Save settings"}</PrimaryButton>
          </div>
        </form>
      </Card>
    </AdminShell>
  );
}
