import { Router } from "express";
import { z } from "zod";
import { mountListTable } from "../cms-list.js";

export const servicesFaqsRouter = Router();

// Services items
const itemsRouter = Router();
mountListTable(itemsRouter, {
  table: "services_items",
  columns: ["title", "description", "icon", "link"],
  schema: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(800),
    icon: z.string().max(60).default("Stamp"),
    link: z.string().max(500).default("/"),
  }),
});
servicesFaqsRouter.use("/items", itemsRouter);

// FAQs
const faqsRouter = Router();
mountListTable(faqsRouter, {
  table: "faqs",
  columns: ["question", "answer", "category"],
  schema: z.object({
    question: z.string().min(1).max(500),
    answer: z.string().min(1).max(4000),
    category: z.string().max(120).default("General"),
  }),
});
servicesFaqsRouter.use("/faqs", faqsRouter);
