import { Hono } from "hono";
import { db } from "../db/db";
import { users } from "../db/schema/users.ts";
import { eq, and } from "drizzle-orm";

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
//also make sure to do validation for the user input
user.post("/signup", async (c) => {
  try {
    const body = await c.req.json();

    //TODO: see if you can find a way to use the error rather to get it
    const userExists = await db
      .select()
      .from(users)
      .where(
        and(eq(users.lastname, body.lastname), eq(users.email, body.email)),
      );

    if (userExists) {
      return c.json("User Already Exists", 409);
    }

    const argonHash = await Bun.password.hash(body.password, {
      memoryCost: 4,
      timeCost: 3,
    });

    await db.insert(users).values({
      username: body.username,
      firstname: body.firstname,
      middlename: body.middlename,
      lastname: body.lastname,
      password: argonHash,
      email: body.email,
    });
    return c.json("Sign Up successful", 201);
  } catch (err) {
    return err;
  }
});

export default user;
