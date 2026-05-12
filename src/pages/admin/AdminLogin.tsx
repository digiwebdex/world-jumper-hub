import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminSignIn, useAdminAuth } from "@/lib/use-admin-auth";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE } from "@/lib/site-config";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  usePageTitle("Admin Login");
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { if (!auth.loading && auth.isAdmin) navigate("/admin"); }, [auth.loading, auth.isAdmin, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      await adminSignIn(email, password);
      navigate("/admin");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <img src={SITE.logoUrl} alt="logo" className="mx-auto h-12 w-auto" />
        <h1 className="mt-4 text-center text-xl font-bold">Admin Login</h1>
        <div className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={busy} type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-brand disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
