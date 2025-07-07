CREATE TABLE "cash_flow_data_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"period" varchar(20) NOT NULL,
	"inflow" numeric(15, 2) NOT NULL,
	"outflow" numeric(15, 2) NOT NULL,
	"net_cash_flow" numeric(15, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "currency_rates_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"currency_code" varchar(3) NOT NULL,
	"rate_to_usd" real NOT NULL,
	"symbol" varchar(5) NOT NULL,
	"name" text NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "currency_rates_table_currency_code_unique" UNIQUE("currency_code")
);
--> statement-breakpoint
CREATE TABLE "customers_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"segment" varchar(50) NOT NULL,
	"total_orders" integer DEFAULT 0 NOT NULL,
	"total_spent" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"platform" varchar(50) NOT NULL,
	"last_order" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_metrics_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"metric_type" varchar(50) NOT NULL,
	"period" varchar(20) NOT NULL,
	"revenue" numeric(15, 2) NOT NULL,
	"expenses" numeric(15, 2) NOT NULL,
	"profit" numeric(15, 2) NOT NULL,
	"target" numeric(15, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"status" varchar(50) NOT NULL,
	"items_count" integer DEFAULT 1 NOT NULL,
	"platform" varchar(50) NOT NULL,
	"order_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_table_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "portfolio_holdings_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"value" numeric(15, 2) NOT NULL,
	"allocation_percent" real NOT NULL,
	"change_percent" real DEFAULT 0 NOT NULL,
	"risk_level" varchar(20) NOT NULL,
	"manager" text NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "production_data_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"region" varchar(100) NOT NULL,
	"period" varchar(20) NOT NULL,
	"units_produced" integer NOT NULL,
	"efficiency_percent" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"name" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"rating" real DEFAULT 0,
	"platform" varchar(50) NOT NULL,
	"sold" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_data_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"platform" varchar(50) NOT NULL,
	"sales" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supply_chain_metrics_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"week" varchar(20) NOT NULL,
	"on_time_percent" real NOT NULL,
	"quality_percent" real NOT NULL,
	"cost_efficiency" real NOT NULL,
	"overall_efficiency" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_metrics_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"metric_name" varchar(100) NOT NULL,
	"current_value" text NOT NULL,
	"previous_value" text,
	"improvement_percent" real DEFAULT 0,
	"status" varchar(20) DEFAULT 'operational' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cash_flow_data_table" ADD CONSTRAINT "cash_flow_data_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers_table" ADD CONSTRAINT "customers_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_metrics_table" ADD CONSTRAINT "financial_metrics_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_table" ADD CONSTRAINT "orders_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_table" ADD CONSTRAINT "orders_table_customer_id_customers_table_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_holdings_table" ADD CONSTRAINT "portfolio_holdings_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_data_table" ADD CONSTRAINT "production_data_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_table" ADD CONSTRAINT "products_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_data_table" ADD CONSTRAINT "sales_data_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supply_chain_metrics_table" ADD CONSTRAINT "supply_chain_metrics_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_metrics_table" ADD CONSTRAINT "system_metrics_table_organization_id_organizations_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations_table"("id") ON DELETE cascade ON UPDATE no action;