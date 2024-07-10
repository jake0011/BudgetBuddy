ALTER TABLE "expenditures" DROP CONSTRAINT "expenditures_goalsId_goals_goalsId_fk";
--> statement-breakpoint
ALTER TABLE "expenditures" DROP COLUMN IF EXISTS "goalsId";