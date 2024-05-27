CREATE TABLE IF NOT EXISTS "categories" (
	"categories" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"description" varchar(1024)
);
