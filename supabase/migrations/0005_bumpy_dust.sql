CREATE TABLE "user_invitations_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"organization_id" integer NOT NULL,
	"role" varchar(50) NOT NULL,
	"position" text,
	"invited_by" integer NOT NULL,
	"token" varchar(256) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_invitations_table_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "user_invitations_table" ADD CONSTRAINT "user_invitations_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_invitations_table" ADD CONSTRAINT "user_invitations_table_invited_by_users_table_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;