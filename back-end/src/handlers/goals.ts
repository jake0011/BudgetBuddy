import { Hono } from "hono";
import { eq, and, or } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { goals } from "../db/schema/goals.ts";
import { db } from "../db/db";

export const goal = new Hono().basePath("v1/goal");
export const goalAuth = new Hono().basePath("auth/v1/goal");

const goalSchema = z.object({
  title: z.string().max(40),
  description: z.string().optional(),
  amount: z.number(),
});

const updateGoalSchema = z.object({
  title: z.string().max(40).optional(),
  description: z.string().optional(),
  amount: z.number().optional(),
  goalsId: z.number(),
});

const deleteGoalSchema = z.object({
  goalsId: z.number(),
});

goalAuth.get("/all", async (c) => {
  const userId = Number(c.req.header("userId"));
  try {
    const goalRows = await db.query.goals.findMany({
      where: eq(goals.userId, userId),
    });

    if (goalRows) {
      return c.json({ data: goalRows }, 201);
    } else {
      return c.json({ message: "Nothing found" }, 404);
    }
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});

goalAuth.post(
  "/add",
  zValidator("json", goalSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    const body = await c.req.json();
    const userId = Number(c.req.header("userId"));

    try {
      await db.insert(goals).values({
        userId: userId,
        title: body.title,
        description: body.description,
        amount: body.amount,
      });
      return c.json({ message: `Goal added for user ${userId}` }, 201);
    } catch (err) {
      return c.json({ message: "An error occured, try again", error: err });
    }
  }
);

goalAuth.patch(
  "/update",
  zValidator("json", updateGoalSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    const userId = Number(c.req.header("userId"));
    try {
      const body = await c.req.json();

      await db.update(goals).set({
          title: body.title,
          description: body.description,
          amount: body.amount,
        })
        .where(
          and(
            eq(goals.userId, userId),
            eq(goals.goalsId, body.goalsId)
          )
        );
      const goalRow = await db.query.goals.findFirst({
        where: or(
          eq(goals.goalsId, body.goalsId),
        ),
      });
      if (!goalRow) {
        return c.json({ error: "Goal does not exist" }, 404);
      } else {
        return c.json(
          {
            message: `Goal ${goalRow.goalsId} updated successfully`,
            data: goalRow,
          },
          201
        );
      }
    } catch (err) {
      return c.json({ error: "An error occured, try again", message: err });
    }
  }
);

goalAuth.delete(
  "/delete",
  zValidator("json", deleteGoalSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    const userId = Number(c.req.header("userId"));
    const body = await c.req.json();

    const goalsRows = await db.query.expenditures.findMany({
      where: eq(goals.userId, userId),
    });

    if (!userId) {
      return c.json({ error: "User does not exist" }, 404);
    } else if (!goalsRows) {
      return c.json({ error: "No goals specified" }, 400);
    } else {
      try {        
          const goalRow = await db.delete(goals)
            .where(eq(goals.goalsId, body.goalsId))
            .returning({
              title: goals.title
            })

        return c.json(
          {
            message: `Goal '${goalRow[0].title}' deleted successfully`,
          },
          404
        );
      } catch (err: any) {
        return c.json(
          { error: "Goal does not exist", message: err },
          404
        );
      }
    }
  }
);