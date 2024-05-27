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

export const typeEnum = pgEnum("type", ["budget", "expenses"]);

// INFO: on update now is does not work with postgress
// TODO: look for a way to make it work triggers

export const expenditures = pgTable("expenditures", {
  expendituresId: serial("expendituresId").primaryKey(),
  amount: doublePrecision("amount").default(19.4),
  type: typeEnum("type"),
  categoriesId: integer('categoriesId').references(() =>
    categories.categoriesId, { onDelete: 'set default' }).notNull(),
  userId: integer('userId').references(() =>
    users.userId, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  categoriesId: serial("categoriesId").primaryKey(),
  name: varchar("name", { length: 256 }),
  description: varchar("description", { length: 1024 }),
});
