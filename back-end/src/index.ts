import { Hono } from "hono";
import { cors } from "hono/cors";
import { verify } from "hono/jwt";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";

import user from "./handlers/users";

const app = new Hono();
app.use(cors());
app.use(prettyJSON());
app.use(logger());
app.use("/*/auth/*", async (c, next) => {
  try {
    const decodedPayload = await verify(
      c.req.header("Authorization") || "header",
      process.env?.JWT_SECRET_KEY || "mySecretKey",
    );
    if (decodedPayload != undefined) {
      await next();
    } else {
      return c.json({message:"You're not authorized"},500);
    }
  } catch (error: any) {
    return c.json({message:"You're not authorized"}, 500);
  }
});
app.get("kwabena/king/auth/page/thing", (c) => {
  return c.json("okay"); // eg: { "s
});
app.get("/", (c) => {
  return c.json("Welcome to Budget Buddy");
});

app.route("/", user);
export default app;
