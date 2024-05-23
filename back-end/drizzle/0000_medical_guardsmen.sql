CREATE TABLE IF NOT EXISTS "users" (
	"userId" serial PRIMARY KEY NOT NULL,
	"username" varchar(256),
	"firstname" varchar(256),
	"middlename" varchar(256),
	"lastname" varchar(256),
	"password" varchar(256),
	"email" varchar(256),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
