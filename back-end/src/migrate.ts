// import "dotenv/config";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "./db/db";

// This will run migrations on the database, skipping the ones already applied
const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
  } catch (error) {
    console.error("Error during migration", error);
    process.exit(1);
  }
};

// Don't forget to close the connection, otherwise the script will hang
main();
