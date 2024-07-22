import { Hono } from "hono";
import { eq, and, or, ne, asc } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { expenditures, categories } from "../db/schema/expenditures";
import { db } from "../db/db";
import { DATEVALUES } from "./income";
import { goals } from "../db/schema/goals";
import { goal } from "./goals";

export const expenditure = new Hono().basePath("v1/expenditure");
export const expenditureAuth = new Hono().basePath("auth/v1/expenditure");

const VALUES = ["budget", "expenses"] as const;

const expenditureSchema = z.object({
  amount: z.number(),
  monthOfTheYear: z.enum(DATEVALUES),
  year: z.number(),
  type: z.enum(VALUES),
  goalsId: z.number().optional(),
  categoriesId: z.number(),
});

const updateExpenditureSchema = z.object({
  expendituresId: z.number(),
  amount: z.number().optional(),
  monthOfTheYear: z.enum(DATEVALUES).optional(),
  year: z.number().optional(),
  type: z.enum(VALUES),
  goalsId: z.number().optional(),
  categoriesId: z.number().optional(),
});

const deleteExpenditureSchema = z.object({
  expendituresId: z.number(),
});
const expenditureGetByYearAndMonth = z.object({
  monthOfTheYear: z.enum(DATEVALUES),
  type: z.enum(VALUES),
});
//this was made post because there is a body being sent with the request
expenditureAuth.post(
  "/month",
  zValidator("json", expenditureGetByYearAndMonth, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    const body = await c.req.json();

    const userId = Number(c.req.header("userId"));
    try {
      const expenditureRows = await db.query.expenditures.findMany({
        where: and(
          eq(expenditures.userId, userId),
          eq(expenditures.year, body.year),
          eq(expenditures.monthOfTheYear, body.monthOfTheYear),
          eq(expenditures.type, body.type),
        ),
      });
      if (expenditureRows) {
        return c.json({ data: expenditureRows }, 201);
      } else {
        return c.json({ message: "Nothing found" }, 404);
      }
    } catch (err) {
      return c.json({ message: "An error occured, try again", error: err });
    }
  },
);

