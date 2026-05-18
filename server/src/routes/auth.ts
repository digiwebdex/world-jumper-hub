import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { query } from "../db.js";
import {
  clearSessionCookie,
  requireAdmin,
  setSessionCookie,
  signAdminToken,
  type AuthedRequest,
} from "../auth.js";
import { sendMail } from "../mailer.js";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotLimiter = rateLimit({
  windowMs: 60_000 * 15,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(200),
});

authRouter.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid email or password" });
  const { email, password } = parsed.data;
  const { rows } = await query<{
    id: string;
    email: string;
    password_hash: string;
    is_active: boolean;
  }>("SELECT id, email, password_hash, is_active FROM admin_users WHERE email = $1", [
    email.toLowerCase(),
  ]);
  const user = rows[0];
  if (!user || !user.is_active) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signAdminToken({ sub: user.id, email: user.email });
  setSessionCookie(res, token);
  res.json({ admin: { id: user.id, email: user.email } });
});

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAdmin, (req: AuthedRequest, res) => {
  res.json({ admin: req.admin });
});

// ---------------- Signup ----------------
const signupSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200),
  fullName: z.string().trim().max(255).optional(),
});

authRouter.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { email, password, fullName } = parsed.data;
  const lower = email.toLowerCase();

  const existing = await query<{ id: string }>("SELECT id FROM admin_users WHERE email = $1", [lower]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }
  const hash = await bcrypt.hash(password, 10);
  await query(
    "INSERT INTO admin_users (email, password_hash, full_name, is_active) VALUES ($1, $2, $3, true)",
    [lower, hash, fullName || ""]
  );
  res.json({ ok: true });
});

// ---------------- Forgot password ----------------
const forgotSchema = z.object({ email: z.string().trim().email().max(255) });

authRouter.post("/forgot", forgotLimiter, async (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  // Always respond OK to avoid email enumeration.
  if (!parsed.success) return res.json({ ok: true });
  const { email } = parsed.data;
  const { rows } = await query<{ id: string; email: string }>(
    "SELECT id, email FROM admin_users WHERE email = $1 AND is_active = true",
    [email.toLowerCase()]
  );
  const user = rows[0];
  if (!user) return res.json({ ok: true });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await query(
    "INSERT INTO admin_password_resets (admin_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [user.id, tokenHash, expiresAt]
  );

  const appUrl = process.env.APP_URL || "http://localhost:5173";
  const link = `${appUrl}/reset-password?token=${rawToken}`;
  const html = `
    <p>Hello,</p>
    <p>A password reset was requested for your World Jumper admin account.</p>
    <p><a href="${link}">Click here to reset your password</a> (valid for 1 hour).</p>
    <p>If you did not request this, you can safely ignore this email.</p>
  `;
  const text = `Reset your password: ${link}\n(Valid for 1 hour. Ignore if you did not request.)`;

  try {
    await sendMail({ to: user.email, subject: "Reset your admin password", html, text });
  } catch (e) {
    console.error("[auth/forgot] sendMail failed", e);
  }
  res.json({ ok: true });
});

// ---------------- Reset password ----------------
const resetSchema = z.object({
  token: z.string().min(10).max(200),
  password: z.string().min(8).max(200),
});

authRouter.post("/reset", async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request" });
  const { token, password } = parsed.data;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const { rows } = await query<{ id: string; admin_id: string; expires_at: Date; used_at: Date | null }>(
    "SELECT id, admin_id, expires_at, used_at FROM admin_password_resets WHERE token_hash = $1",
    [tokenHash]
  );
  const row = rows[0];
  if (!row) return res.status(400).json({ error: "Invalid or expired reset link." });
  if (row.used_at) return res.status(400).json({ error: "This reset link has already been used." });
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ error: "This reset link has expired." });
  }

  const hash = await bcrypt.hash(password, 10);
  await query("UPDATE admin_users SET password_hash = $1, updated_at = now() WHERE id = $2", [
    hash,
    row.admin_id,
  ]);
  await query("UPDATE admin_password_resets SET used_at = now() WHERE id = $1", [row.id]);
  res.json({ ok: true });
});

// ---------------- Verify reset token (for UI) ----------------
authRouter.get("/reset/verify", async (req, res) => {
  const token = String(req.query.token || "");
  if (!token) return res.status(400).json({ valid: false });
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const { rows } = await query<{ expires_at: Date; used_at: Date | null }>(
    "SELECT expires_at, used_at FROM admin_password_resets WHERE token_hash = $1",
    [tokenHash]
  );
  const row = rows[0];
  if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
    return res.json({ valid: false });
  }
  res.json({ valid: true });
});

// ---------------- Update password (logged-in) ----------------
const updatePwSchema = z.object({ password: z.string().min(8).max(200) });

authRouter.post("/update-password", requireAdmin, async (req: AuthedRequest, res) => {
  const parsed = updatePwSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Password must be at least 8 characters." });
  const hash = await bcrypt.hash(parsed.data.password, 10);
  await query("UPDATE admin_users SET password_hash = $1, updated_at = now() WHERE id = $2", [
    hash,
    req.admin!.id,
  ]);
  res.json({ ok: true });
});
