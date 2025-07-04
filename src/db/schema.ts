import { integer, pgTable, serial, text, timestamp, decimal, varchar, boolean } from 'drizzle-orm/pg-core';

// Users table (extends Supabase auth.users)
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  authUserId: varchar('auth_user_id', { length: 256 }).notNull().unique(), // Reference to Supabase auth.users.id
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Organizations table
export const organizationsTable = pgTable('organizations_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
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