import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getUserByAuthId } from '@/db/queries/users';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  // If there's an auth error or no user, redirect to login
  if (
    (error || !user) &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/api/')
  ) {
    // Clear any invalid session cookies
    if (error) {
      supabaseResponse.cookies.delete('sb-access-token');
      supabaseResponse.cookies.delete('sb-refresh-token');
    }
    
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Check for onboarding
  if (user && !request.nextUrl.pathname.startsWith('/onboarding') && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth') && !request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const dbUser = await getUserByAuthId(user.id);
      if (!dbUser) {
        // User exists in Supabase auth but not in our database - redirect to onboarding
        console.log(`User ${user.id} not found in database, redirecting to onboarding`);
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
      }
      if (!dbUser.isOnboarded) {
        console.log(`User ${user.id} not onboarded, redirecting to onboarding`);
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Error checking user onboarding status:', error);
      
      // Check if it's a connection error vs other database error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Failed query') || errorMessage.includes('connection')) {
        console.error('Database connection issue detected, allowing request to proceed');
        // For connection issues, let the request proceed rather than redirect
        // The individual pages can handle the database connection issues
        return supabaseResponse;
      }
      
      // For other errors, redirect to onboarding to be safe
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object

  return supabaseResponse;
} 