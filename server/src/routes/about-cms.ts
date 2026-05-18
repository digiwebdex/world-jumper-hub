import { Router } from "express";
import { z } from "zod";
import { mountListTable, mountSingleton } from "../cms-list.js";

export const aboutCmsRouter = Router();

// About page (singleton)
const pageRouter = Router();
mountSingleton(pageRouter, "about_page",
  ["hero_kicker", "hero_eyebrow", "hero_title", "hero_subtitle", "hero_image_url",
   "founding_label", "founding_title", "story_paragraph_1", "story_paragraph_2",
   "quote_text", "quote_image_url"],
  z.object({
    hero_kicker: z.string().max(300).nullable().optional(),
    hero_eyebrow: z.string().max(120).nullable().optional(),
    hero_title: z.string().max(300).nullable().optional(),
    hero_subtitle: z.string().max(600).nullable().optional(),
    hero_image_url: z.string().max(1000).nullable().optional(),
    founding_label: z.string().max(200).nullable().optional(),
    founding_title: z.string().max(400).nullable().optional(),
    story_paragraph_1: z.string().max(4000).nullable().optional(),
    story_paragraph_2: z.string().max(4000).nullable().optional(),
    quote_text: z.string().max(2000).nullable().optional(),
    quote_image_url: z.string().max(1000).nullable().optional(),
  })
);
aboutCmsRouter.use("/page", pageRouter);

// Pillars
const pillarsRouter = Router();
mountListTable(pillarsRouter, {
  table: "about_pillars",
  columns: ["title", "body", "image_url"],
  schema: z.object({
    title: z.string().min(1).max(200),
    body: z.string().min(1).max(2000),
    image_url: z.string().max(1000).nullable().optional(),
  }),
});
aboutCmsRouter.use("/pillars", pillarsRouter);

// Team
const teamRouter = Router();
mountListTable(teamRouter, {
  table: "about_team",
  columns: ["name", "role", "bio", "photo_url"],
  schema: z.object({
    name: z.string().min(1).max(200),
    role: z.string().min(1).max(200),
    bio: z.string().max(2000).nullable().optional(),
    photo_url: z.string().max(1000).nullable().optional(),
  }),
});
aboutCmsRouter.use("/team", teamRouter);

// Stats
const statsRouter = Router();
mountListTable(statsRouter, {
  table: "about_stats",
  columns: ["label", "value", "suffix"],
  schema: z.object({
    label: z.string().min(1).max(120),
    value: z.string().min(1).max(60),
    suffix: z.string().max(30).default(""),
  }),
});
aboutCmsRouter.use("/stats", statsRouter);
