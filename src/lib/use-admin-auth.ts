// Admin auth backed by the VPS Express API (cookie session).
// Replaces the previous Supabase Auth integration.

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface AdminAuthState {
  loading: boolean;
  isAdmin: boolean;
  email: string | null;
  userId: string | null;
}

interface MeResponse {
  admin: { id: string; email: string };
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    isAdmin: false,
    email: null,
    userId: null,
  });

  useEffect(() => {
    let active = true;
    api
      .get<MeResponse>("/auth/me")
      .then((r) => {
        if (!active) return;
        setState({
          loading: false,
          isAdmin: true,
          email: r.admin.email,
          userId: r.admin.id,
        });
      })
      .catch(() => {
        if (!active) return;
        setState({ loading: false, isAdmin: false, email: null, userId: null });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

export async function adminSignIn(email: string, password: string) {
  return api.post<MeResponse>("/auth/login", { email, password });
}

export async function adminSignOut() {
  try {
    await api.post("/auth/logout");
  } catch {
    /* ignore */
  }
}

export async function adminSignUp(email: string, password: string, fullName?: string) {
  await api.post("/auth/signup", { email, password, fullName });
}

export async function sendPasswordReset(email: string) {
  await api.post("/auth/forgot", { email });
}

export async function verifyResetToken(token: string): Promise<boolean> {
  try {
    const r = await api.get<{ valid: boolean }>(
      `/auth/reset/verify?token=${encodeURIComponent(token)}`
    );
    return !!r.valid;
  } catch {
    return false;
  }
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  await api.post("/auth/reset", { token, password: newPassword });
}

export async function updatePassword(newPassword: string) {
  await api.post("/auth/update-password", { password: newPassword });
}
