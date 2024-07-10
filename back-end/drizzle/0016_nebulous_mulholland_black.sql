ALTER TABLE "expenditures" DROP CONSTRAINT "expenditures_categoriesId_categories_categoriesId_fk";
--> statement-breakpoint
ALTER TABLE "expenditures" DROP CONSTRAINT "expenditures_userId_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "expenditures" DROP COLUMN IF EXISTS "categoriesId";--> statement-breakpoint
ALTER TABLE "expenditures" DROP COLUMN IF EXISTS "userId";