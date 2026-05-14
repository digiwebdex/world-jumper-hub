import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordReset } from "@/lib/use-admin-auth";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE } from "@/lib/site-config";
import { Loader2, MailCheck } from "lucide-react";

export default function ForgotPassword() {
  usePageTitle("Forgot Password");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    try { await sendPasswordReset(email); setSent(true); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <img src={SITE.logoUrl} alt="logo" className="mx-auto h-12 w-auto" />
        <h1 className="mt-4 text-center text-xl font-bold">Forgot Password</h1>

        {sent ? (
          <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-700">
            <MailCheck className="mx-auto mb-2 h-6 w-6" />
            If an account exists for <strong>{email}</strong>, a reset link has been sent.
            <div className="mt-3"><Link to="/admin/login" className="text-emerald-700 underline">Back to sign in</Link></div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <p className="text-xs text-muted-foreground">Enter your email and we'll send you a reset link.</p>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button disabled={busy} type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-brand disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link
            </button>
            <p className="text-center text-xs">
              <Link to="/admin/login" className="text-primary hover:underline">Back to sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
