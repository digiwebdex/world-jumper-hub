import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface AdminAuthState {
  loading: boolean;
  session: Session | null;
  isAdmin: boolean;
  email: string | null;
}

export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      if (!s) { setIsAdmin(false); setLoading(false); return; }
      const { data } = await supabase
        .from("admin_profiles")
        .select("id,is_active")
        .eq("id", s.user.id)
        .maybeSingle();
      setIsAdmin(Boolean(data?.is_active));
      setLoading(false);
    });

    void supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (!data.session) { setLoading(false); return; }
      const { data: prof } = await supabase
        .from("admin_profiles").select("id,is_active")
        .eq("id", data.session.user.id).maybeSingle();
      setIsAdmin(Boolean(prof?.is_active));
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { loading, session, isAdmin, email: session?.user.email ?? null };
}

export async function adminSignOut() {
  await supabase.auth.signOut();
}
