DO $$ BEGIN
 ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
