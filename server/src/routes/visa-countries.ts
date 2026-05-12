import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

export const visaCountriesRouter = Router();

const schema = z.object({
  country_name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
  flag_url: z.string().trim().max(500).nullable().optional(),
  short_description: z.string().trim().max(2000).nullable().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

visaCountriesRouter.get("/", async (req, res) => {
  const featured = req.query.featured === "1";
  const where: string[] = ["is_active = true"];
  if (featured) where.push("is_featured = true");
  const { rows } = await query(
    `SELECT * FROM visa_countries WHERE ${where.join(" AND ")} ORDER BY country_name`
  );
  res.json({ countries: rows });
});

visaCountriesRouter.get("/all", requireAdmin, async (_req, res) => {
  const { rows } = await query("SELECT * FROM visa_countries ORDER BY country_name");
  res.json({ countries: rows });
});

visaCountriesRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data;
  const { rows } = await query(
    `INSERT INTO visa_countries (country_name, slug, flag_url, short_description, is_featured, is_active)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [d.country_name, d.slug, d.flag_url ?? null, d.short_description ?? null, d.is_featured, d.is_active]
  );
  res.json({ country: rows[0] });
});

visaCountriesRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data;
  const { rows } = await query(
    `UPDATE visa_countries SET country_name=$1, slug=$2, flag_url=$3, short_description=$4, is_featured=$5, is_active=$6, updated_at=now()
     WHERE id=$7 RETURNING *`,
    [d.country_name, d.slug, d.flag_url ?? null, d.short_description ?? null, d.is_featured, d.is_active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json({ country: rows[0] });
});

visaCountriesRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM visa_countries WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});
