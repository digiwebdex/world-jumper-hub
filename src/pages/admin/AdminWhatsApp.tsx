import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Field, PrimaryButton } from "@/components/admin/form-bits";
import { usePageTitle } from "@/lib/use-page-title";
import { useWhatsAppSettings, saveWhatsAppSettings } from "@/lib/whatsapp-settings";
import { normalizeBdPhone, formatBdPhoneDisplay } from "@/lib/phone";
import { MessageCircle, ExternalLink } from "lucide-react";

export default function AdminWhatsApp() {
  usePageTitle("WhatsApp Settings");
  const { data, loading, setData } = useWhatsAppSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading || !data) {
    return <AdminShell title="WhatsApp Settings"><p className="text-muted-foreground">Loading…</p></AdminShell>;
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const next = {
      whatsapp_number: String(fd.get("whatsapp_number") ?? "").trim(),
      whatsapp_message: String(fd.get("whatsapp_message") ?? "").trim(),
    };
    try {
      await saveWhatsAppSettings(next);
      setData(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const previewNumber = data.whatsapp_number.replace(/[^0-9]/g, "");
  const previewUrl = `https://wa.me/${previewNumber}?text=${encodeURIComponent(data.whatsapp_message)}`;

  return (
    <AdminShell title="WhatsApp Settings">
      <Card>
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-full bg-[#25D366]/10 p-2 text-[#25D366]"><MessageCircle className="h-5 w-5" /></div>
          <div>
            <h2 className="font-display text-lg">Company WhatsApp</h2>
            <p className="text-sm text-muted-foreground">
              The number visitors are routed to from every WhatsApp button and the
              pre-filled message that opens with each chat or inquiry submission.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field
            full
            label="WhatsApp Number (international format, digits only)"
            name="whatsapp_number"
            defaultValue={data.whatsapp_number}
            placeholder="8801687072001"
            required
          />
          <Field
            full
            textarea
            rows={4}
            label="Pre-filled Message Template"
            name="whatsapp_message"
            defaultValue={data.whatsapp_message}
            placeholder="Hello World Jumper, I want to know about visa/tour/air ticket service."
            required
          />

          <div className="md:col-span-2 rounded-xl border border-border bg-muted/40 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Preview</p>
            <p className="break-all font-mono text-xs text-foreground/80">{previewUrl}</p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-xs font-semibold text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Test on WhatsApp
            </a>
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3">
            {error && <span className="text-sm text-destructive">{error}</span>}
            {saved && <span className="text-sm text-green-700">Saved!</span>}
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save WhatsApp settings"}
            </PrimaryButton>
          </div>
        </form>
      </Card>
    </AdminShell>
  );
}
