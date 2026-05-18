import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

function getTransport(): Transporter | null {
  if (cached) return cached;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  cached = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cached;
}

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  const tx = getTransport();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@worldjumper.com.bd";
  if (!tx) {
    // No SMTP configured — log so admins can still copy the link from server logs.
    console.warn("[mailer] SMTP not configured. Skipping send.");
    console.warn(`[mailer] TO: ${opts.to}`);
    console.warn(`[mailer] SUBJECT: ${opts.subject}`);
    console.warn(`[mailer] BODY:\n${opts.text || opts.html}`);
    return { skipped: true as const };
  }
  await tx.sendMail({ from, to: opts.to, subject: opts.subject, html: opts.html, text: opts.text });
  return { skipped: false as const };
}
