import { Hono } from "hono";
import { db } from "../db/db";
import { users } from "../db/schema/users.ts";

const user = new Hono().basePath("v1/user");

user.get(
  "/all",
  async (c) => {
    try {
      const userRows = await db.select().from(users);
      return c.json({ userRows });
    } catch (err) {
      return err;
    }
  },
  201,
);

export default user;
