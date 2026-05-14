import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site-config";
import { normalizeBdPhone } from "@/lib/phone";

export interface WhatsAppSettings {
  whatsapp_number: string;
  whatsapp_message: string;
}

export async function fetchWhatsAppSettings(): Promise<WhatsAppSettings | null> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("whatsapp_number, whatsapp_message")
    .eq("id", 1)
    .maybeSingle();
  if (error) return null;
  return data as WhatsAppSettings | null;
}

/** Loads settings once at app boot and mirrors them onto SITE so existing
 *  callers of whatsappLink() pick up the configured values. */
export async function bootWhatsAppSettings(): Promise<void> {
  const s = await fetchWhatsAppSettings();
  if (!s) return;
  if (s.whatsapp_number) SITE.whatsappIntl = s.whatsapp_number.replace(/[^0-9]/g, "");
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
  const { error } = await supabase
    .from("app_settings")
    .upsert({ id: 1, ...input }, { onConflict: "id" });
  if (error) throw error;
  // Mirror onto SITE for the rest of the session.
  SITE.whatsappIntl = input.whatsapp_number.replace(/[^0-9]/g, "");
  SITE.whatsappMessage = input.whatsapp_message;
}
