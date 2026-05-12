import { Router } from "express";
import bcrypt from "bcryptjs";
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

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 60_000,
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
