import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

export const partnersRouter = Router();

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  kind: z.enum(["airline", "hotel", "authority"]).default("airline"),
  country: z.string().trim().max(120).default(""),
  cc: z.string().trim().max(3).default("UN"),
  logo_url: z.string().trim().max(1000).nullable().optional(),
  link_url: z.string().trim().max(1000).nullable().optional(),
  display_order: z.number().int().default(0),
  published: z.boolean().default(true),
});

const SELECT = `
  SELECT id, name, kind, country, cc, logo_url, link_url, display_order,
         is_published AS published, created_at, updated_at
    FROM partners
`;

partnersRouter.get("/", async (req, res) => {
  const includeUnpublished = req.query.all === "1";
  const where = includeUnpublished ? "" : "WHERE is_published = true";
  const { rows } = await query(`${SELECT} ${where} ORDER BY display_order ASC`);
  res.json({ partners: rows });
});

partnersRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data;
  const { rows } = await query(
    `INSERT INTO partners (name, kind, country, cc, logo_url, link_url, display_order, is_published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [d.name, d.kind, d.country, d.cc.toUpperCase(), d.logo_url ?? null, d.link_url ?? null, d.display_order, d.published]
  );
  res.json({ id: rows[0].id });
});

partnersRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data;
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  const push = (col: string, val: unknown) => { fields.push(`${col} = $${i++}`); values.push(val); };
  if (d.name !== undefined) push("name", d.name);
  if (d.kind !== undefined) push("kind", d.kind);
  if (d.country !== undefined) push("country", d.country);
  if (d.cc !== undefined) push("cc", d.cc.toUpperCase());
  if (d.logo_url !== undefined) push("logo_url", d.logo_url);
  if (d.link_url !== undefined) push("link_url", d.link_url);
  if (d.display_order !== undefined) push("display_order", d.display_order);
  if (d.published !== undefined) push("is_published", d.published);
  if (!fields.length) return res.json({ ok: true });
  values.push(req.params.id);
  await query(
    `UPDATE partners SET ${fields.join(", ")}, updated_at = now() WHERE id = $${i}`,
    values
  );
  res.json({ ok: true });
});

partnersRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM partners WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});
