import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    host: process.env.DB_HOST || "owner",
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "somePassword",
    database: process.env.DB_NAME || "db",
  },
});
