import { createClient } from '../../utils/supabase/server';
import { createUser, getUserByAuthId } from './users';
import { assignRandomOrganizationsToUser } from './organizations';

/**
 * Get the current authenticated user from Supabase and sync with our database
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Try to get user from our database
  let dbUser = await getUserByAuthId(user.id);
  
  // If user doesn't exist in our database, create them
  if (!dbUser) {
    try {
      // Default to 'analyst' role for users without invitation metadata
      const defaultRole = user.user_metadata?.invited_role || 'analyst';
      
      dbUser = await createUser({
        authUserId: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || 
              user.user_metadata?.name || 
              user.email!.split('@')[0],
        role: defaultRole,
      });
      
      // For users without invitation metadata, assign random organizations
      if (!user.user_metadata?.invited_role) {
        console.log('Auto-onboarding getCurrentUser - assigning random organizations');
        await assignRandomOrganizationsToUser(dbUser.id, 2);
      }
    } catch (error) {
      console.error('Error creating user in database:', error);
      return null;
    }
  }

  return {
    auth: user,
    profile: dbUser,
  };
}

/**
 * Check if the current user is authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
} 