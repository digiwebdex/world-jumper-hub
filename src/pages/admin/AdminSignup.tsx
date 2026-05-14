import { useState } from "react";
import { Link } from "react-router-dom";
import { adminSignUp } from "@/lib/use-admin-auth";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE } from "@/lib/site-config";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AdminSignup() {
  usePageTitle("Create Admin Account");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      await adminSignUp(email, password, fullName);
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Signup failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <img src={SITE.logoUrl} alt="logo" className="mx-auto h-12 w-auto" />
        <h1 className="mt-4 text-center text-xl font-bold">Create Account</h1>
        <p className="mt-1 text-center text-xs text-muted-foreground">Admin role must be granted separately.</p>

        {done ? (
          <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-700">
            <CheckCircle2 className="mx-auto mb-2 h-6 w-6" />
            Account created. <Link to="/admin/login" className="underline">Sign in</Link> to continue.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase">Full name</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} type="text"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={8}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <p className="mt-1 text-[11px] text-muted-foreground">Minimum 8 characters.</p>
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button disabled={busy} type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-brand disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create account
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Already have one? <Link to="/admin/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
