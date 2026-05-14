// Supabase-backed admin auth. Replaces the previous VPS API based helper.
// `isAdmin` is true only when the signed-in user has the 'admin' role in user_roles.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdminAuthState {
  loading: boolean;
  isAdmin: boolean;
  email: string | null;
  userId: string | null;
}

async function checkAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return !!data;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true, isAdmin: false, email: null, userId: null,
  });

  useEffect(() => {
    let active = true;

    const apply = async (userId: string | null, email: string | null) => {
      if (!userId) {
        if (active) setState({ loading: false, isAdmin: false, email: null, userId: null });
        return;
      }
      const isAdmin = await checkAdmin(userId);
      if (active) setState({ loading: false, isAdmin, email, userId });
    };

    // Listener FIRST, then session check
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      // defer to avoid deadlocks
      setTimeout(() => apply(session?.user?.id ?? null, session?.user?.email ?? null), 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      apply(data.session?.user?.id ?? null, data.session?.user?.email ?? null);
    });

    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  return state;
}

export async function adminSignIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Sign in failed");
  const isAdmin = await checkAdmin(data.user.id);
  if (!isAdmin) {
    await supabase.auth.signOut();
    throw new Error("This account does not have admin access.");
  }
  return { admin: { id: data.user.id, email: data.user.email ?? "" } };
}

export async function adminSignOut() {
  await supabase.auth.signOut();
}

export async function adminSignUp(email: string, password: string, fullName?: string) {
  const redirectUrl = `${window.location.origin}/admin/login`;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: redirectUrl, data: { full_name: fullName ?? "" } },
  });
  if (error) throw new Error(error.message);
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(error.message);
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}
