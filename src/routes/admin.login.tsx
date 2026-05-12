import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "@/lib/use-admin-auth";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Admin Login — World Jumper" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.loading && auth.session && auth.isAdmin) {
      void navigate({ to: "/admin" });
    }
  }, [auth.loading, auth.session, auth.isAdmin, navigate]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const { data, error: e1 } = await supabase.auth.signInWithPassword({ email, password });
    if (e1 || !data.session) {
      setSubmitting(false);
      setError(e1?.message ?? "Login failed");
      return;
    }
    const { data: prof } = await supabase
      .from("admin_profiles").select("id,is_active")
      .eq("id", data.session.user.id).maybeSingle();
    if (!prof?.is_active) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError("This account is not authorized as an admin.");
      return;
    }
    void navigate({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo} alt="World Jumper" className="h-14 w-auto" />
          <h1 className="mt-3 text-2xl font-bold">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">World Jumper Tours & Travels</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input name="email" type="email" required autoComplete="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input name="password" type="password" required autoComplete="current-password"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          {error && (
            <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          <button type="submit" disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-brand disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
