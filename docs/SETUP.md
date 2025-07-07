# FinMark Setup Guide

## Prerequisites

Before setting up FinMark, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase account** for backend services

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finmark
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=your_postgresql_connection_string

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key from the API settings

#### Configure Authentication
1. In Supabase dashboard, go to Authentication > Settings
2. Configure your site URL: `http://localhost:3000`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/confirm`

#### Enable Email Authentication
1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates if needed

### 5. Database Setup

#### Run Migrations
```bash
npm run db:generate
npm run db:migrate
```

#### Push Schema to Supabase
```bash
npm run db:push
```

#### Verify Database Setup
```bash
npm run db:studio
```

This opens Drizzle Studio where you can inspect your database schema.

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 2. Database Management

#### Generate New Migration
After modifying `db/schema.ts`:
```bash
npm run db:generate
```

#### Apply Migrations
```bash
npm run db:migrate
```

#### Reset Database (Development Only)
```bash
npm run db:push
```

### 3. Code Quality

#### Type Checking
```bash
npx tsc --noEmit
```

#### Linting
```bash
npx eslint . --ext .ts,.tsx
```

## Production Deployment

### 1. Vercel Deployment

#### Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Configure build settings (auto-detected for Next.js)

#### Environment Variables
Add the following environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

#### Domain Configuration
1. Configure custom domain if needed
2. Update Supabase site URL to production domain
3. Add production redirect URLs to Supabase

### 2. Supabase Production Setup

#### Update Site URL
In Supabase dashboard:
1. Go to Authentication > Settings
2. Update Site URL to your production domain
3. Add production redirect URLs

#### Configure RLS Policies
Ensure Row Level Security policies are properly configured:

```sql
-- Enable RLS on all tables
ALTER TABLE users_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions_table ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for users
CREATE POLICY "Users can view own profile" ON users_table
  FOR SELECT USING (auth.uid()::text = auth_user_id);
```

## Troubleshooting

### Common Issues

#### 1. Supabase Connection Errors
**Error:** `supabaseUrl is required`

**Solution:**
- Verify environment variables are set correctly
- Check `.env.local` file exists and has correct values
- Restart development server after adding environment variables

#### 2. Database Migration Errors
**Error:** `Migration failed`

**Solution:**
- Check database connection string
- Verify Supabase project is active
- Ensure database permissions are correct

#### 3. Authentication Issues
**Error:** `Invalid login credentials`

**Solution:**
- Verify email confirmation is enabled
- Check Supabase authentication settings
- Ensure redirect URLs are configured correctly

#### 4. Build Errors
**Error:** `Module not found` or TypeScript errors

**Solution:**
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript configuration in `tsconfig.json`
- Verify import paths use `@/` alias correctly

### Development Tips

#### 1. Database Inspection
Use Drizzle Studio to inspect database:
```bash
npm run db:studio
```

#### 2. Supabase Dashboard
Monitor authentication and database activity in Supabase dashboard.

#### 3. Browser DevTools
- Check Network tab for API errors
- Use React DevTools for component debugging
- Monitor Console for JavaScript errors

#### 4. Hot Reloading Issues
If hot reloading stops working:
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Additional Configuration

### 1. Email Templates
Customize authentication emails in Supabase:
1. Go to Authentication > Email Templates
2. Modify confirmation and recovery email templates
3. Update branding and styling

### 2. Custom Domains
For production deployment:
1. Configure custom domain in Vercel
2. Update Supabase site URL
3. Configure SSL certificates

### 3. Analytics
Add analytics tracking:
1. Install analytics package (e.g., Google Analytics)
2. Configure tracking in `app/layout.tsx`
3. Add environment variables for tracking IDs

### 4. Error Monitoring
Set up error monitoring:
1. Install error tracking service (e.g., Sentry)
2. Configure error boundaries
3. Add error reporting to API routes

## Security Checklist

### Development
- [ ] Environment variables are not committed to Git
- [ ] `.env.local` is in `.gitignore`
- [ ] Database credentials are secure
- [ ] Authentication is properly configured

### Production
- [ ] HTTPS is enforced
- [ ] Environment variables are set in deployment platform
- [ ] RLS policies are enabled and tested
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place

## Performance Optimization

### 1. Bundle Analysis
Analyze bundle size:
```bash
npm run build
npx @next/bundle-analyzer
```

### 2. Image Optimization
- Use Next.js Image component
- Configure image domains in `next.config.js`
- Implement lazy loading for images

### 3. Database Optimization
- Add indexes for frequently queried columns
- Implement connection pooling
- Use pagination for large datasets
- Cache frequently accessed data

### 4. Monitoring
Set up monitoring for:
- Application performance
- Database query performance
- Error rates and types
- User authentication flows