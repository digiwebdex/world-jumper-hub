// Database-backed visa services served by the VPS API.

import { useEffect, useState, useCallback } from "react";
import {
  Compass, Globe2, FileCheck2, Mail, Stamp, Zap,
  Plane, Briefcase, GraduationCap, Heart, Shield, Building2, Users, Award,
  type LucideIcon,
} from "lucide-react";
import { api } from "@/lib/api";

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

export type Row = {
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

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const path = includeUnpublished ? "/visa-services?all=1" : "/visa-services";
      const res = await api.get<{ services: Row[] }>(path);
      setData((res.services || []).map(rowToService));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [includeUnpublished]);

  useEffect(() => { reload(); }, [reload]);
  return { data, loading, error, reload };
}

export function useVisaService(slug: string) {
  const [data, setData] = useState<VisaService | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get<{ service: Row | null }>(`/visa-services/by-slug/${encodeURIComponent(slug)}`)
      .then((res) => {
        setData(res.service ? rowToService(res.service) : null);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [slug]);
  return { data, loading };
}
