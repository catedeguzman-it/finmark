import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { hasAnyUsers } from '@/db/queries/users';

export interface SystemState {
  hasUsers: boolean;
  needsBootstrap: boolean;
  isAuthenticated: boolean;
  user: any | null;
}

/**
 * Server-side utility to check system state and handle redirects
 * This replaces middleware database checks and should be used in page components
 */
export async function checkSystemState(): Promise<SystemState> {
  let hasUsers = false;
  let needsBootstrap = true;
  
  try {
    hasUsers = await hasAnyUsers();
    needsBootstrap = !hasUsers;
  } catch (error) {
    console.error('Database check failed:', error);
    // If database tables don't exist, we need bootstrap
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('users_table') || 
        errorMessage.includes('relation') || 
        errorMessage.includes('does not exist')) {
      hasUsers = false;
      needsBootstrap = true;
    } else {
      // Re-throw unexpected errors
      throw error;
    }
  }

  // Check authentication
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  return {
    hasUsers,
    needsBootstrap,
    isAuthenticated: !!user && !authError,
    user: user || null
  };
}

/**
 * Handle bootstrap redirect logic for pages that should redirect to bootstrap
 * Use this in pages like /login, /dashboard, etc.
 */
export async function handleBootstrapRedirect(): Promise<SystemState> {
  const systemState = await checkSystemState();
  
  if (systemState.needsBootstrap) {
    redirect('/bootstrap');
  }
  
  return systemState;
}

/**
 * Handle bootstrap protection for the bootstrap page itself
 * Redirects to login if system is already bootstrapped
 */
export async function handleBootstrapProtection(): Promise<SystemState> {
  const systemState = await checkSystemState();
  
  if (!systemState.needsBootstrap) {
    redirect('/login');
  }
  
  return systemState;
}

/**
 * Handle authentication redirect logic
 * Use this in pages that require authentication
 */
export async function handleAuthRedirect(): Promise<SystemState> {
  const systemState = await handleBootstrapRedirect(); // First check bootstrap
  
  if (!systemState.isAuthenticated) {
    redirect('/login');
  }
  
  return systemState;
}

/**
 * Handle login page logic
 * Redirects authenticated users to dashboard, unauthenticated to bootstrap if needed
 */
export async function handleLoginRedirect(): Promise<SystemState> {
  const systemState = await checkSystemState();
  
  // If system needs bootstrap, redirect there
  if (systemState.needsBootstrap) {
    redirect('/bootstrap');
  }
  
  // If user is already authenticated, redirect to dashboard
  if (systemState.isAuthenticated) {
    redirect('/dashboard');
  }
  
  return systemState;
}