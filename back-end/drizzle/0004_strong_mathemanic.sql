ALTER TABLE "expenditures" ADD COLUMN "categoriesId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_categoriesId_categories_categories_fk" FOREIGN KEY ("categoriesId") REFERENCES "public"."categories"("categories") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
