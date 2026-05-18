// Generic CMS hooks for the Express-based CMS endpoints.
// Mirrors the memberships-db.ts pattern: keep a static fallback so the
// public site never breaks if the API is slow / down / empty.
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

export interface ListRow {
  id: string;
  display_order: number;
  is_active: boolean;
  [key: string]: unknown;
}

export function useCmsList<T extends ListRow>(
  basePath: string,
  fallback: T[],
  opts: { includeInactive?: boolean } = {}
) {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const path = opts.includeInactive ? `${basePath}?all=1` : basePath;
      const res = await api.get<{ rows: T[] }>(path);
      const rows = res.rows || [];
      setData(rows.length === 0 && !opts.includeInactive ? fallback : rows);
    } catch {
      setData(opts.includeInactive ? [] : fallback);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath, opts.includeInactive]);

  useEffect(() => { reload(); }, [reload]);
  return { data, loading, reload };
}

export function useCmsSingleton<T extends Record<string, unknown>>(
  basePath: string,
  fallback: T
) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: T | null }>(basePath);
      setData(res.data ?? fallback);
    } catch {
      setData(fallback);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath]);

  useEffect(() => { reload(); }, [reload]);
  return { data, loading, reload };
}
