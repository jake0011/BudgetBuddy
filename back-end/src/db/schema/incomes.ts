import {
  pgTable,
  pgEnum,
  serial,
  integer,
  timestamp,
  doublePrecision,
  varchar
} from "drizzle-orm/pg-core";
import { users } from "./users"

export const monthOfTheYearEnum = pgEnum("month", [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]);

// INFO: on update now is does not work with postgress
// TODO: look for a way to make it work triggers

export const incomes = pgTable("incomes", {
  incomesId: serial("incomesId").primaryKey(),
  amount: doublePrecision("amount").default(19.4),
  monthOfTheYear: monthOfTheYearEnum("month"),
  year: varchar("year",{length: 256 }),
  userId: integer('userId').references(() =>
    users.userId, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});


