import { Router } from "express";
import { z } from "zod";
import { mountListTable } from "../cms-list.js";

export const navFooterRouter = Router();

// Nav menu
const navRouter = Router();
mountListTable(navRouter, {
  table: "nav_menu",
  columns: ["label", "url", "parent_id", "opens_new_tab"],
  schema: z.object({
    label: z.string().min(1).max(120),
    url: z.string().min(1).max(500),
    parent_id: z.string().uuid().nullable().optional(),
    opens_new_tab: z.boolean().default(false),
  }),
});
navFooterRouter.use("/nav", navRouter);

// Footer links
const footerRouter = Router();
mountListTable(footerRouter, {
  table: "footer_links",
  columns: ["label", "url", "column_group"],
  schema: z.object({
    label: z.string().min(1).max(120),
    url: z.string().min(1).max(500),
    column_group: z.string().max(60).default("Explore"),
  }),
});
navFooterRouter.use("/footer", footerRouter);
