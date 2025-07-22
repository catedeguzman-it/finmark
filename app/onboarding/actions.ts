 'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserByAuthId, updateUser, createUser } from '@/db/queries/users';
import { addUserToOrganization, getAllOrganizations, assignRandomOrganizationsToUser } from '@/db/queries/organizations';

export async function onboardUser(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('No user logged in');
  if (!user.email) throw new Error('User email is required');

  let dbUser = await getUserByAuthId(user.id);

  // If user doesn't exist in our database, create them
  if (!dbUser) {
    // Default to 'analyst' role for users without invitation metadata
    const defaultRole = user.user_metadata?.invited_role || 'analyst';
    
    dbUser = await createUser({
      authUserId: user.id,
      email: user.email,
      name: '',
      position: '',
      role: defaultRole,
      isOnboarded: false,
    });
  }

  if (dbUser.isOnboarded) redirect('/dashboard');

  const name = formData.get('name') as string;

  if (!name || name.trim().length < 2) {
    throw new Error('Full name is required and must be at least 2 characters');
  }

  // Get invitation data from user metadata (set during invite)
  // If no invitation metadata exists, default to 'analyst' role for auto-onboarding
  const userRole = user.user_metadata?.invited_role || 'analyst';
  const position = user.user_metadata?.invited_position || '';
  const organizationName = user.user_metadata?.invited_organization || '';

  console.log('DEBUG: Onboarding user with metadata:', {
    userRole,
    position,
    organizationName,
    userMetadata: user.user_metadata,
    isAutoOnboarding: !user.user_metadata?.invited_role,
  });

  // Update user with name, position, and role from invitation metadata
  await updateUser(dbUser.id, { 
    name: name.trim(), 
    position,
    role: userRole,
    isOnboarded: true 
  });

  console.log('DEBUG: User updated successfully with role:', userRole);

  // If there's an organization name, try to find and add user to it
  if (organizationName) {
    const organizations = await getAllOrganizations();
    const organization = organizations.find(org => 
      org.name.toLowerCase() === organizationName.toLowerCase()
    );
    
    if (organization) {
      await addUserToOrganization(dbUser.id, organization.id, true);
    }
  } else {
    // For users without invitation metadata, assign random organizations
    console.log('DEBUG: Auto-onboarding user - assigning random organizations');
    await assignRandomOrganizationsToUser(dbUser.id, 2);
  }

  revalidatePath('/');
  redirect('/dashboard');
}
