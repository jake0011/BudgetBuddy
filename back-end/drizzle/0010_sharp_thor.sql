CREATE TABLE IF NOT EXISTS "goals" (
	"goalId" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(1024),
	"amount" double precision DEFAULT 0 NOT NULL,
	"percentageToGoal" double precision DEFAULT 0,
	"isGoalReached" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "goals_title_unique" UNIQUE("title")
);
--> statement-breakpoint
ALTER TABLE "expenditures" ADD COLUMN "goalsId" integer;--> statement-breakpoint
ALTER TABLE "incomes" ADD COLUMN "categoriesId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_goalsId_goals_goalId_fk" FOREIGN KEY ("goalsId") REFERENCES "public"."goals"("goalId") ON DELETE set default ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "incomes" ADD CONSTRAINT "incomes_categoriesId_categories_categoriesId_fk" FOREIGN KEY ("categoriesId") REFERENCES "public"."categories"("categoriesId") ON DELETE set default ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
