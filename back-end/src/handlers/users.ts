import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { users } from "../db/schema/users.ts";
import { db } from "../db/db";

//TODO:
//      send email verification after sign up
//      get user by id

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

const user = new Hono().basePath("v1/user");

user.get("/all", async (c) => {
  try {
    const userRows = await db.select().from(users);
    return c.json({ userRows }, 201);
  } catch (err) {
    return c.json({ err }, 500);
  }
});

user.post(
  "/signup",
  zValidator("json", signUpSchema, (result, c) => {
    //Decide if you like a general respone or more specific ones. I prefer more specific but you are the boss here.

    // if (!result.success) {
    //   return c.json("Password should be from 8 to 20 characters long", 415);
    // }
    if (result.data.password.length < 8) {
      return c.json("Password should be 8 or more characters", 415);
    } else if (result.data.password.length > 20) {
      return c.json("Password should be 20 or less characters", 415);
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
        return c.json("User Already Exists", 409);
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
      return c.json(`${body.username} signed up successfully`, 201);
    } catch (error) {
      c.json({ error }, 500);
    }
  },
);

user.post(
  "/signin",
  zValidator("json", signInSchema, (result, c) => {
    if (!result.success) {
      return c.json("Invalid Input", 415);
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
            username: body.username,
            exp:
              Math.floor(Date.now() / 1000) +
              60 * Number(process.env.JWT_EXPIRY_TIME ?? 48260),
          };
          const secret = process.env.JWT_SECRET_KEY || "mySecretKey";
          const token = await sign(payload, secret);
          return c.json(
            {
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
          return c.json("Username or Password Wrong", 401);
        }
      } else {
        return c.json("User doesn't exist", 404);
      }
    } catch (error) {
      return c.json({ error }, 500);
    }
  },
);

interface deletedUser {
  username: string;
}

user.delete("/auth/delete/:userId", async (c) => {
  const userId = Number(c.req.param("userId"));
  try {
    const deletedUsername: deletedUser[] = await db
      .delete(users)
      .where(eq(users.userId, userId))
      .returning({ username: users.username });

    return c.json(
      `User ${deletedUsername[0].username} deleted successfully`,
      404,
    );
  } catch (err) {
    return c.json({ err }, 404);
  }
});

export default user;
