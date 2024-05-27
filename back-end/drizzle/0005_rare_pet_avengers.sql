ALTER TABLE "categories" RENAME COLUMN "categories" TO "categoriesId";--> statement-breakpoint
ALTER TABLE "expenditures" DROP CONSTRAINT "expenditures_categoriesId_categories_categories_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_categoriesId_categories_categoriesId_fk" FOREIGN KEY ("categoriesId") REFERENCES "public"."categories"("categoriesId") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
