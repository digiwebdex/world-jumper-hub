import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs";

import { authRouter } from "./routes/auth.js";
import { siteSettingsRouter } from "./routes/site-settings.js";
import { visaCountriesRouter } from "./routes/visa-countries.js";
import { visaRequirementsRouter } from "./routes/visa-requirements.js";
import { packagesRouter } from "./routes/packages.js";
import { inquiriesRouter } from "./routes/inquiries.js";
import { uploadsRouter } from "./routes/uploads.js";
import { membershipsRouter } from "./routes/memberships.js";
import { partnersRouter } from "./routes/partners.js";
import { visaServicesRouter } from "./routes/visa-services.js";
import { homeCmsRouter } from "./routes/home-cms.js";
import { aboutCmsRouter } from "./routes/about-cms.js";
import { servicesFaqsRouter } from "./routes/services-faqs.js";
import { navFooterRouter } from "./routes/nav-footer.js";
import { seoRouter } from "./routes/seo.js";
import { blogRouter } from "./routes/blog.js";

const app = express();
const PORT = Number(process.env.PORT || 3001);
const APP_URL = process.env.APP_URL || "http://localhost:5173";
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./public/uploads");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: [APP_URL, "http://localhost:5173"], credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// In dev / single-server prod we expose /uploads. In Nginx VPS prod, Nginx serves it directly.
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "30d" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/site-settings", siteSettingsRouter);
app.use("/api/visa-countries", visaCountriesRouter);
app.use("/api/visa-requirements", visaRequirementsRouter);
app.use("/api/packages", packagesRouter);
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/admin/uploads", uploadsRouter);
app.use("/api/memberships", membershipsRouter);
app.use("/api/partners", partnersRouter);
app.use("/api/visa-services", visaServicesRouter);
app.use("/api/home", homeCmsRouter);
app.use("/api/about", aboutCmsRouter);
app.use("/api/services", servicesFaqsRouter);
app.use("/api/nav-footer", navFooterRouter);
app.use("/api/seo", seoRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
