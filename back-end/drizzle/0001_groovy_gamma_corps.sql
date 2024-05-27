DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('budget', 'expenses');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenditures" (
	"expendituresId" serial PRIMARY KEY NOT NULL,
	"amount" double precision DEFAULT 19.4,
	"type" "type",
	"userId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
