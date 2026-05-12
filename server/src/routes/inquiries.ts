import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

export const inquiriesRouter = Router();

const STATUSES = ["New", "Contacted", "Processing", "Completed", "Cancelled"] as const;

const createSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  mobile_number: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(200).nullable().optional().or(z.literal("")),
  service_type: z.string().max(120).nullable().optional(),
  destination_country: z.string().max(120).nullable().optional(),
  journey_from: z.string().max(120).nullable().optional(),
  journey_to: z.string().max(120).nullable().optional(),
  departure_date: z.string().max(40).nullable().optional(),
  return_date: z.string().max(40).nullable().optional(),
  travel_date: z.string().max(40).nullable().optional(),
  passengers: z.string().max(120).nullable().optional(),
  message: z.string().max(2000).nullable().optional(),
  source_page: z.string().max(120).nullable().optional(),
});

const submitLimiter = rateLimit({ windowMs: 60_000, max: 5, standardHeaders: true, legacyHeaders: false });

const cols = [
  "full_name", "mobile_number", "email", "service_type", "destination_country",
  "journey_from", "journey_to", "departure_date", "return_date", "travel_date",
  "passengers", "message", "source_page",
];

inquiriesRouter.post("/", submitLimiter, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const d = parsed.data as Record<string, unknown>;
  const values = cols.map((c) => {
    const v = d[c];
    return v === "" ? null : (v ?? null);
  });
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  await query(
    `INSERT INTO inquiries (${cols.join(", ")}, status) VALUES (${placeholders}, 'New')`,
    values
  );
  res.json({ ok: true });
});

inquiriesRouter.get("/", requireAdmin, async (_req, res) => {
  const { rows } = await query("SELECT * FROM inquiries ORDER BY created_at DESC");
  res.json({ inquiries: rows });
});

inquiriesRouter.patch("/:id", requireAdmin, async (req, res) => {
  const status = String(req.body.status || "");
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return res.status(400).json({ error: "Invalid status" });
  }
  await query("UPDATE inquiries SET status=$1, updated_at=now() WHERE id=$2", [status, req.params.id]);
  res.json({ ok: true });
});

inquiriesRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM inquiries WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});
