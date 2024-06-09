import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { incomes } from "../db/schema/incomes.ts";
import { db } from "../db/db";

export const income = new Hono().basePath("v1/income");
export const incomeAuth = new Hono().basePath("auth/v1/income");

export const DATEVALUES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const incomeSchema = z.object({
  amount: z.number(),
  monthOfTheYear: z.enum(DATEVALUES),
  year: z.number(),
});

incomeAuth.get("/all", async (c) => {
  const userId = Number(c.req.header("userId"));
  try {
    const incomeRows = await db.query.incomes.findFirst({
      where: eq(incomes.userId, userId),
    });

    if (incomeRows) {
      return c.json({ data: incomeRows }, 201);
    } else {
      return c.json({ message: "Nothing found" }, 404);
    }
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});

incomeAuth.post(
  "/add",
  zValidator("json", incomeSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),

  async (c) => {
    const body = await c.req.json();
    const userId = Number(c.req.header("userId"));
    try {
      //find out if there is a way to do this in your database by using some constraint and then catching an error code
      const incomeForMonth = await db.query.incomes.findFirst({
        where: and(
          eq(incomes.userId, userId),
          eq(incomes.year, body.year),
          eq(incomes.monthOfTheYear, body.monthOfTheYear),
        ),
      });

      if (incomeForMonth) {
        return c.json(
          {
            error: `Income already exists for month ${body.monthOfTheYear} in ${body.year}`,
          },
          400,
        );
      }

      await db.insert(incomes).values({
        amount: body.amount,
        userId: userId,
        monthOfTheYear: body.monthOfTheYear,
        year: body.year,
      });
      return c.json({ message: `Income added for user` }, 201);
    } catch (err) {
      return c.json({ message: "An error occured, try again", error: err });
    }
  },
);
