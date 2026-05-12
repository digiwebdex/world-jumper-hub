import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

export const visaRequirementsRouter = Router();

const TEXT_FIELDS = [
  "required_documents", "passport_requirement", "photo_requirement",
  "nid_or_birth_certificate", "bank_statement", "bank_solvency",
  "job_certificate", "trade_license", "student_id", "invitation_letter",
  "medical_documents", "hotel_booking", "air_ticket_booking", "travel_itinerary",
  "processing_time", "embassy_fee", "service_charge", "important_notes", "eligibility_notes",
] as const;

const schema = z.object({
  country_id: z.string().uuid(),
  visa_type: z.string().trim().min(1).max(80),
  is_active: z.boolean().default(true),
  ...Object.fromEntries(TEXT_FIELDS.map((f) => [f, z.string().max(5000).nullable().optional()])),
});

visaRequirementsRouter.get("/", async (req, res) => {
  const countryId = req.query.country_id as string | undefined;
  const where: string[] = ["is_active = true"];
  const params: unknown[] = [];
  if (countryId) {
    params.push(countryId);
    where.push(`country_id = $${params.length}`);
  }
  const { rows } = await query(
    `SELECT * FROM visa_requirements WHERE ${where.join(" AND ")} ORDER BY visa_type`,
    params
  );
  res.json({ requirements: rows });
});

visaRequirementsRouter.get("/all", requireAdmin, async (_req, res) => {
  const { rows } = await query("SELECT * FROM visa_requirements ORDER BY created_at DESC");
  res.json({ requirements: rows });
});

const cols = ["country_id", "visa_type", ...TEXT_FIELDS, "is_active"];

visaRequirementsRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data as Record<string, unknown>;
  const values = cols.map((c) => d[c] ?? null);
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  const { rows } = await query(
    `INSERT INTO visa_requirements (${cols.join(", ")}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  res.json({ requirement: rows[0] });
});

visaRequirementsRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data as Record<string, unknown>;
  const set = cols.map((c, i) => `${c} = $${i + 1}`).join(", ");
  const values = cols.map((c) => d[c] ?? null);
  values.push(req.params.id);
  const { rows } = await query(
    `UPDATE visa_requirements SET ${set}, updated_at=now() WHERE id=$${values.length} RETURNING *`,
    values
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json({ requirement: rows[0] });
});

visaRequirementsRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM visa_requirements WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});
