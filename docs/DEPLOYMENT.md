# FinMark Deployment Guide

## Overview

FinMark is designed for cloud-native deployment with Vercel as the primary hosting platform and Supabase for backend services. This guide covers deployment strategies, environment configuration, and production best practices.

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │  Vercel Edge    │    │   Supabase      │
│   (Static)      │────│   Functions     │────│   (Database)    │
│                 │    │   (API Routes)  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐              ┌─────────┐          ┌─────────────┐
    │ Browser │              │ Server  │          │ PostgreSQL  │
    │ Client  │              │ Actions │          │ Database    │
    └─────────┘              └─────────┘          └─────────────┘
```

## Vercel Deployment

### 1. Repository Setup

#### Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Select the repository and configure settings

#### Project Configuration
```json
{
  "name": "finmark-production",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### 2. Environment Variables

#### Required Environment Variables
Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Next.js
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key
```

#### Environment-Specific Variables
Configure different values for different environments:

**Production:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXTAUTH_URL=https://finmark.yourdomain.com
```

**Preview (Staging):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXTAUTH_URL=https://staging-finmark.yourdomain.com
```

**Development:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXTAUTH_URL=http://localhost:3000
```

### 3. Build Configuration

#### `vercel.json` Configuration
```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### Next.js Configuration (`next.config.js`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif']
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
```

## Supabase Production Setup

### 1. Project Configuration

#### Create Production Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project for production
3. Choose appropriate region (close to your users)
4. Select suitable database plan

#### Database Configuration
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set up connection pooling
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
```

### 2. Authentication Setup

#### Site URL Configuration
```
Site URL: https://your-production-domain.com
Redirect URLs:
- https://your-production-domain.com/auth/callback
- https://your-production-domain.com/auth/confirm
```

#### Email Templates
Customize authentication emails:

**Confirmation Email:**
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your account</a></p>
```

**Password Recovery:**
```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

### 3. Row Level Security

#### Enable RLS on All Tables
```sql
-- Enable RLS
ALTER TABLE users_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories_table ENABLE ROW LEVEL SECURITY;

-- Create policies (see DATABASE.md for detailed policies)
```

### 4. Database Migrations

#### Production Migration Strategy
```bash
# 1. Backup current database
pg_dump $PRODUCTION_DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Test migrations on staging
npm run db:migrate

# 3. Apply to production during maintenance window
npm run db:migrate
```

## Custom Domain Setup

### 1. Domain Configuration

#### Add Custom Domain in Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

#### DNS Configuration
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### 2. SSL Certificate
Vercel automatically provisions SSL certificates for custom domains.

### 3. Update Supabase Configuration
Update Site URL in Supabase to use custom domain:
```
Site URL: https://yourdomain.com
```

## Environment Management

### 1. Multiple Environments

#### Environment Structure
```
Production:  https://finmark.yourdomain.com
Staging:     https://staging-finmark.yourdomain.com
Development: http://localhost:3000
```

#### Branch-based Deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main, staging, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          scope: ${{ secrets.TEAM_ID }}
```

### 2. Environment Variables Management

#### Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add DATABASE_URL production

# Pull environment variables
vercel env pull .env.local
```

## Monitoring and Observability

### 1. Application Monitoring

#### Vercel Analytics
Enable Vercel Analytics in project settings:
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Error Tracking
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure Sentry
# sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Database Monitoring

#### Supabase Dashboard
Monitor in Supabase Dashboard:
- Database performance
- Query execution times
- Connection pool usage
- Storage usage

#### Custom Health Checks
```typescript
// app/api/health/route.ts
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('users_table').select('count').limit(1);
    
    if (error) throw error;
    
    return Response.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    );
  }
}
```

## Performance Optimization

### 1. Build Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

#### Code Splitting
```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const DashboardChart = dynamic(() => import('@/components/DashboardChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false
});
```

### 2. Database Optimization

#### Connection Pooling
Configure in Supabase:
```
Pool Size: 15
Pool Timeout: 10s
Pool Max Lifetime: 1h
```

#### Query Optimization
```typescript
// Use proper indexes and limit results
const transactions = await db
  .select()
  .from(transactionsTable)
  .where(eq(transactionsTable.accountId, accountId))
  .orderBy(desc(transactionsTable.transactionDate))
  .limit(50); // Always limit large queries
```

### 3. Caching Strategy

#### Static Generation
```typescript
// app/dashboard/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <Dashboard data={data} />;
}
```

#### API Route Caching
```typescript
// app/api/data/route.ts
export async function GET() {
  const data = await fetchData();
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  });
}
```

## Security Configuration

### 1. Security Headers

#### Content Security Policy
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      connect-src 'self' *.supabase.co;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

### 2. Environment Security

#### Secrets Management
```bash
# Use Vercel's secret management
vercel secrets add database-url "postgresql://..."
vercel secrets add supabase-service-key "your-service-key"
```

#### Access Control
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return res;
}
```

## Backup and Disaster Recovery

### 1. Database Backups

#### Automated Backups
Supabase provides automated daily backups. For additional protection:

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backup_${DATE}.sql"
aws s3 cp "backup_${DATE}.sql" s3://your-backup-bucket/
```

### 2. Application Backup

#### Code Repository
- Ensure code is backed up in Git
- Use multiple remotes for redundancy
- Tag releases for easy rollback

#### Configuration Backup
```bash
# Export Vercel configuration
vercel env pull .env.production
vercel project ls > project-config.json
```

## Rollback Procedures

### 1. Application Rollback

#### Vercel Rollback
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

#### Git-based Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard [commit-hash]
git push --force origin main
```

### 2. Database Rollback

#### Migration Rollback
```bash
# Rollback last migration
npm run db:rollback

# Restore from backup
psql $DATABASE_URL < backup_20231201_120000.sql
```

## Maintenance Procedures

### 1. Regular Maintenance

#### Weekly Tasks
- Review application performance metrics
- Check error logs and resolve issues
- Monitor database performance
- Update dependencies if needed

#### Monthly Tasks
- Analyze bundle size and optimize
- Review and update security headers
- Database maintenance and optimization
- Backup verification

### 2. Update Procedures

#### Dependency Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Test thoroughly before deploying
npm run build
npm run test
```

#### Security Updates
```bash
# Check for security vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Manual review for breaking changes
npm audit fix --force
```