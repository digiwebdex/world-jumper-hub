import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../src/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const dir = path.resolve(__dirname, "../migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), "utf8");
    console.log(`[migrate] running ${f}`);
    await pool.query(sql);
  }
  console.log("[migrate] done");
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
