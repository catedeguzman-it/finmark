# FinMark Architecture Documentation

## Overview

FinMark is a modern cloud-native financial management application built with Next.js 15, Supabase, and TypeScript. The application follows a modular architecture with clear separation of concerns between frontend components, backend services, and data management.

## Technology Stack

### Frontend
- **Next.js 15** with App Router for server-side rendering and routing
- **React 19** for component-based UI development
- **TypeScript** for type safety and developer experience
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent UI components
- **Recharts** for data visualization and charts

### Backend & Database
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations
- **Drizzle Kit** for database migrations and schema management

### Development & Deployment
- **Vercel** for hosting and deployment
- **ESLint** and **TypeScript** for code quality
- **PostCSS** and **Autoprefixer** for CSS processing

## Project Structure

```
finmark/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication routes
│   ├── dashboard/                # Dashboard pages and components
│   ├── login/                    # Login page and actions
│   ├── profile/                  # User profile pages
│   └── layout.tsx                # Root layout
├── components/                   # Reusable React components
│   ├── dashboards/               # Dashboard-specific components
│   ├── ui/                       # shadcn/ui components
│   └── *.tsx                     # Shared components
├── db/                           # Database layer
│   ├── queries/                  # Database query functions
│   ├── index.ts                  # Database connection
│   └── schema.ts                 # Drizzle schema definitions
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
├── utils/                        # Utility functions
│   ├── supabase/                 # Supabase client configurations
│   └── *.ts                      # Helper functions
├── styles/                       # Global styles
└── docs/                         # Documentation
```

## Core Components

### Authentication System
- **Supabase Auth** integration for user management
- **Server-side authentication** using Supabase SSR
- **Middleware protection** for authenticated routes
- **Role-based access control** through organization memberships

### Database Schema
The application uses a relational database schema with the following main entities:

#### Users Table
- Extends Supabase auth.users with additional profile information
- Links to Supabase auth system via `authUserId`

#### Organizations Table
- Multi-tenant architecture supporting multiple organizations
- Users can belong to multiple organizations with different roles

#### Accounts Table
- Financial accounts (checking, savings, credit, investment)
- Organization-scoped with balance tracking and currency support

#### Transactions Table
- Financial transaction records linked to accounts
- Categorization and date tracking for reporting

#### Categories Table
- Organization-specific transaction categories
- Support for income/expense classification with color coding

### Dashboard System
- **Modular dashboard components** for different business domains
- **Real-time data visualization** using Recharts
- **Responsive design** with mobile-first approach
- **Export functionality** for reports and data

## Data Flow

### Authentication Flow
1. User accesses protected route
2. Middleware checks authentication status
3. Redirects to login if unauthenticated
4. Supabase handles authentication process
5. User session established with organization context

### Data Access Pattern
1. **Server Components** fetch initial data using Supabase server client
2. **Client Components** handle interactive features and real-time updates
3. **Database queries** use Drizzle ORM with type safety
4. **Organization scoping** ensures data isolation between tenants

### Component Architecture
- **Server Components** for initial data loading and SEO
- **Client Components** for interactivity and state management
- **Custom hooks** for shared logic and state
- **UI components** from shadcn/ui for consistency

## Security Considerations

### Authentication & Authorization
- **JWT-based authentication** through Supabase
- **Row Level Security (RLS)** policies in PostgreSQL
- **Organization-based data isolation**
- **Server-side session validation**

### Data Protection
- **Environment variable management** for sensitive configuration
- **HTTPS enforcement** in production
- **Input validation** using Zod schemas
- **SQL injection prevention** through Drizzle ORM

## Performance Optimizations

### Frontend Performance
- **Server-side rendering** for initial page loads
- **Static generation** where applicable
- **Component lazy loading** for large dashboards
- **Image optimization** through Next.js

### Database Performance
- **Indexed queries** for common access patterns
- **Connection pooling** through Supabase
- **Query optimization** using Drizzle ORM
- **Caching strategies** for frequently accessed data

## Deployment Architecture

### Vercel Deployment
- **Automatic deployments** from Git repository
- **Environment variable management** through Vercel dashboard
- **Edge functions** for global performance
- **Preview deployments** for feature branches

### Database Hosting
- **Supabase managed PostgreSQL** with automatic backups
- **Connection pooling** for scalability
- **Real-time subscriptions** for live updates
- **Geographic distribution** for global access

## Development Workflow

### Local Development
1. Clone repository and install dependencies
2. Set up environment variables for Supabase
3. Run database migrations using Drizzle Kit
4. Start development server with `npm run dev`

### Database Management
1. Schema changes in `db/schema.ts`
2. Generate migrations with `npm run db:generate`
3. Apply migrations with `npm run db:migrate`
4. Use Drizzle Studio for database inspection

### Code Quality
- **TypeScript strict mode** for type safety
- **ESLint configuration** for code standards
- **Component testing** strategies
- **Git hooks** for pre-commit validation

## Scalability Considerations

### Horizontal Scaling
- **Stateless application design** for easy scaling
- **Database connection pooling** for concurrent users
- **CDN integration** for static asset delivery
- **Microservice readiness** for future expansion

### Vertical Scaling
- **Efficient database queries** to reduce load
- **Component optimization** for rendering performance
- **Memory management** in React components
- **Bundle size optimization** for faster loading

## Future Architecture Considerations

### Potential Enhancements
- **Real-time collaboration** features using Supabase realtime
- **Advanced analytics** with dedicated data warehouse
- **Mobile application** using React Native
- **API gateway** for external integrations
- **Microservices migration** for complex business logic
- **Event-driven architecture** for audit trails and notifications