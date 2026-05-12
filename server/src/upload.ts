import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { v4 as uuid } from "uuid";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";
export const PUBLIC_UPLOAD_BASE =
  process.env.PUBLIC_UPLOAD_BASE || "https://worldjumperbd.com/uploads";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf"]);
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const ALLOWED_CATEGORIES = new Set([
  "logo",
  "banners",
  "packages",
  "visa-countries",
  "umrah",
  "medical-tourism",
  "documents",
  "misc",
]);

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, _file, cb) {
    const cat = ALLOWED_CATEGORIES.has(String(req.query.category || ""))
      ? String(req.query.category)
      : "misc";
    const dest = path.join(UPLOAD_DIR, cat);
    ensureDir(dest);
    cb(null, dest);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuid()}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXT.has(ext) || !ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});

export function publicUrlFor(category: string, filename: string): string {
  const cat = ALLOWED_CATEGORIES.has(category) ? category : "misc";
  return `${PUBLIC_UPLOAD_BASE}/${cat}/${filename}`;
}
