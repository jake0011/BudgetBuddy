import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { incomes } from "../db/schema/incomes.ts";
import { db } from "../db/db";
import { goals } from "../db/schema/goals.ts";

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
  source: z.string(),
  monthOfTheYear: z.enum(DATEVALUES),
  year: z.number(),
});

const updateIncomeSchema = z.object({
  amount: z.number().optional(),
  source: z.string().optional(),
  monthOfTheYear: z.enum(DATEVALUES).optional(),
  year: z.number().optional(),
  incomesId: z.number(),
});

const deleteIncomeSchema = z.object({
  incomesId: z.number(),
});

incomeAuth.get("/all", async (c) => {
  const userId = Number(c.req.header("userId"));
  try {
    const incomeRows = await db.query.incomes.findMany({
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
          eq(incomes.monthOfTheYear, body.monthOfTheYear)
        ),
      });

      if (incomeForMonth) {
        return c.json(
          {
            error: `Income already exists for month ${body.monthOfTheYear} in ${body.year}`,
          },
          400
        );
      } else {
        await db.insert(incomes).values({
          amount: body.amount,
          userId: userId,
          monthOfTheYear: body.monthOfTheYear,
          year: body.year,
          source: body.source,
        });
      }
      return c.json({ message: `Income added for user` }, 201);
    } catch (err) {
      return c.json({ message: "An error occured, try again", error: err });
  };   
});

incomeAuth.patch(
  "/update",
  zValidator("json", updateIncomeSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    const userId = Number(c.req.header("userId"));
    const body = await c.req.json();

    try {
      await db.update(incomes).set({
          amount: body.amount,
          monthOfTheYear: body.monthOfTheYear,
          year: body.year,
          source: body.source,
        })
        .where(
          and(
            eq(incomes.userId, userId),
            eq(incomes.incomesId, body.incomesId)
          )
        );
          
      const incomeRow = await db.query.incomes.findFirst({
        where: and(
                eq(incomes.userId, userId),
                eq(incomes.incomesId, body.incomesId)
              )
      });
      return c.json(
        {
        message: `Income updated successfully`,
        data: incomeRow
        },
        201
      );
    } catch (err) {
      return c.json({ error: "An error occured, try again", message: err });
  }
});

interface deletedIncome {
  incomeId: number;
}

incomeAuth.delete(
  "/delete",
  zValidator("json", deleteIncomeSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    const userId = Number(c.req.header("userId"));
    const body = await c.req.json();

    const incomeRows = await db.query.incomes.findMany({
      where: eq(incomes.userId, userId),
    });

    if (!userId) {
      return c.json({ error: "User does not exist" }, 404);
    } else if (!incomeRows) {
      return c.json({ error: "No income specified" }, 400);
    } else {
      try {
        const deletedIncomeRow: deletedIncome[] = await db
          .delete(incomes)
          .where(eq(incomes.incomesId, body.incomesId))
          .returning({ incomeId: incomes.incomesId });

        return c.json(
          {
            message: `Income ${deletedIncomeRow[0].incomeId} deleted successfully`,
          },
          404
        );
      } catch (err: any) {
        return c.json({ error: "Income does not exist", message: err }, 404);
      }
    }
  }
);
