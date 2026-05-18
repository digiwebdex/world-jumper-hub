import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
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
    try {
      const path = includeUnpublished ? "/memberships?all=1" : "/memberships";
      const res = await api.get<{ memberships: Membership[] }>(path);
      const rows = res.memberships || [];
      setData(rows.length === 0 && !includeUnpublished ? FALLBACK : rows);
    } catch {
      setData(includeUnpublished ? [] : FALLBACK);
    } finally {
      setLoading(false);
    }
  }, [includeUnpublished]);

  useEffect(() => { reload(); }, [reload]);
  return { data, loading, reload };
}

// Kept for backwards compatibility — admin uploader now uses /api/admin/uploads.
export const MEMBERSHIP_LOGO_BUCKET = "memberships";
export function membershipLogoPublicUrl(url: string): string {
  return url;
}
