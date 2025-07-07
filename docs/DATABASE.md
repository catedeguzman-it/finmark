# FinMark Database Documentation

## Overview

FinMark uses PostgreSQL as its primary database, managed through Supabase, with Drizzle ORM for type-safe database operations. The database follows a multi-tenant architecture where organizations serve as the primary data isolation boundary.

## Database Schema

### Core Tables

#### Users Table (`users_table`)
Extends Supabase's built-in authentication with additional profile information.

```sql
CREATE TABLE users_table (
  id SERIAL PRIMARY KEY,
  auth_user_id VARCHAR(256) NOT NULL UNIQUE, -- References auth.users.id
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL
);
```

**Relationships:**
- Links to Supabase `auth.users` via `auth_user_id`
- One-to-many with `user_organizations_table`

**Indexes:**
- Primary key on `id`
- Unique index on `auth_user_id`
- Unique index on `email`

#### Organizations Table (`organizations_table`)
Multi-tenant organization structure for data isolation.

```sql
CREATE TABLE organizations_table (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL
);
```

**Relationships:**
- One-to-many with `user_organizations_table`
- One-to-many with `accounts_table`
- One-to-many with `categories_table`

#### User Organizations Table (`user_organizations_table`)
Junction table for user-organization relationships with role-based access.

```sql
CREATE TABLE user_organizations_table (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users_table(id) ON DELETE CASCADE,
  organization_id INTEGER NOT NULL REFERENCES organizations_table(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member', -- admin, member, viewer
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Roles:**
- `admin`: Full access to organization data and settings
- `member`: Read/write access to financial data
- `viewer`: Read-only access to reports and dashboards

### Financial Tables

#### Accounts Table (`accounts_table`)
Financial accounts within organizations (checking, savings, credit, etc.).

```sql
CREATE TABLE accounts_table (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations_table(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- checking, savings, credit, investment
  balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL
);
```

**Account Types:**
- `checking`: Primary checking accounts
- `savings`: Savings accounts
- `credit`: Credit card accounts
- `investment`: Investment accounts
- `loan`: Loan accounts

#### Transactions Table (`transactions_table`)
Individual financial transactions linked to accounts.

```sql
CREATE TABLE transactions_table (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts_table(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  transaction_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL
);
```

**Amount Convention:**
- Positive amounts: Income/deposits
- Negative amounts: Expenses/withdrawals

#### Categories Table (`categories_table`)
Organization-specific transaction categories for classification.

```sql
CREATE TABLE categories_table (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations_table(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type VARCHAR(20) NOT NULL, -- income, expense
  color VARCHAR(7) DEFAULT '#3B82F6', -- hex color for UI
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Drizzle ORM Schema

### Schema Definition (`db/schema.ts`)

```typescript
// Users table
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  authUserId: varchar('auth_user_id', { length: 256 }).notNull().unique(),
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

// Additional tables follow similar pattern...
```

### Type Inference

Drizzle automatically generates TypeScript types:

```typescript
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertOrganization = typeof organizationsTable.$inferInsert;
export type SelectOrganization = typeof organizationsTable.$inferSelect;
```

## Database Queries

### User Queries (`db/queries/users.ts`)

#### Get User by Auth ID
```typescript
export async function getUserByAuthId(authUserId: string): Promise<SelectUser | null> {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.authUserId, authUserId))
    .limit(1);
  
  return result[0] || null;
}
```

#### Create User
```typescript
export async function createUser(userData: InsertUser): Promise<SelectUser> {
  const result = await db
    .insert(usersTable)
    .values(userData)
    .returning();
  
  return result[0];
}
```

### Organization Queries (`db/queries/organizations.ts`)

#### Get User Organizations
```typescript
export async function getUserOrganizations(userId: number) {
  return await db
    .select({
      organization: organizationsTable,
      role: userOrganizationsTable.role,
    })
    .from(userOrganizationsTable)
    .innerJoin(organizationsTable, eq(userOrganizationsTable.organizationId, organizationsTable.id))
    .where(eq(userOrganizationsTable.userId, userId));
}
```

#### Get Organization Accounts
```typescript
export async function getOrganizationAccounts(organizationId: number) {
  return await db
    .select()
    .from(accountsTable)
    .where(and(
      eq(accountsTable.organizationId, organizationId),
      eq(accountsTable.isActive, true)
    ))
    .orderBy(accountsTable.name);
}
```

#### Get Organization Transactions
```typescript
export async function getOrganizationTransactions(
  organizationId: number, 
  limit: number = 50
) {
  return await db
    .select({
      transaction: transactionsTable,
      account: accountsTable,
    })
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
    .where(eq(accountsTable.organizationId, organizationId))
    .orderBy(desc(transactionsTable.transactionDate))
    .limit(limit);
}
```

## Row Level Security (RLS)

### Supabase RLS Policies

#### Users Table Policy
```sql
-- Users can only view and update their own profile
CREATE POLICY "Users can view own profile" ON users_table
  FOR SELECT USING (auth.uid()::text = auth_user_id);

CREATE POLICY "Users can update own profile" ON users_table
  FOR UPDATE USING (auth.uid()::text = auth_user_id);
```

#### Organizations Table Policy
```sql
-- Users can only access organizations they belong to
CREATE POLICY "Users can view own organizations" ON organizations_table
  FOR SELECT USING (
    id IN (
      SELECT organization_id 
      FROM user_organizations_table uo
      JOIN users_table u ON uo.user_id = u.id
      WHERE u.auth_user_id = auth.uid()::text
    )
  );
```

#### Accounts Table Policy
```sql
-- Users can only access accounts in their organizations
CREATE POLICY "Users can view organization accounts" ON accounts_table
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_organizations_table uo
      JOIN users_table u ON uo.user_id = u.id
      WHERE u.auth_user_id = auth.uid()::text
    )
  );
```

## Database Migrations

### Migration Workflow

1. **Modify Schema**: Update `db/schema.ts`
2. **Generate Migration**: Run `npm run db:generate`
3. **Review Migration**: Check generated SQL in `supabase/migrations/`
4. **Apply Migration**: Run `npm run db:migrate`

### Example Migration

```sql
-- Migration: Add budget table
CREATE TABLE budgets_table (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations_table(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories_table(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  period VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, yearly
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL
);

-- Add RLS policy
ALTER TABLE budgets_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view organization budgets" ON budgets_table
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_organizations_table uo
      JOIN users_table u ON uo.user_id = u.id
      WHERE u.auth_user_id = auth.uid()::text
    )
  );
```

## Performance Optimization

### Indexes

#### Primary Indexes
```sql
-- Automatically created by Drizzle
CREATE INDEX idx_users_auth_user_id ON users_table(auth_user_id);
CREATE INDEX idx_accounts_organization_id ON accounts_table(organization_id);
CREATE INDEX idx_transactions_account_id ON transactions_table(account_id);
```

#### Custom Indexes
```sql
-- For transaction date queries
CREATE INDEX idx_transactions_date ON transactions_table(transaction_date DESC);

-- For organization-scoped queries
CREATE INDEX idx_user_organizations_user_id ON user_organizations_table(user_id);
CREATE INDEX idx_user_organizations_org_id ON user_organizations_table(organization_id);

-- For category filtering
CREATE INDEX idx_transactions_category ON transactions_table(category);
```

### Query Optimization

#### Use Proper Joins
```typescript
// Efficient: Single query with join
const transactionsWithAccounts = await db
  .select()
  .from(transactionsTable)
  .innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
  .where(eq(accountsTable.organizationId, organizationId));

// Inefficient: Multiple queries
const accounts = await db.select().from(accountsTable);
const transactions = await Promise.all(
  accounts.map(account => 
    db.select().from(transactionsTable).where(eq(transactionsTable.accountId, account.id))
  )
);
```

#### Pagination
```typescript
export async function getTransactionsPaginated(
  organizationId: number,
  page: number = 1,
  pageSize: number = 20
) {
  const offset = (page - 1) * pageSize;
  
  return await db
    .select()
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
    .where(eq(accountsTable.organizationId, organizationId))
    .orderBy(desc(transactionsTable.transactionDate))
    .limit(pageSize)
    .offset(offset);
}
```

## Data Seeding

### Demo Data (`db/queries/demo.ts`)

```typescript
export async function seedDemoData(organizationId: number) {
  // Create sample accounts
  const accounts = await db.insert(accountsTable).values([
    {
      organizationId,
      name: 'Primary Checking',
      type: 'checking',
      balance: '15000.00',
    },
    {
      organizationId,
      name: 'Savings Account',
      type: 'savings',
      balance: '50000.00',
    },
    {
      organizationId,
      name: 'Business Credit Card',
      type: 'credit',
      balance: '-2500.00',
    },
  ]).returning();

  // Create sample categories
  const categories = await db.insert(categoriesTable).values([
    { organizationId, name: 'Revenue', type: 'income', color: '#10B981' },
    { organizationId, name: 'Office Expenses', type: 'expense', color: '#EF4444' },
    { organizationId, name: 'Marketing', type: 'expense', color: '#F59E0B' },
  ]).returning();

  // Create sample transactions
  const transactions = [];
  for (const account of accounts) {
    // Generate random transactions for each account
    for (let i = 0; i < 10; i++) {
      transactions.push({
        accountId: account.id,
        amount: (Math.random() * 2000 - 1000).toFixed(2),
        description: `Sample transaction ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)].name,
        transactionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }
  }

  await db.insert(transactionsTable).values(transactions);
}
```

## Backup and Recovery

### Automated Backups
Supabase provides automated daily backups for all plans.

### Manual Backup
```bash
# Export database schema
pg_dump --schema-only $DATABASE_URL > schema.sql

# Export data only
pg_dump --data-only $DATABASE_URL > data.sql

# Full backup
pg_dump $DATABASE_URL > full_backup.sql
```

### Point-in-Time Recovery
Supabase Pro plans support point-in-time recovery up to 7 days.

## Monitoring and Maintenance

### Database Monitoring
- Monitor query performance in Supabase dashboard
- Set up alerts for slow queries
- Track connection pool usage
- Monitor storage usage and growth

### Regular Maintenance
- Analyze query performance monthly
- Review and optimize indexes
- Clean up old transaction data if needed
- Update RLS policies as requirements change

### Health Checks
```typescript
export async function healthCheck() {
  try {
    const result = await db.select({ count: sql`count(*)` }).from(usersTable);
    return { status: 'healthy', userCount: result[0].count };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```