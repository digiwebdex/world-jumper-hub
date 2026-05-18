import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordWithToken, verifyResetToken } from "@/lib/use-admin-auth";
import { usePageTitle } from "@/lib/use-page-title";
import { SITE } from "@/lib/site-config";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  usePageTitle("Reset Password");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [ready, setReady] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) { setReady(true); setValidSession(false); return; }
    verifyResetToken(token).then((ok) => {
      setValidSession(ok);
      setReady(true);
    });
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setErr("Passwords do not match."); return; }
    setBusy(true);
    try {
      await resetPasswordWithToken(token, password);
      setDone(true);
      setTimeout(() => navigate("/admin/login"), 2500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <img src={SITE.logoUrl} alt="logo" className="mx-auto h-12 w-auto" />
        <h1 className="mt-4 text-center text-xl font-bold">Set New Password</h1>

        {!ready ? (
          <div className="mt-6 text-center text-sm text-muted-foreground">Loading…</div>
        ) : done ? (
          <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-700">
            <CheckCircle2 className="mx-auto mb-2 h-6 w-6" />
            Password updated. Redirecting to sign in…
          </div>
        ) : !validSession ? (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            This reset link is invalid or expired. Please <Link to="/forgot-password" className="underline">request a new one</Link>.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase">New password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={8}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase">Confirm password</label>
              <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" required minLength={8}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button disabled={busy} type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-brand disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Update password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