expenditure.get("/categories", async (c) => {
  try {
    const expenditureCategories = await db.select().from(categories);
    return c.json({ data: expenditureCategories }, 201);
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});

expenditureAuth.get("/all", async (c) => {
  const userId = Number(c.req.header("userId"));
  try {
    const expenditureRows = await db.query.expenditures.findMany({
      where: or(eq(expenditures.userId, userId)),
    });

    if (expenditureRows) {
      return c.json({ data: expenditureRows }, 201);
    } else {
      return c.json({ message: "Nothing found" }, 404);
    }
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
    const goalId = await db.query.goals.findFirst({
      where: and(eq(goals.userId, userId), eq(goals.goalsId, body.goalsId)),
    });

    try {
      if (body.categoriesId === 7 && goalId) {
        await db.insert(expenditures).values({
          amount: body.amount,
          userId: userId,
          monthOfTheYear: body.monthOfTheYear,
          year: body.year,
          type: body.type,
          goalsId: goalId.goalsId,
          categoriesId: body.categoriesId,
        });
      } else if (body.categoriesId === 7 && body.goalsId && !goalId) {
        return c.json({ error: "Goal specified does not exist for user" }, 404);
      } else {
        await db.insert(expenditures).values({
          amount: body.amount,
          userId: userId,
          monthOfTheYear: body.monthOfTheYear,
          year: body.year,
          type: body.type,
          goalsId: null,
          categoriesId: body.categoriesId,
        });
      }
      return c.json({ message: `${body.type} added for user` }, 201);
    } catch (err) {
      return c.json({
        message: "An error occured, try again",
        error: err,
      });
    }
  },
);

expenditureAuth.get("/expenses/all", async (c) => {
  const userId = Number(c.req.header("userId"));
  try {
    const expenseRows = await db.query.expenditures.findMany({
      where: or(
        eq(expenditures.userId, userId),
        eq(expenditures.type, "expenses"),
      ),
    });

    if (expenseRows) {
      console.log(c.res);
      return c.json({ data: expenseRows }, 201);
    } else {
      return c.json({ message: "Nothing found" }, 404);
    }
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});

expenditureAuth.get("/budget/all", async (c) => {
  const userId = Number(c.req.header("userId"));
  try {
    const expenseRows = await db.query.expenditures.findMany({
      where: or(
        eq(expenditures.userId, userId),
        eq(expenditures.type, "budget"),
      ),
    });

    if (expenseRows) {
      return c.json({ data: expenseRows }, 201);
    } else {
      return c.json({ message: "Nothing found" }, 404);
    }
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});

// req param does not work
// expenditureAuth.get("/budget/:year", async (c) => {
//   const userId = Number(c.req.header("userId"));
//   const year = c.req.param("year");
//   console.log(year, userId);

//   try {
//     const expenseRows = await db.query.expenditures.findMany({
//       where: and(
//         eq(expenditures.userId, userId),
//         eq(expenditures.type, "budget"),
//         eq(expenditures.year, year)
//       ),
//       orderBy: [desc(expenditures.monthOfTheYear)]
//     });

//     if (expenseRows) {
//       return c.json({ data: expenseRows }, 201);
//     } else {
//       return c.json({ message: "Nothing found" }, 404);
//     }
//   } catch (err) {
//     return c.json({ message: "An error occured, try again", error: err });
//   }
// });

// expenditureAuth.get("/expenses/:year", async (c) => {
//   const userId = Number(c.req.header("userId"));
//   const year = c.req.param("year");

//   try {
//     const expenseRows = await db.query.expenditures.findMany({
//       where: and(
//         eq(expenditures.userId, userId),
//         eq(expenditures.type, "expenses"),
//         eq(expenditures.year, year)
//       ),
//       orderBy: [desc(expenditures.monthOfTheYear)]
//     });

//     if (expenseRows) {
//       return c.json({ data: expenseRows }, 201);
//     } else {
//       return c.json({ message: "Nothing found" }, 404);
//     }
//   } catch (err) {
//     return c.json({ message: "An error occured, try again", error: err });
//   }
// });

expenditureAuth.put(
  "/update",
  zValidator("json", updateExpenditureSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    const userId = Number(c.req.header("userId"));
    const body = await c.req.json();
    const goalId = await db.query.goals.findFirst({
      where: and(eq(goals.userId, userId), eq(goals.goalsId, body.goalsId)),
    });

    try {
      if (body.categoriesId === 7 && goalId) {
        await db
          .update(expenditures)
          .set({
            amount: body.amount,
            monthOfTheYear: body.monthOfTheYear,
            year: body.year,
            categoriesId: body.categoriesId,
            goalsId: body.goalsId,
          })
          .where(
            and(
              eq(expenditures.userId, userId),
              eq(expenditures.type, body.type),
              eq(expenditures.expendituresId, body.expendituresId),
            ),
          )
          .returning();
      } else if (body.categoriesId === 7 && body.goalsId && !goalId) {
        return c.json({ error: "Goal specified does not exist for user" }, 404);
      } else {
        await db
          .update(expenditures)
          .set({
            amount: body.amount,
            monthOfTheYear: body.monthOfTheYear,
            year: body.year,
            categoriesId: body.categoriesId,
            goalsId: null,
          })
          .where(
            and(
              eq(expenditures.userId, userId),
              eq(expenditures.type, body.type),
              eq(expenditures.expendituresId, body.expendituresId),
            ),
          );
      }

      const expenditureRow = await db.query.expenditures.findFirst({
        where: and(
          eq(expenditures.userId, userId),
          eq(expenditures.type, body.type),
          eq(expenditures.expendituresId, body.expendituresId),
        ),
      });

      if (expenditureRow) {
        return c.json(
          {
            message: `${body.type} updated successfully`,
            data: expenditureRow,
          },
          201,
        );
      } else {
        return c.json({ error: "An error occured, check the type" }, 400);
      }
    } catch (err) {
      return c.json({ error: "An error occured, try again", message: err });
    }
  },
);

interface deletedExpenditure {
  expendituresId: number;
  expendituresType: "budget" | "expenses" | null;
}

expenditureAuth.delete(
  "/delete",
  zValidator("json", deleteExpenditureSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    const userId = Number(c.req.header("userId"));
    const body = await c.req.json();

    const expendituresRows = await db.query.expenditures.findMany({
      where: eq(expenditures.userId, userId),
    });

    if (!userId) {
      return c.json({ error: "User does not exist" }, 404);
    } else if (!expendituresRows) {
      return c.json({ error: "No expenditure specified" }, 400);
    } else {
      try {
        const expenditureRow: deletedExpenditure[] = await db
          .delete(expenditures)
          .where(eq(expenditures.expendituresId, body.expendituresId))
          .returning({
            expendituresId: expenditures.expendituresId,
            expendituresType: expenditures.type,
          });

        return c.json(
          {
            message: `${expenditureRow[0].expendituresType} ${expenditureRow[0].expendituresId} deleted successfully`,
          },
          404,
        );
      } catch (err: any) {
        return c.json(
          { error: "Expenditure does not exist", message: err },
          404,
        );
      }
    }
  },
);

expenditureAuth.get("/budget/recent", async (c) => {
  const userId = Number(c.req.header("userId"));
  try {
    const expenditureRows = await db.query.expenditures.findMany({
      where: and(
        eq(expenditures.userId, userId),
        eq(expenditures.type, "budget"),
      ),
      limit: 15,
      orderBy: [asc(expenditures.createdAt)],
    });

    if (expenditureRows) {
      return c.json({ data: expenditureRows }, 201);
    } else {
      return c.json({ message: "Nothing found" }, 404);
    }
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});

expenditureAuth.get("/expenses/recent", async (c) => {
  const userId = Number(c.req.header("userId"));
  try {
    const expenditureRows = await db.query.expenditures.findMany({
      where: and(
        eq(expenditures.userId, userId),
        eq(expenditures.type, "expenses"),
      ),
      limit: 15,
      orderBy: [asc(expenditures.createdAt)],
    });

    if (expenditureRows) {
      return c.json({ data: expenditureRows }, 201);
    } else {
      return c.json({ message: "Nothing found" }, 404);
    }
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});
