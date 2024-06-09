import { Hono } from "hono";
import { sign } from "hono/jwt";
import { eq, or } from "drizzle-orm";
import { number, z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { users } from "../db/schema/users.ts";
import { expenditures } from "../db/schema/expenditures.ts";
import { db } from "../db/db";
import { expenditure, expenditureAuth } from "./expenditure.ts";


//TODO:
//      send email verification after sign up

const signUpSchema = z.object({
  username: z.string(),
  firstname: z.string(),
  middlename: z.string().optional(),
  lastname: z.string(),
  password: z.string().min(8).max(20),
  email: z.string(),
});

const signInSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string(),
});

export const user = new Hono().basePath("v1/user");
export const userAuth = new Hono().basePath("auth/v1/user");

user.get("/all", async (c) => {
  try {
    const userRows = await db.select().from(users);
    return c.json({ data: userRows }, 201);
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});

userAuth.get("/get", async (c) => {
  const userId = Number(c.req.header("userId"));
  try {
    const userRow = await db.query.users.findFirst({
      where: eq(users.userId, userId),
    });
    if (userRow) {
      return c.json({ data: userRow }, 201);
    } else {
      return c.json({ error: "User does not exist" }, 404);
    }
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});

user.post(
  "/signup",
  zValidator("json", signUpSchema, (result, c) => {
    if (result.data.password.length < 8) {
      return c.json({ error: "Password should be 8 or more characters" }, 415);
    } else if (result.data.password.length > 20) {
      return c.json({ error: "Password should be 20 or less characters" }, 415);
    } else if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    try {
      const body = await c.req.json();

      //TODO: see if you can find a way to use the error rather to get it
      const userExists = await db
        .select()
        .from(users)
        .where(
          or(eq(users.username, body.username), eq(users.email, body.email)),
        );

      if (userExists.length != 0) {
        return c.json({ error: "User Already Exists" }, 409);
      }

      //INFO: for some reason, when you use Argon2id it doesn't work
      const bcryptHash = await Bun.password.hash(body.password, {
        algorithm: "bcrypt",
        cost: 4,
      });

      await db.insert(users).values({
        username: body.username,
        firstname: body.firstname,
        middlename: body.middlename,
        lastname: body.lastname,
        password: bcryptHash,
        email: body.email,
      });
      return c.json(
        { message: `${body.username} signed up successfully` },
        201,
      );
    } catch (err) {
      return c.json({ error: "An error occured, try again", message: err });
    }
  },
);

user.post(
  "/signin",
  zValidator("json", signInSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid Input" }, 415);
    }
  }),
  async (c) => {
    try {
      const body = await c.req.json();

      const userDetails = await db.query.users.findFirst({
        where: or(
          eq(users.username, body.username),
          eq(users.email, body.email),
        ),
      });
      if (userDetails) {
        const isPasswordMatch = await Bun.password.verify(
          body.password,
          userDetails.password,
        );

        if (isPasswordMatch) {
          const payload = {
            userId: userDetails.userId,
            exp:
              Math.floor(Date.now() / 1000) +
              60 * Number(process.env.JWT_EXPIRY_TIME ?? 48260),
          };
          const secret = process.env.JWT_SECRET_KEY || "mySecretKey";
          const token = await sign(payload, secret);
          return c.json(
            {
              message: "Sign in succesful",
              token: token,
              data: {
                userId: userDetails.userId,
                username: userDetails.username,
                firstname: userDetails.firstname,
                middlename: userDetails.middlename,
                lastname: userDetails.lastname,
                email: userDetails.email,
              },
            },
            201,
          );
        } else {
          return c.json({ error: "Username or Password Wrong" }, 401);
        }
      } else {
        return c.json({ error: "User doesn't exist" }, 404);
      }
    } catch (err: any) {
      return c.json(
        { error: "An error occured, try again", message: err },
        500,
      );
    }
  },
);

interface deletedUser {
  username: string;
}

userAuth.delete("/deleteAccount", async (c) => {
  //INFO: id is gotten from headers beccause of the jwt authentication
  const userId = Number(c.req.header("userId"));
  if (!userId) {
    return c.json({ error: "No user specified" });
  } else {
    try {
      const deletedUsername: deletedUser[] = await db
        .delete(users)
        .where(eq(users.userId, userId))
        .returning({ username: users.username });

      return c.json(
        {
          message: `User ${deletedUsername[0].username} deleted successfully`,
        },
        404,
      );
    } catch (err: any) {
      return c.json({ error: "User does not exist", message: err }, 404);
    }
  }
});

expenditureAuth.get("/all", async (c) => {
  const userId = Number(c.req.header("userId"));
  try {
    const expenseRows = await db.query.expenditures.findFirst({
      where: eq(expenditures.userId, userId),
    });

    if (expenseRows) {
      console.log(expenseRows);
      return c.json({ data: expenseRows }, 201);      
    } else {
      return c.json({ message: "Nothing found" }, 404);
    }
  } catch (err) {
    return c.json({ message: "An error occured, try again", error: err });
  }
});