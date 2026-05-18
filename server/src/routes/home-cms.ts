import { Router } from "express";
import { z } from "zod";
import { mountListTable, mountSingleton } from "../cms-list.js";

export const homeCmsRouter = Router();

// Hero (singleton id=1)
const heroRouter = Router();
mountSingleton(heroRouter, "home_hero",
  ["kicker", "headline", "highlight_word", "subheadline", "background_image_url",
   "primary_cta_label", "primary_cta_link", "secondary_cta_label", "secondary_cta_link"],
  z.object({
    kicker: z.string().max(300).nullable().optional(),
    headline: z.string().max(300).nullable().optional(),
    highlight_word: z.string().max(120).nullable().optional(),
    subheadline: z.string().max(600).nullable().optional(),
    background_image_url: z.string().max(1000).nullable().optional(),
    primary_cta_label: z.string().max(120).nullable().optional(),
    primary_cta_link: z.string().max(500).nullable().optional(),
    secondary_cta_label: z.string().max(120).nullable().optional(),
    secondary_cta_link: z.string().max(500).nullable().optional(),
  })
);
homeCmsRouter.use("/hero", heroRouter);

// Stats
const statsRouter = Router();
mountListTable(statsRouter, {
  table: "home_stats",
  columns: ["label", "value", "suffix"],
  schema: z.object({
    label: z.string().min(1).max(120),
    value: z.string().min(1).max(60),
    suffix: z.string().max(30).default(""),
  }),
});
homeCmsRouter.use("/stats", statsRouter);

// Services
const svcRouter = Router();
mountListTable(svcRouter, {
  table: "home_services",
  columns: ["title", "description", "icon", "link", "accent"],
  schema: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(800),
    icon: z.string().max(60).default("Stamp"),
    link: z.string().max(500).default("/"),
    accent: z.string().max(30).default("orange"),
  }),
});
homeCmsRouter.use("/services", svcRouter);

// Destinations
const destRouter = Router();
mountListTable(destRouter, {
  table: "home_destinations",
  columns: ["name", "tag", "image_url", "link"],
  schema: z.object({
    name: z.string().min(1).max(120),
    tag: z.string().max(120).default(""),
    image_url: z.string().min(1).max(1000),
    link: z.string().max(500).default("/visa"),
  }),
});
homeCmsRouter.use("/destinations", destRouter);

// Testimonials
const testRouter = Router();
mountListTable(testRouter, {
  table: "home_testimonials",
  columns: ["name", "trip", "quote", "photo_url", "rating"],
  schema: z.object({
    name: z.string().min(1).max(120),
    trip: z.string().max(200).default(""),
    quote: z.string().min(1).max(2000),
    photo_url: z.string().max(1000).nullable().optional(),
    rating: z.number().int().min(1).max(5).default(5),
  }),
});
homeCmsRouter.use("/testimonials", testRouter);

// Why choose us
const whyRouter = Router();
mountListTable(whyRouter, {
  table: "home_why_choose_us",
  columns: ["title", "description", "icon"],
  schema: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(800),
    icon: z.string().max(60).default("ShieldCheck"),
  }),
});
homeCmsRouter.use("/why-us", whyRouter);

// Quick tabs (hero search tabs)
const tabsRouter = Router();
mountListTable(tabsRouter, {
  table: "home_quick_tabs",
  columns: ["tab_key", "label", "icon", "link", "placeholder"],
  schema: z.object({
    tab_key: z.string().min(1).max(60),
    label: z.string().min(1).max(60),
    icon: z.string().min(1).max(60),
    link: z.string().min(1).max(500),
    placeholder: z.string().max(300).default(""),
  }),
});
homeCmsRouter.use("/quick-tabs", tabsRouter);
