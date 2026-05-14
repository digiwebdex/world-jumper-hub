// Database-backed visa services. Mirrors the static VisaService shape but
// resolves the icon string to a Lucide component at read-time.

import { useEffect, useState } from "react";
import {
  Compass, Globe2, FileCheck2, Mail, Stamp, Zap,
  Plane, Briefcase, GraduationCap, Heart, Shield, Building2, Users, Award,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ICON_MAP: Record<string, LucideIcon> = {
  Compass, Globe2, FileCheck2, Mail, Stamp, Zap,
  Plane, Briefcase, GraduationCap, Heart, Shield, Building2, Users, Award,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export type VisaService = {
  id?: string;
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  icon: LucideIcon;
  iconName: string;
  intro: string;
  highlights: string[];
  process: { step: string; detail: string }[];
  whoIsItFor: string[];
  faqs: { q: string; a: string }[];
  published?: boolean;
  displayOrder?: number;
};

type Row = {
  id: string;
  slug: string;
  number: string;
  title: string;
  short_title: string;
  tagline: string;
  summary: string;
  icon: string;
  intro: string;
  highlights: unknown;
  process: unknown;
  who_is_it_for: unknown;
  faqs: unknown;
  display_order: number;
  published: boolean;
};

function asArr<T>(v: unknown, fallback: T[] = []): T[] {
  return Array.isArray(v) ? (v as T[]) : fallback;
}

export function rowToService(r: Row): VisaService {
  return {
    id: r.id,
    slug: r.slug,
    number: r.number,
    title: r.title,
    shortTitle: r.short_title || r.title,
    tagline: r.tagline,
    summary: r.summary,
    iconName: r.icon || "Globe2",
    icon: ICON_MAP[r.icon] || Globe2,
    intro: r.intro,
    highlights: asArr<string>(r.highlights),
    process: asArr<{ step: string; detail: string }>(r.process),
    whoIsItFor: asArr<string>(r.who_is_it_for),
    faqs: asArr<{ q: string; a: string }>(r.faqs),
    published: r.published,
    displayOrder: r.display_order,
  };
}

export function useVisaServices(includeUnpublished = false) {
  const [data, setData] = useState<VisaService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    let q = supabase.from("visa_services").select("*").order("display_order", { ascending: true });
    if (!includeUnpublished) q = q.eq("published", true);
    const { data: rows, error: err } = await q;
    if (err) { setError(err.message); setLoading(false); return; }
    setData((rows as Row[] | null ?? []).map(rowToService));
    setLoading(false);
  };

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [includeUnpublished]);
  return { data, loading, error, reload };
}

export function useVisaService(slug: string) {
  const [data, setData] = useState<VisaService | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase.from("visa_services").select("*").eq("slug", slug).eq("published", true).maybeSingle()
      .then(({ data: row }) => {
        setData(row ? rowToService(row as Row) : null);
        setLoading(false);
      });
  }, [slug]);
  return { data, loading };
}
