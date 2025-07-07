# FinMark API Documentation

## Overview

FinMark uses a combination of Next.js Server Actions, Supabase client-side operations, and custom database queries to handle data operations. This document outlines the available APIs and their usage patterns.

## Authentication APIs

### Server Actions (`app/login/actions.ts`)

#### `signUp(formData: FormData)`
Creates a new user account with email confirmation.

**Parameters:**
- `email`: User's email address
- `password`: User's password
- `name`: User's display name

**Returns:**
- Redirects to confirmation page on success
- Redirects to error page on failure

**Example:**
```typescript
const formData = new FormData();
formData.append('email', 'user@example.com');
formData.append('password', 'securepassword');
formData.append('name', 'John Doe');
await signUp(formData);
```

#### `signIn(formData: FormData)`
Authenticates existing user with email and password.

**Parameters:**
- `email`: User's email address
- `password`: User's password

**Returns:**
- Redirects to dashboard on success
- Redirects to error page on failure

### Authentication Routes

#### `GET /auth/callback`
Handles OAuth callback and email confirmation.

#### `GET /auth/confirm`
Confirms email verification tokens.

## Database Query APIs

### User Queries (`db/queries/users.ts`)

#### `getUserByAuthId(authUserId: string)`
Retrieves user profile by Supabase auth ID.

**Parameters:**
- `authUserId`: Supabase auth.users.id

**Returns:**
```typescript
{
  id: number;
  authUserId: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `createUser(userData: InsertUser)`
Creates a new user profile record.

**Parameters:**
```typescript
{
  authUserId: string;
  name: string;
  email: string;
}
```

### Organization Queries (`db/queries/organizations.ts`)

#### `getUserOrganizations(userId: number)`
Retrieves all organizations for a user with their role.

**Returns:**
```typescript
Array<{
  organization: {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  role: string;
}>
```

#### `getOrganizationAccounts(organizationId: number)`
Retrieves all financial accounts for an organization.

**Returns:**
```typescript
Array<{
  id: number;
  organizationId: number;
  name: string;
  type: string;
  balance: string;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}>
```

#### `getOrganizationTransactions(organizationId: number, limit?: number)`
Retrieves recent transactions for an organization.

**Parameters:**
- `organizationId`: Organization ID
- `limit`: Maximum number of transactions (optional)

**Returns:**
```typescript
Array<{
  id: number;
  accountId: number;
  amount: string;
  description: string;
  category: string | null;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}>
```

### Demo Data Queries (`db/queries/demo.ts`)

#### `seedDemoData(organizationId: number)`
Populates organization with sample financial data.

**Parameters:**
- `organizationId`: Target organization ID

**Creates:**
- Sample accounts (checking, savings, credit card)
- Sample transactions with various categories
- Sample categories for income and expenses

## Utility APIs

### Financial Data Utils (`utils/getFinancialData.ts`)

#### `getFinancialData()`
Generates mock financial data for dashboard visualization.

**Returns:**
```typescript
{
  revenue: Array<{month: string, value: number}>;
  expenses: Array<{month: string, value: number}>;
  profit: Array<{month: string, value: number}>;
  cashFlow: Array<{month: string, inflow: number, outflow: number}>;
}
```

### Organization-Scoped Data (`utils/getOrgScopedFinancialData.ts`)

#### `getOrgScopedFinancialData(organizationId: number)`
Retrieves real financial data for a specific organization.

**Parameters:**
- `organizationId`: Organization ID

**Returns:**
```typescript
{
  accounts: SelectAccount[];
  transactions: SelectTransaction[];
  totalBalance: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
}
```

### Export Utils (`utils/exportUtils.ts`)

#### `exportToPDF(data: any[], filename: string)`
Exports data to PDF format using jsPDF.

#### `exportToCSV(data: any[], filename: string)`
Exports data to CSV format.

#### `exportToJSON(data: any[], filename: string)`
Exports data to JSON format.

## Supabase Client APIs

### Server Client (`utils/supabase/server.ts`)

#### `createClient()`
Creates a Supabase client for server-side operations.

**Usage:**
```typescript
import { createClient } from '@/utils/supabase/server';

const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### Browser Client (`utils/supabase/client.ts`)

#### `createClient()`
Creates a Supabase client for client-side operations.

**Usage:**
```typescript
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();
await supabase.auth.signOut();
```

## Dashboard Data APIs

### Dashboard Data (`app/dashboard/data/`)

#### Organizations Data
- `getOrganizations()`: Retrieves user's organizations
- `getOrganizationDetails(id)`: Gets detailed organization info

#### Users Data
- `getCurrentUser()`: Gets current authenticated user
- `getUserProfile(id)`: Gets user profile information

#### Dashboards Data
- `getDashboardData(orgId)`: Gets dashboard metrics
- `getChartData(orgId, type)`: Gets chart-specific data

## Error Handling

### Standard Error Responses
All APIs follow consistent error handling patterns:

```typescript
try {
  // API operation
} catch (error) {
  console.error('Operation failed:', error);
  redirect('/error');
}
```

### Common Error Types
- **Authentication errors**: Invalid credentials, expired sessions
- **Authorization errors**: Insufficient permissions, invalid organization access
- **Validation errors**: Invalid input data, missing required fields
- **Database errors**: Connection issues, constraint violations

## Rate Limiting

### Supabase Limits
- **Authentication**: 30 requests per hour per IP
- **Database queries**: Based on Supabase plan limits
- **Real-time subscriptions**: Connection limits per plan

### Best Practices
- Implement client-side caching for frequently accessed data
- Use pagination for large datasets
- Batch operations where possible
- Implement retry logic with exponential backoff

## Security Considerations

### Authentication
- All database operations require valid Supabase session
- Row Level Security (RLS) policies enforce data isolation
- Server-side validation for all user inputs

### Data Access
- Organization-scoped queries prevent cross-tenant data access
- Parameterized queries prevent SQL injection
- Input validation using Zod schemas

### API Security
- HTTPS enforcement in production
- Environment variable protection for sensitive keys
- CORS configuration for allowed origins

## Development Guidelines

### Adding New APIs
1. Define TypeScript interfaces for request/response
2. Implement server-side validation
3. Add error handling and logging
4. Update this documentation
5. Add tests for new endpoints

### Testing APIs
- Use Drizzle Studio for database inspection
- Test authentication flows in development
- Validate organization scoping
- Test error scenarios and edge cases

### Performance Optimization
- Use database indexes for common queries
- Implement caching strategies
- Optimize query patterns
- Monitor API response times