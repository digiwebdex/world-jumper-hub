import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

export const visaServicesRouter = Router();

const schema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
  number: z.string().trim().max(20).default(""),
  title: z.string().trim().min(1).max(200),
  short_title: z.string().trim().max(200).default(""),
  tagline: z.string().trim().max(500).default(""),
  summary: z.string().max(2000).default(""),
  icon: z.string().trim().max(80).default("Globe2"),
  intro: z.string().max(10000).default(""),
  highlights: z.array(z.string()).default([]),
  process: z.array(z.object({ step: z.string(), detail: z.string() })).default([]),
  who_is_it_for: z.array(z.string()).default([]),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  display_order: z.number().int().default(0),
  published: z.boolean().default(true),
});

const SELECT = `
  SELECT id, slug, number, title, short_title, tagline, summary, icon, intro,
         highlights, process, who_is_it_for, faqs, display_order,
         is_published AS published, created_at, updated_at
    FROM visa_services
`;

visaServicesRouter.get("/", async (req, res) => {
  const includeUnpublished = req.query.all === "1";
  const where = includeUnpublished ? "" : "WHERE is_published = true";
  const { rows } = await query(`${SELECT} ${where} ORDER BY display_order ASC`);
  res.json({ services: rows });
});

visaServicesRouter.get("/by-slug/:slug", async (req, res) => {
  const { rows } = await query(
    `${SELECT} WHERE slug = $1 AND is_published = true LIMIT 1`,
    [req.params.slug]
  );
  res.json({ service: rows[0] ?? null });
});

visaServicesRouter.get("/:id", requireAdmin, async (req, res) => {
  const { rows } = await query(`${SELECT} WHERE id = $1 LIMIT 1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json({ service: rows[0] });
});

visaServicesRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data;
  const { rows } = await query(
    `INSERT INTO visa_services
       (slug, number, title, short_title, tagline, summary, icon, intro,
        highlights, process, who_is_it_for, faqs, display_order, is_published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12::jsonb,$13,$14)
     RETURNING id`,
    [
      d.slug, d.number, d.title, d.short_title, d.tagline, d.summary, d.icon, d.intro,
      JSON.stringify(d.highlights), JSON.stringify(d.process),
      JSON.stringify(d.who_is_it_for), JSON.stringify(d.faqs),
      d.display_order, d.published,
    ]
  );
  res.json({ id: rows[0].id });
});

visaServicesRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data;
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  const push = (col: string, val: unknown, cast = "") => {
    fields.push(`${col} = $${i}${cast}`); values.push(val); i++;
  };
  if (d.slug !== undefined) push("slug", d.slug);
  if (d.number !== undefined) push("number", d.number);
  if (d.title !== undefined) push("title", d.title);
  if (d.short_title !== undefined) push("short_title", d.short_title);
  if (d.tagline !== undefined) push("tagline", d.tagline);
  if (d.summary !== undefined) push("summary", d.summary);
  if (d.icon !== undefined) push("icon", d.icon);
  if (d.intro !== undefined) push("intro", d.intro);
  if (d.highlights !== undefined) push("highlights", JSON.stringify(d.highlights), "::jsonb");
  if (d.process !== undefined) push("process", JSON.stringify(d.process), "::jsonb");
  if (d.who_is_it_for !== undefined) push("who_is_it_for", JSON.stringify(d.who_is_it_for), "::jsonb");
  if (d.faqs !== undefined) push("faqs", JSON.stringify(d.faqs), "::jsonb");
  if (d.display_order !== undefined) push("display_order", d.display_order);
  if (d.published !== undefined) push("is_published", d.published);
  if (!fields.length) return res.json({ ok: true });
  values.push(req.params.id);
  await query(
    `UPDATE visa_services SET ${fields.join(", ")}, updated_at = now() WHERE id = $${i}`,
    values
  );
  res.json({ ok: true });
});

visaServicesRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM visa_services WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});
