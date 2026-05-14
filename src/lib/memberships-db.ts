import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site-config";

export interface Membership {
  id: string;
  name: string;
  logo_url: string | null;
  link_url: string | null;
  display_order: number;
  published: boolean;
}

const FALLBACK: Membership[] = SITE.memberships.map((name, i) => ({
  id: `_${i}`,
  name,
  logo_url: null,
  link_url: null,
  display_order: (i + 1) * 10,
  published: true,
}));

export function useMemberships(includeUnpublished = false) {
  const [data, setData] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("memberships").select("*").order("display_order", { ascending: true });
    if (!includeUnpublished) q = q.eq("published", true);
    const { data: rows, error } = await q;
    if (error || !rows || rows.length === 0) {
      setData(includeUnpublished ? [] : FALLBACK);
    } else {
      setData(rows as Membership[]);
    }
    setLoading(false);
  }, [includeUnpublished]);

  useEffect(() => { reload(); }, [reload]);
  return { data, loading, reload };
}

export const MEMBERSHIP_LOGO_BUCKET = "membership-logos";

export function membershipLogoPublicUrl(path: string): string {
  return supabase.storage.from(MEMBERSHIP_LOGO_BUCKET).getPublicUrl(path).data.publicUrl;
}
