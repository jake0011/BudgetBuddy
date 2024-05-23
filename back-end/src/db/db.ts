import { drizzle } from "drizzle-orm/neon-http";
// import * as users from "./schema/users.ts";
// import * as incomes  from "./schema/incomes.ts";
import { neon } from "@neondatabase/serverless";

export const connection = neon(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle(connection);
