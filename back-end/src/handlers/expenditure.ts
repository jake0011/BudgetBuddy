import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  expenditures,
  categories,
} from "../db/schema/expenditures";
import { db } from "../db/db";

export const expenditure = new Hono().basePath("v1/expenditure");
export const expenditureAuth = new Hono().basePath("auth/v1/expenditure");

const VALUES = ["budget", "expenses"] as const;

const expenditureSchema = z.object({
  amount: z.number(),
  monthOfTheYear: z.enum(VALUES),
  year: z.number(),
});

expenditure.get("/categories", async (c) => {
  try {
    const expenditureCategories = await db.select().from(categories);
    return c.json({ data: expenditureCategories }, 201);

  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});
