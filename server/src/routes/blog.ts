import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAdmin } from "../auth.js";

export const blogRouter = Router();

const COLS = `id, slug, title, excerpt, body, cover_image, author, category,
              is_published, published_at, display_order, created_at, updated_at`;

// Public list — published only
blogRouter.get("/", async (req, res) => {
  const all = req.query.all === "1";
  if (all) {
    // admin-only listing of every post
    const { rows } = await query(
      `SELECT ${COLS} FROM blog_posts ORDER BY COALESCE(published_at, created_at) DESC`
    );
    return res.json({ rows });
  }
  const { rows } = await query(
    `SELECT ${COLS} FROM blog_posts
     WHERE is_published = true AND (published_at IS NULL OR published_at <= now())
     ORDER BY display_order ASC, published_at DESC NULLS LAST, created_at DESC`
  );
  res.json({ rows });
});

// Public: single post by slug
blogRouter.get("/slug/:slug", async (req, res) => {
  const { rows } = await query(
    `SELECT ${COLS} FROM blog_posts WHERE slug = $1 LIMIT 1`,
    [req.params.slug]
  );
  if (!rows[0]) return res.status(404).json({ error: "Post not found" });
  const post = rows[0];
  if (!post.is_published) return res.status(404).json({ error: "Post not found" });
  res.json({ row: post });
});

// Admin: single by id (for editor)
blogRouter.get("/:id", requireAdmin, async (req, res) => {
  const { rows } = await query(`SELECT ${COLS} FROM blog_posts WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json({ row: rows[0] });
});

const schema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes only"),
  title: z.string().min(1).max(300),
  excerpt: z.string().max(1000).default(""),
  body: z.string().default(""),
  cover_image: z.string().max(1000).default(""),
  author: z.string().max(120).default("World Jumper"),
  category: z.string().max(80).default("General"),
  is_published: z.boolean().default(false),
  published_at: z.string().nullable().optional(),
  display_order: z.number().int().default(0),
});

blogRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data;
  const { rows } = await query(
    `INSERT INTO blog_posts (slug, title, excerpt, body, cover_image, author, category,
                             is_published, published_at, display_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
    [d.slug, d.title, d.excerpt, d.body, d.cover_image, d.author, d.category,
     d.is_published, d.published_at || null, d.display_order]
  );
  res.json({ id: rows[0].id });
});

blogRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const d = parsed.data as Record<string, unknown>;
  const keys = Object.keys(d);
  if (!keys.length) return res.json({ ok: true });
  const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
  await query(
    `UPDATE blog_posts SET ${sets}, updated_at = now() WHERE id = $1`,
    [req.params.id, ...keys.map((k) => d[k])]
  );
  res.json({ ok: true });
});

blogRouter.delete("/:id", requireAdmin, async (req, res) => {
  await query(`DELETE FROM blog_posts WHERE id = $1`, [req.params.id]);
  res.json({ ok: true });
});
