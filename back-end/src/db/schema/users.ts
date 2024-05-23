import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  userId: serial("userId").primaryKey(),
  username: varchar("username", { length: 256 }),
  firstname: varchar("firstname", { length: 256 }),
  middlename: varchar("middlename", { length: 256 }),
  lastname: varchar("lastname", { length: 256 }),
  password: varchar("password", { length: 256 }),
  email: varchar("email", { length: 256 }),
  // INFO: on update now is does not work with postgress
  // TODO: look for a way to make it work triggers
  // updatedAt: timestamp("updatedAt").notNull().onUpdateNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
