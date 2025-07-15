ALTER TABLE "dashboards_table" ADD COLUMN "category" varchar(50);--> statement-breakpoint
ALTER TABLE "dashboards_table" ADD COLUMN "status" varchar(20) DEFAULT 'operational';--> statement-breakpoint
ALTER TABLE "dashboards_table" ADD COLUMN "color" varchar(100);--> statement-breakpoint
ALTER TABLE "dashboards_table" ADD COLUMN "bg_color" varchar(100);--> statement-breakpoint
ALTER TABLE "dashboards_table" ADD COLUMN "icon_color" varchar(100);--> statement-breakpoint
ALTER TABLE "dashboards_table" ADD COLUMN "required_roles" text;--> statement-breakpoint
ALTER TABLE "dashboards_table" ADD COLUMN "metrics" text;--> statement-breakpoint
ALTER TABLE "dashboards_table" ADD COLUMN "metadata" text;--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "external_id" varchar(100);--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "established" varchar(20);--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "employees" integer;--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "revenue" varchar(50);--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "industry" text;--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "website" varchar(255);--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "phone" varchar(50);--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "status" varchar(20) DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "plan" varchar(20) DEFAULT 'basic';--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "last_accessed" timestamp;--> statement-breakpoint
ALTER TABLE "organizations_table" ADD COLUMN "metadata" text;--> statement-breakpoint
ALTER TABLE "organizations_table" ADD CONSTRAINT "organizations_table_external_id_unique" UNIQUE("external_id");