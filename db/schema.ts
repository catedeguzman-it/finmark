import { integer, pgTable, serial, text, timestamp, decimal, varchar, boolean, real } from 'drizzle-orm/pg-core';

// Users table (extends Supabase auth.users)
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  authUserId: varchar('auth_user_id', { length: 256 }).notNull().unique(), // Reference to Supabase auth.users.id
  name: text('name'),
  email: text('email').notNull().unique(),
  position: text('position'),
  role: varchar('role', { length: 50 }).default('member'),
  isOnboarded: boolean('is_onboarded').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Dashboards table
export const dashboardsTable = pgTable('dashboards_table', {
  id: varchar('id', { length: 50 }).primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Organization dashboards relationships
export const organizationDashboardsTable = pgTable('organization_dashboards_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  dashboardId: varchar('dashboard_id', { length: 50 }).notNull().references(() => dashboardsTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Organizations table
export const organizationsTable = pgTable('organizations_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).default('small_business'), // startup, small_business, enterprise, non_profit
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// User organization relationships
export const userOrganizationsTable = pgTable('user_organizations_table', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull().default('member'), // admin, member, viewer
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// User invitations table
export const userInvitationsTable = pgTable('user_invitations_table', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull(), // admin, manager, analyst, viewer
  position: text('position'),
  invitedBy: integer('invited_by').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 256 }).notNull().unique(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, accepted, expired
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Financial accounts
export const accountsTable = pgTable('accounts_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // checking, savings, credit, investment, etc.
  balance: decimal('balance', { precision: 12, scale: 2 }).notNull().default('0.00'),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Transactions
export const transactionsTable = pgTable('transactions_table', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').notNull().references(() => accountsTable.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }),
  transactionDate: timestamp('transaction_date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Categories for transactions
export const categoriesTable = pgTable('categories_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // income, expense
  color: varchar('color', { length: 7 }).default('#3B82F6'), // hex color
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// E-commerce Tables
export const productsTable = pgTable('products_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  rating: real('rating').default(0),
  platform: varchar('platform', { length: 50 }).notNull(),
  sold: integer('sold').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export const customersTable = pgTable('customers_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  segment: varchar('segment', { length: 50 }).notNull(), // VIP, Regular, New, At Risk
  totalOrders: integer('total_orders').notNull().default(0),
  totalSpent: decimal('total_spent', { precision: 12, scale: 2 }).notNull().default('0.00'),
  platform: varchar('platform', { length: 50 }).notNull(),
  lastOrder: timestamp('last_order'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const ordersTable = pgTable('orders_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  customerId: integer('customer_id').notNull().references(() => customersTable.id, { onDelete: 'cascade' }),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // Pending, Processing, Shipped, Delivered, Cancelled
  itemsCount: integer('items_count').notNull().default(1),
  platform: varchar('platform', { length: 50 }).notNull(),
  orderDate: timestamp('order_date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Financial Analytics Tables
export const portfolioHoldingsTable = pgTable('portfolio_holdings_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // Equity, Bonds, Real Estate, Commodities, Crypto
  value: decimal('value', { precision: 15, scale: 2 }).notNull(),
  allocationPercent: real('allocation_percent').notNull(),
  changePercent: real('change_percent').notNull().default(0),
  riskLevel: varchar('risk_level', { length: 20 }).notNull(), // Low, Medium, High
  manager: text('manager').notNull(),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const financialMetricsTable = pgTable('financial_metrics_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  metricType: varchar('metric_type', { length: 50 }).notNull(), // monthly, quarterly, yearly
  period: varchar('period', { length: 20 }).notNull(), // 2024-01, Q1-2024, 2024
  revenue: decimal('revenue', { precision: 15, scale: 2 }).notNull(),
  expenses: decimal('expenses', { precision: 15, scale: 2 }).notNull(),
  profit: decimal('profit', { precision: 15, scale: 2 }).notNull(),
  target: decimal('target', { precision: 15, scale: 2 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const currencyRatesTable = pgTable('currency_rates_table', {
  id: serial('id').primaryKey(),
  currencyCode: varchar('currency_code', { length: 3 }).notNull().unique(),
  rateToUsd: real('rate_to_usd').notNull(),
  symbol: varchar('symbol', { length: 5 }).notNull(),
  name: text('name').notNull(),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
});

// Manufacturing Tables
export const productionDataTable = pgTable('production_data_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  region: varchar('region', { length: 100 }).notNull(),
  period: varchar('period', { length: 20 }).notNull(), // 2024-01
  unitsProduced: integer('units_produced').notNull(),
  efficiencyPercent: real('efficiency_percent').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const supplyChainMetricsTable = pgTable('supply_chain_metrics_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  week: varchar('week', { length: 20 }).notNull(), // Week 1, Week 2, etc.
  onTimePercent: real('on_time_percent').notNull(),
  qualityPercent: real('quality_percent').notNull(),
  costEfficiency: real('cost_efficiency').notNull(),
  overallEfficiency: real('overall_efficiency').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// System Performance Tables
export const systemMetricsTable = pgTable('system_metrics_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  metricName: varchar('metric_name', { length: 100 }).notNull(),
  currentValue: text('current_value').notNull(),
  previousValue: text('previous_value'),
  improvementPercent: real('improvement_percent').default(0),
  status: varchar('status', { length: 20 }).notNull().default('operational'), // operational, warning, critical
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Cash Flow Data Table
export const cashFlowDataTable = pgTable('cash_flow_data_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  period: varchar('period', { length: 20 }).notNull(), // Jan 24, Feb 24, etc.
  inflow: decimal('inflow', { precision: 15, scale: 2 }).notNull(),
  outflow: decimal('outflow', { precision: 15, scale: 2 }).notNull(),
  netCashFlow: decimal('net_cash_flow', { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Sales Data Table (for E-commerce trends)
export const salesDataTable = pgTable('sales_data_table', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizationsTable.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  platform: varchar('platform', { length: 50 }).notNull(),
  sales: decimal('sales', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Type definitions for TypeScript
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertOrganization = typeof organizationsTable.$inferInsert;
export type SelectOrganization = typeof organizationsTable.$inferSelect;

export type InsertAccount = typeof accountsTable.$inferInsert;
export type SelectAccount = typeof accountsTable.$inferSelect;

export type InsertTransaction = typeof transactionsTable.$inferInsert;
export type SelectTransaction = typeof transactionsTable.$inferSelect;

export type InsertCategory = typeof categoriesTable.$inferInsert;
export type SelectCategory = typeof categoriesTable.$inferSelect;

// E-commerce Types
export type InsertProduct = typeof productsTable.$inferInsert;
export type SelectProduct = typeof productsTable.$inferSelect;

export type InsertCustomer = typeof customersTable.$inferInsert;
export type SelectCustomer = typeof customersTable.$inferSelect;

export type InsertOrder = typeof ordersTable.$inferInsert;
export type SelectOrder = typeof ordersTable.$inferSelect;

// Financial Analytics Types
export type InsertPortfolioHolding = typeof portfolioHoldingsTable.$inferInsert;
export type SelectPortfolioHolding = typeof portfolioHoldingsTable.$inferSelect;

export type InsertFinancialMetric = typeof financialMetricsTable.$inferInsert;
export type SelectFinancialMetric = typeof financialMetricsTable.$inferSelect;

export type InsertCurrencyRate = typeof currencyRatesTable.$inferInsert;
export type SelectCurrencyRate = typeof currencyRatesTable.$inferSelect;

// Manufacturing Types
export type InsertProductionData = typeof productionDataTable.$inferInsert;
export type SelectProductionData = typeof productionDataTable.$inferSelect;

export type InsertSupplyChainMetric = typeof supplyChainMetricsTable.$inferInsert;
export type SelectSupplyChainMetric = typeof supplyChainMetricsTable.$inferSelect;

// System Performance Types
export type InsertSystemMetric = typeof systemMetricsTable.$inferInsert;
export type SelectSystemMetric = typeof systemMetricsTable.$inferSelect;

// Cash Flow Types
export type InsertCashFlowData = typeof cashFlowDataTable.$inferInsert;
export type SelectCashFlowData = typeof cashFlowDataTable.$inferSelect;

// Sales Data Types
export type InsertSalesData = typeof salesDataTable.$inferInsert;
export type SelectSalesData = typeof salesDataTable.$inferSelect;

// User Invitation Types
export type InsertUserInvitation = typeof userInvitationsTable.$inferInsert;
export type SelectUserInvitation = typeof userInvitationsTable.$inferSelect; 