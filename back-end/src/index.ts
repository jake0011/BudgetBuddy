import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import user from "./handlers/users";

const app = new Hono();
app.use(prettyJSON());
app.use(logger());
app.use(cors());
app.get("/", (c) => {
  return c.json("Welcome to Budget Buddy");
});

app.route("/", user);
export default app;
