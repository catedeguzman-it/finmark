# AGENTS.md - Development Guidelines for FinMark

## Build/Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Code Style & Conventions
- **TypeScript**: Strict mode enabled, use proper types
- **Imports**: Use `@/` alias for root imports (e.g., `@/components/ui/button`)
- **Components**: Use PascalCase for component names and files
- **Functions**: Use camelCase, prefer arrow functions for components
- **Server Actions**: Mark with `'use server'` directive, handle errors with redirects
- **Client Components**: Mark with `'use client'` directive when needed
- **Styling**: Use Tailwind CSS with `cn()` utility from `@/lib/utils`
- **UI Components**: Use shadcn/ui components from `@/components/ui/`
- **Database**: Use Drizzle ORM with proper type inference
- **Auth**: Use Supabase auth with server-side client creation
- **Error Handling**: Use try/catch blocks, log errors, redirect on failures