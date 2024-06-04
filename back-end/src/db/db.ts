import { drizzle } from "drizzle-orm/neon-http";
import * as users from "./schema/users";
import * as expenditures from "./schema/expenditures";
import * as incomes from "./schema/incomes";
import { neon } from "@neondatabase/serverless";

export const connection = neon(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle(connection, {
  schema: { ...users, ...expenditures, ...incomes },
});
