import { Hono } from "hono";
import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { users } from "../db/schema/users.ts";
import { db } from "../db/db";

const signUpSchema = z.object({
  username: z.string(),
  firstname: z.string(),
  middlename: z.string(),
  lastname: z.string(),
  password: z.string().min(8),
  email: z.string(),
});

const user = new Hono().basePath("v1/user");

user.get("/all", async (c) => {
  try {
    const userRows = await db.select().from(users);
    return c.json({ userRows }, 201);
  } catch (err) {
    return err;
  }
});

//TODO: also do some JWT for authentication as a middleware
user.post(
  "/signup",
  zValidator("json", signUpSchema, (result, c) => {
    if (!result.success) {
      return c.json("Invalid Input", 415);
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
      return c.json("Sign Up successful", 201);
    } catch (err) {
      return err;
    }
  },
);

export default user;
