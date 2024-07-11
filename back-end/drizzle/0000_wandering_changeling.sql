DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('budget', 'expenses');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."month" AS ENUM('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"categoriesId" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"description" varchar(1024)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenditures" (
	"expendituresId" serial PRIMARY KEY NOT NULL,
	"amount" double precision DEFAULT 19.4,
	"type" "type",
	"month" "month",
	"year" varchar(256),
	"categoriesId" integer NOT NULL,
	"userId" integer NOT NULL,
	"goalsId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goals" (
	"goalsId" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(1024),
	"amount" double precision DEFAULT 0 NOT NULL,
	"percentageToGoal" double precision DEFAULT 0,
	"isGoalReached" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "goals_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "incomes" (
	"incomesId" serial PRIMARY KEY NOT NULL,
	"amount" double precision DEFAULT 19.4,
	"categoriesId" integer NOT NULL,
	"month" "month",
	"year" varchar(256),
	"userId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"userId" serial PRIMARY KEY NOT NULL,
	"username" varchar(256) NOT NULL,
	"firstname" varchar(256) NOT NULL,
	"middlename" varchar(256),
	"lastname" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_categoriesId_categories_categoriesId_fk" FOREIGN KEY ("categoriesId") REFERENCES "public"."categories"("categoriesId") ON DELETE set default ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_goalsId_goals_goalsId_fk" FOREIGN KEY ("goalsId") REFERENCES "public"."goals"("goalsId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "incomes" ADD CONSTRAINT "incomes_categoriesId_categories_categoriesId_fk" FOREIGN KEY ("categoriesId") REFERENCES "public"."categories"("categoriesId") ON DELETE set default ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "incomes" ADD CONSTRAINT "incomes_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
