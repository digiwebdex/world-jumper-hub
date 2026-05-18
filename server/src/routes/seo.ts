import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

export const seoRouter = Router();

const SELECT = `SELECT id, page_key, title, description, og_image, noindex, updated_at FROM page_seo`;

// Public: list all rows (used by admin too — content is non-sensitive)
seoRouter.get("/", async (_req, res) => {
  const { rows } = await query(`${SELECT} ORDER BY page_key ASC`);
  res.json({ rows });
});

// Public: fetch single page meta by key (used by site at runtime)
seoRouter.get("/:key", async (req, res) => {
  const { rows } = await query(`${SELECT} WHERE page_key = $1 LIMIT 1`, [req.params.key]);
  res.json({ row: rows[0] ?? null });
});

const schema = z.object({
  title: z.string().max(200).default(""),
  description: z.string().max(500).default(""),
  og_image: z.string().max(1000).default(""),
  noindex: z.boolean().default(false),
});

// Admin: upsert by page_key
seoRouter.put("/:key", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const { title, description, og_image, noindex } = parsed.data;
  const key = String(req.params.key).slice(0, 100);
  await query(
    `INSERT INTO page_seo (page_key, title, description, og_image, noindex)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (page_key) DO UPDATE
     SET title = EXCLUDED.title,
         description = EXCLUDED.description,
         og_image = EXCLUDED.og_image,
         noindex = EXCLUDED.noindex,
         updated_at = now()`,
    [key, title, description, og_image, noindex]
  );
  res.json({ ok: true });
});
