CREATE TABLE "dashboards_table" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_dashboards_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"dashboard_id" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization_dashboards_table" ADD CONSTRAINT "organization_dashboards_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_dashboards_table" ADD CONSTRAINT "organization_dashboards_table_dashboard_id_dashboards_table_id_fk" FOREIGN KEY ("dashboard_id") REFERENCES "public"."dashboards_table"("id") ON DELETE cascade ON UPDATE no action;