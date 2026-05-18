import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SITE } from "@/lib/site-config";
import { normalizeBdPhone } from "@/lib/phone";

export interface WhatsAppSettings {
  whatsapp_number: string;
  whatsapp_message: string;
}

interface SiteSettingsRow {
  whatsapp_number: string | null;
  whatsapp_message: string | null;
}

export async function fetchWhatsAppSettings(): Promise<WhatsAppSettings | null> {
  try {
    const res = await api.get<{ settings: SiteSettingsRow | null }>("/site-settings");
    const s = res.settings;
    if (!s) return null;
    return {
      whatsapp_number: s.whatsapp_number ?? "",
      whatsapp_message: s.whatsapp_message ?? "",
    };
  } catch {
    return null;
  }
}

/** Loads settings once at app boot and mirrors them onto SITE so existing
 *  callers of whatsappLink() pick up the configured values. */
export async function bootWhatsAppSettings(): Promise<void> {
  const s = await fetchWhatsAppSettings();
  if (!s) return;
  if (s.whatsapp_number) SITE.whatsappIntl = normalizeBdPhone(s.whatsapp_number);
  if (s.whatsapp_message) SITE.whatsappMessage = s.whatsapp_message;
}

export function useWhatsAppSettings() {
  const [data, setData] = useState<WhatsAppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetchWhatsAppSettings().then((s) => {
      if (cancelled) return;
      setData(s ?? { whatsapp_number: SITE.whatsappIntl, whatsapp_message: SITE.whatsappMessage });
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);
  return { data, loading, setData };
}

export async function saveWhatsAppSettings(input: WhatsAppSettings) {
  // site-settings PUT accepts a partial of the FIELDS list.
  await api.put("/site-settings", {
    whatsapp_number: input.whatsapp_number,
    whatsapp_message: input.whatsapp_message,
  });
  SITE.whatsappIntl = normalizeBdPhone(input.whatsapp_number);
  SITE.whatsappMessage = input.whatsapp_message;
}
