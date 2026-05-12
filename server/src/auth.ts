import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { query } from "./db.js";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "wj_session";
const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-change-me";

export interface AdminPayload {
  sub: string;
  email: string;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export interface AuthedRequest extends Request {
  admin?: { id: string; email: string };
}

export async function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const token = (req as Request & { cookies?: Record<string, string> }).cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    const { rows } = await query<{ id: string; email: string; is_active: boolean }>(
      "SELECT id, email, is_active FROM admin_users WHERE id = $1",
      [decoded.sub]
    );
    const admin = rows[0];
    if (!admin || !admin.is_active) return res.status(401).json({ error: "Unauthorized" });
    req.admin = { id: admin.id, email: admin.email };
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export { COOKIE_NAME };
