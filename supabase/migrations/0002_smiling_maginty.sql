ALTER TABLE "users_table" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "position" text;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "role" varchar(50) DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "is_onboarded" boolean DEFAULT false;