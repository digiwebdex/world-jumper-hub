import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

export const siteSettingsRouter = Router();

const FIELDS = [
  "company_name", "brand_name", "license_no", "primary_phone", "secondary_phone",
  "other_phones", "whatsapp_number", "whatsapp_message", "email", "address", "memberships",
  "logo_url", "banner_url", "facebook_url", "instagram_url", "linkedin_url",
  "youtube_url", "website_url", "footer_about_text",
] as const;

const settingsSchema = z.object(
  Object.fromEntries(FIELDS.map((f) => [f, z.string().max(2000).nullable().optional()])) as Record<
    (typeof FIELDS)[number],
    z.ZodOptional<z.ZodNullable<z.ZodString>>
  >
);

siteSettingsRouter.get("/", async (_req, res) => {
  const { rows } = await query("SELECT * FROM site_settings WHERE id = 1");
  res.json({ settings: rows[0] ?? null });
});

siteSettingsRouter.put("/", requireAdmin, async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });
  const data = parsed.data;
  const cols = FIELDS.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const values = FIELDS.map((f) => (data[f] ?? null));
  await query(
    `INSERT INTO site_settings (id, ${FIELDS.join(", ")}, updated_at)
     VALUES (1, ${FIELDS.map((_, i) => `$${i + 1}`).join(", ")}, now())
     ON CONFLICT (id) DO UPDATE SET ${cols}, updated_at = now()`,
    values
  );
  const { rows } = await query("SELECT * FROM site_settings WHERE id = 1");
  res.json({ settings: rows[0] });
});
