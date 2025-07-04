# FinMark Modernization Prototype

A functional prototype of **FinMark**, a cloud-native financial management application powered by **Next.js**, **Supabase**, and **Tailwind CSS**. This app demonstrates a modern serverless stack with authentication, data fetching, and UI styling optimized for speed and scalability.

---

## 🛠️ What Was Set Up and Why

### ✅ Tech Stack
- **Next.js 14 (App Router)**: Chosen for its SSR/SSG flexibility and built-in routing system.
- **Supabase**: Used as the backend-as-a-service platform for authentication and PostgreSQL-based data handling.
- **Tailwind CSS**: Enabled fast, utility-first styling with a consistent design system.
- **Vercel**: Used for serverless deployment with environment variable management and CI/CD pipeline.
- **TypeScript**: For type safety and better developer tooling.

### 🔧 Features Implemented
- User authentication with **Supabase** (`signUp` / `signInWithPassword`)
- Dynamic page routing using **Next.js App Router**
- Secure environment variable management through `.env.local` and **Vercel Dashboard**
- Styled, responsive UI with **Tailwind CSS**
- Profile and dashboard pages fetching data from Supabase

---

## 🚧 Challenges Encountered

1. **Missing Environment Variables**  
   - At first, the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` were not recognized due to missing `.env.local` or misconfigured variable scope.

2. **CSS Module Errors**  
   - Build failed due to missing or misreferenced `globals.css` file paths during the early stage setup.

3. **Vercel Deployment Errors**  
   - Deployment crashed due to `supabaseUrl is required` during prerender, which was fixed by ensuring environment variables were added correctly in Vercel’s dashboard and not just locally.

4. **TypeScript Errors on Fresh Builds**  
   - Build broke due to missing `@types/react` and TypeScript not recognizing modules, resolved via correct dev dependency installation.

---

## ✅ What Worked Well

- Supabase setup for authentication and data queries was straightforward once environment variables were configured correctly.
- Tailwind CSS allowed fast and clean UI development with minimal CSS overhead.
- Next.js 14 App Router made routing and layout organization clear and maintainable.
- Local dev workflow with `next dev` and Vercel deployment were fast and productive.

---

## 🔧 What Needs Refinement

- **Environment Variable Visibility**: Add stricter checks or fallback defaults in `supabaseClient.ts` to avoid hard errors during build.
- **Error Handling**: Improve user feedback on Supabase auth errors (e.g., email already in use, incorrect password).
- **Loading State**: Add loading indicators on async actions like login/signup and data fetching.
- **Profile Expansion**: Build richer profile data visualization, edit options, or session-based storage features.

---

## 📦 Deployment

The app is deployed on [Vercel](https://vercel.com), connected directly to the GitHub repository for continuous deployment.

---

## 🧠 Summary

This prototype serves as a strong foundation for a full-featured financial app using a modern JAMstack approach. Future iterations can expand features like OAuth login, protected routes, role-based access control, and real-time sync with Supabase.

