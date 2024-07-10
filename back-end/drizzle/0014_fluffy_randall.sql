ALTER TABLE "goals" RENAME COLUMN "goalId" TO "goalsId";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_goalsId_goals_goalsId_fk" FOREIGN KEY ("goalsId") REFERENCES "public"."goals"("goalsId") ON DELETE set default ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
