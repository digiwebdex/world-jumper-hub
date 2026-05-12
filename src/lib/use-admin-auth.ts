import { useEffect, useState } from "react";
import { api } from "./api";

export interface AdminAuthState {
  loading: boolean;
  isAdmin: boolean;
  email: string | null;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    isAdmin: false,
    email: null,
  });

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ admin: { id: string; email: string } }>("/auth/me")
      .then((r) => {
        if (!cancelled) setState({ loading: false, isAdmin: true, email: r.admin.email });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, isAdmin: false, email: null });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}

export async function adminSignOut() {
  try { await api.post("/auth/logout"); } catch { /* ignore */ }
}

export async function adminSignIn(email: string, password: string) {
  return api.post<{ admin: { id: string; email: string } }>("/auth/login", { email, password });
}
