DO $$ BEGIN
 ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_goalsId_goals_goalId_fk" FOREIGN KEY ("goalsId") REFERENCES "public"."goals"("goalId") ON DELETE set default ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
