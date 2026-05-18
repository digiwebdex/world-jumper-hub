import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

export const membershipsRouter = Router();

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  logo_url: z.string().trim().max(1000).nullable().optional(),
  link_url: z.string().trim().max(1000).nullable().optional(),
  display_order: z.number().int().default(0),
  published: z.boolean().default(true),
});

const SELECT = `
  SELECT id, name, logo_url, link_url, display_order,
         is_published AS published, created_at, updated_at
    FROM memberships
`;

membershipsRouter.get("/", async (req, res) => {
  const includeUnpublished = req.query.all === "1";
  const where = includeUnpublished ? "" : "WHERE is_published = true";
  const { rows } = await query(`${SELECT} ${where} ORDER BY display_order ASC`);
  res.json({ memberships: rows });
});

membershipsRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data;
  const { rows } = await query(
    `INSERT INTO memberships (name, logo_url, link_url, display_order, is_published)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [d.name, d.logo_url ?? null, d.link_url ?? null, d.display_order, d.published]
  );
  res.json({ id: rows[0].id });
});

membershipsRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data;
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  const push = (col: string, val: unknown) => { fields.push(`${col} = $${i++}`); values.push(val); };
  if (d.name !== undefined) push("name", d.name);
  if (d.logo_url !== undefined) push("logo_url", d.logo_url);
  if (d.link_url !== undefined) push("link_url", d.link_url);
  if (d.display_order !== undefined) push("display_order", d.display_order);
  if (d.published !== undefined) push("is_published", d.published);
  if (!fields.length) return res.json({ ok: true });
  values.push(req.params.id);
  await query(
    `UPDATE memberships SET ${fields.join(", ")}, updated_at = now() WHERE id = $${i}`,
    values
  );
  res.json({ ok: true });
});

membershipsRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM memberships WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});
