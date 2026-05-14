import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PartnerKind = "airline" | "hotel" | "authority";

export interface Partner {
  id: string;
  name: string;
  kind: PartnerKind;
  country: string;
  cc: string;
  display_order: number;
  published: boolean;
}

const FALLBACK: Partner[] = [
  { id: "_1", name: "Emirates", kind: "airline", country: "UAE", cc: "AE", display_order: 10, published: true },
  { id: "_2", name: "Qatar Airways", kind: "airline", country: "Qatar", cc: "QA", display_order: 20, published: true },
  { id: "_3", name: "Singapore Airlines", kind: "airline", country: "Singapore", cc: "SG", display_order: 30, published: true },
  { id: "_4", name: "Turkish Airlines", kind: "airline", country: "Türkiye", cc: "TR", display_order: 40, published: true },
  { id: "_5", name: "Biman Bangladesh", kind: "airline", country: "Bangladesh", cc: "BD", display_order: 60, published: true },
  { id: "_6", name: "Marriott Hotels", kind: "hotel", country: "USA", cc: "US", display_order: 110, published: true },
  { id: "_7", name: "IATA", kind: "authority", country: "Global", cc: "UN", display_order: 140, published: true },
];

export function usePartners(includeUnpublished = false) {
  const [data, setData] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("partners").select("*").order("display_order", { ascending: true });
    if (!includeUnpublished) q = q.eq("published", true);
    const { data: rows, error } = await q;
    if (error || !rows || rows.length === 0) {
      setData(includeUnpublished ? [] : FALLBACK);
    } else {
      setData(rows as Partner[]);
    }
    setLoading(false);
  }, [includeUnpublished]);

  useEffect(() => { reload(); }, [reload]);
  return { data, loading, reload };
}
