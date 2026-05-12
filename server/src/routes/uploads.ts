import { Router } from "express";
import path from "node:path";
import { query } from "../db.js";
import { requireAdmin, type AuthedRequest } from "../auth.js";
import { upload, publicUrlFor } from "../upload.js";

export const uploadsRouter = Router();

uploadsRouter.post("/", requireAdmin, upload.single("file"), async (req: AuthedRequest, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });
  const category = String(req.query.category || "misc");
  const url = publicUrlFor(category, file.filename);
  await query(
    `INSERT INTO uploaded_files (original_name, stored_path, public_url, mime_type, size_bytes, uploaded_by)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [file.originalname, path.relative(process.cwd(), file.path), url, file.mimetype, file.size, req.admin?.id ?? null]
  );
  res.json({ url, filename: file.filename, category });
});
