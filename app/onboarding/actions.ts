 'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserByAuthId, updateUser, createUser } from '@/db/queries/users';
import { addUserToOrganization, getAllOrganizations } from '@/db/queries/organizations';

export async function onboardUser(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('No user logged in');
  if (!user.email) throw new Error('User email is required');

  let dbUser = await getUserByAuthId(user.id);

  // If user doesn't exist in our database, create them
  if (!dbUser) {
    dbUser = await createUser({
      authUserId: user.id,
      email: user.email,
      name: '',
      position: '',
      role: 'member',
      isOnboarded: false,
    });
  }

  if (dbUser.isOnboarded) redirect('/dashboard');

  const name = formData.get('name') as string;

  if (!name || name.trim().length < 2) {
    throw new Error('Full name is required and must be at least 2 characters');
  }

  // Get invitation data from user metadata (set during invite)
  const userRole = user.user_metadata?.invited_role || 'member';
  const position = user.user_metadata?.invited_position || '';
  const organizationName = user.user_metadata?.invited_organization || '';

  try {
    // Update user with name, position, and role from invitation metadata
    await updateUser(dbUser.id, { 
      name: name.trim(), 
      position,
      role: userRole,
      isOnboarded: true 
    });

    // If there's an organization name, try to find and add user to it
    if (organizationName) {
      const organizations = await getAllOrganizations();
      const organization = organizations.find(org => 
        org.name.toLowerCase() === organizationName.toLowerCase()
      );
      
      if (organization) {
        await addUserToOrganization(dbUser.id, organization.id, userRole);
      }
    }

    revalidatePath('/');
    redirect('/dashboard');
  } catch (error) {
    console.error('Error during onboarding:', error);
    throw new Error('Failed to complete onboarding. Please try again.');
  }
}
