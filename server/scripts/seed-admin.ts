import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool, query } from "../src/db.js";

async function main() {
  const email = (process.env.ADMIN_EMAIL || "info@worldjumperbd.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@54321#";
  const hash = await bcrypt.hash(password, 12);

  const { rows } = await query<{ id: string }>(
    "SELECT id FROM admin_users WHERE email = $1",
    [email]
  );
  if (rows[0]) {
    await query("UPDATE admin_users SET password_hash=$1, is_active=true WHERE email=$2", [hash, email]);
    console.log(`[seed-admin] updated existing admin ${email}`);
  } else {
    await query("INSERT INTO admin_users (email, password_hash, is_active) VALUES ($1, $2, true)", [
      email,
      hash,
    ]);
    console.log(`[seed-admin] created admin ${email}`);
  }
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
