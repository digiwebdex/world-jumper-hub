// Shared helper for "simple list" CMS tables:
// id uuid PK, ...content fields..., display_order int, is_active bool, timestamps.
// Mounts GET/POST/PUT/DELETE on a Router for one table.
import { Router } from "express";
import { z, ZodTypeAny } from "zod";
import { query } from "./db.js";
import { requireAdmin } from "./auth.js";

export interface ListTableConfig {
  table: string;
  // SELECT column list (without id/display_order/is_active/timestamps — those are auto-added)
  columns: string[];
  // zod schema for the editable payload (without display_order/is_active)
  schema: z.ZodObject<Record<string, ZodTypeAny>>;
}

export function mountListTable(router: Router, cfg: ListTableConfig) {
  const cols = [...cfg.columns, "display_order", "is_active"];
  const SELECT = `SELECT id, ${cols.join(", ")}, created_at, updated_at FROM ${cfg.table}`;
  const fullSchema = cfg.schema.extend({
    display_order: z.number().int().default(0),
    is_active: z.boolean().default(true),
  });

  router.get("/", async (req, res) => {
    const includeInactive = req.query.all === "1";
    const where = includeInactive ? "" : "WHERE is_active = true";
    const { rows } = await query(`${SELECT} ${where} ORDER BY display_order ASC, created_at ASC`);
    res.json({ rows });
  });

  router.post("/", requireAdmin, async (req, res) => {
    const parsed = fullSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const d = parsed.data as Record<string, unknown>;
    const insertCols = cols;
    const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
    const values = insertCols.map((c) => d[c] ?? null);
    const { rows } = await query(
      `INSERT INTO ${cfg.table} (${insertCols.join(", ")}) VALUES (${placeholders}) RETURNING id`,
      values
    );
    res.json({ id: rows[0].id });
  });

  router.put("/:id", requireAdmin, async (req, res) => {
    const parsed = fullSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const d = parsed.data as Record<string, unknown>;
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    for (const c of cols) {
      if (d[c] !== undefined) {
        fields.push(`${c} = $${i++}`);
        values.push(d[c]);
      }
    }
    if (!fields.length) return res.json({ ok: true });
    values.push(req.params.id);
    await query(
      `UPDATE ${cfg.table} SET ${fields.join(", ")}, updated_at = now() WHERE id = $${i}`,
      values
    );
    res.json({ ok: true });
  });

  router.delete("/:id", requireAdmin, async (req, res) => {
    await query(`DELETE FROM ${cfg.table} WHERE id = $1`, [req.params.id]);
    res.json({ ok: true });
  });
}

// For singleton config tables (id=1)
export function mountSingleton(
  router: Router,
  table: string,
  columns: string[],
  schema: z.ZodObject<Record<string, ZodTypeAny>>
) {
  const SELECT = `SELECT id, ${columns.join(", ")}, updated_at FROM ${table} WHERE id = 1`;

  router.get("/", async (_req, res) => {
    const { rows } = await query(SELECT);
    res.json({ data: rows[0] ?? null });
  });

  router.put("/", requireAdmin, async (req, res) => {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const d = parsed.data as Record<string, unknown>;
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    for (const c of columns) {
      if (d[c] !== undefined) {
        fields.push(`${c} = $${i++}`);
        values.push(d[c]);
      }
    }
    if (!fields.length) return res.json({ ok: true });
    // upsert
    const insertCols = ["id", ...columns];
    const insertVals = [1, ...columns.map((c) => d[c] ?? null)];
    const insertPlaceholders = insertCols.map((_, idx) => `$${idx + 1}`).join(", ");
    await query(
      `INSERT INTO ${table} (${insertCols.join(", ")}) VALUES (${insertPlaceholders})
       ON CONFLICT (id) DO UPDATE SET ${fields.join(", ")}, updated_at = now()`,
      [...insertVals, ...values].slice(0, insertVals.length).concat(values)
    );
    // simpler: just do plain UPDATE (row pre-seeded by migration)
    await query(
      `UPDATE ${table} SET ${fields.join(", ")}, updated_at = now() WHERE id = 1`,
      values
    );
    res.json({ ok: true });
  });
}
