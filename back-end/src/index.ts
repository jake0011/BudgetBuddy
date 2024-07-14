import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";

import { userAuth, user } from "./handlers/users";
import { incomeAuth, income } from "./handlers/income";
import { expenditure, expenditureAuth } from "./handlers/expenditure";
import { goal, goalAuth } from "./handlers/goals";

const app = new Hono();

app.use(cors());
app.use(prettyJSON());
app.use(logger());

app.get("/", (c) => {
  return c.json("Welcome to Budget Buddy");
});

app.route("/", user);
app.route("/", userAuth);
app.route("/", income);
app.route("/", incomeAuth);
app.route("/", expenditureAuth);
app.route("/", expenditure);
app.route("/", goal);
app.route("/", goalAuth);
export default app;