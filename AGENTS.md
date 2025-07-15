# AGENTS.md - Development Guidelines for FinMark

## Build/Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio
- No dedicated lint script; install ESLint and run `npx eslint .` for linting
- No test framework; if adding Jest: `npm test` for all, `npm test -- path/to/test.spec.ts` for single

## Code Style & Conventions
- **TypeScript**: Strict mode enabled, use proper types and inference
- **Imports**: Use `@/` alias for root imports (e.g., `@/components/ui/button`)
- **Components**: PascalCase names/files; prefer arrow functions for definitions
- **Functions**: camelCase; use async/await, avoid callbacks
- **Server Actions**: `'use server'` directive; try/catch with error redirects
- **Client Components**: `'use client'` for hooks; optimize for performance
- **Styling**: Tailwind with `cn()` from `@/lib/utils`; consistent class ordering
- **UI Components**: shadcn/ui from `@/components/ui/`; customize via props
- **Database**: Drizzle ORM, type-safe queries from `@/db/schema.ts`
- **Auth**: Supabase SSR; handle sessions in middleware
- **Error Handling**: try/catch, console.log errors, use Next.js error.tsx
- **Formatting**: 2-space indentation; no semicolons if using automatic
- **Naming**: Descriptive, consistent; e.g., use 'handle' prefix for event handlers
- No Cursor/Copilot rules found in .cursor/, .cursorrules, or .github/