import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { expenditures, categories } from "../db/schema/expenditures";
import { db } from "../db/db";
import { DATEVALUES } from "./income";

export const expenditure = new Hono().basePath("v1/expenditure");
export const expenditureAuth = new Hono().basePath("auth/v1/expenditure");

const VALUES = ["budget", "expenses"] as const;

const expenditureSchema = z.object({
  amount: z.number(),
  monthOfTheYear: z.enum(DATEVALUES),
  year: z.number(),
  type: z.enum(VALUES),
  categoriesId: z.number(),
});

expenditure.get("/categories", async (c) => {
  try {
    const expenditureCategories = await db.select().from(categories);
    return c.json({ data: expenditureCategories }, 201);
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});

expenditureAuth.post(
  "/add",
  zValidator("json", expenditureSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    const body = await c.req.json();
    const userId = Number(c.req.header("userId"));

    try {
      await db.insert(expenditures).values({
        amount: body.amount,
        userId: userId,
        monthOfTheYear: body.monthOfTheYear,
        year: body.year,
        type: body.type,
        categoriesId: body.categoriesId,
      });
      return c.json({ message: `${body.type} added for user` }, 201);
    } catch (err) {
      return c.json({ message: "An error occured, try again", error: err });
    }
  },
);
