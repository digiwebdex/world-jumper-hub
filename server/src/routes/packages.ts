import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

export const packagesRouter = Router();

const PACKAGE_TYPES = ["Tour", "Umrah", "Medical Tourism", "Air Ticket Offer"] as const;

const schema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9-]+$/),
  package_type: z.enum(PACKAGE_TYPES),
  destination: z.string().max(200).nullable().optional(),
  duration: z.string().max(120).nullable().optional(),
  price: z.string().max(120).nullable().optional(),
  short_description: z.string().max(2000).nullable().optional(),
  full_description: z.string().max(10000).nullable().optional(),
  included_services: z.string().max(5000).nullable().optional(),
  excluded_services: z.string().max(5000).nullable().optional(),
  image_url: z.string().max(500).nullable().optional(),
  gallery_urls: z.string().max(5000).nullable().optional(),
  brochure_url: z.string().max(500).nullable().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

const cols = [
  "title", "slug", "package_type", "destination", "duration", "price",
  "short_description", "full_description", "included_services", "excluded_services",
  "image_url", "gallery_urls", "brochure_url", "is_featured", "is_active",
];

packagesRouter.get("/", async (req, res) => {
  const where: string[] = ["is_active = true"];
  const params: unknown[] = [];
  if (req.query.type) {
    params.push(req.query.type);
    where.push(`package_type = $${params.length}`);
  }
  if (req.query.featured === "1") where.push("is_featured = true");
  const { rows } = await query(
    `SELECT * FROM packages WHERE ${where.join(" AND ")} ORDER BY is_featured DESC, created_at DESC`,
    params
  );
  res.json({ packages: rows });
});

packagesRouter.get("/all", requireAdmin, async (_req, res) => {
  const { rows } = await query("SELECT * FROM packages ORDER BY created_at DESC");
  res.json({ packages: rows });
});

packagesRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data as Record<string, unknown>;
  const values = cols.map((c) => d[c] ?? null);
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  const { rows } = await query(
    `INSERT INTO packages (${cols.join(", ")}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  res.json({ package: rows[0] });
});

packagesRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data as Record<string, unknown>;
  const set = cols.map((c, i) => `${c} = $${i + 1}`).join(", ");
  const values = cols.map((c) => d[c] ?? null);
  values.push(req.params.id);
  const { rows } = await query(
    `UPDATE packages SET ${set}, updated_at=now() WHERE id=$${values.length} RETURNING *`,
    values
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json({ package: rows[0] });
});

packagesRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM packages WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});
