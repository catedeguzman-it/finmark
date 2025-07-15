 'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserByAuthId, updateUser, createUser } from '@/db/queries/users';
import { addUserToOrganization } from '@/db/queries/organizations';
import { getValidInvitation, acceptInvitation } from '@/db/queries/invitations';

export async function onboardUser(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('No user logged in');

  let dbUser = await getUserByAuthId(user.id);

  // If user doesn't exist in our database, create them
  if (!dbUser) {
    dbUser = await createUser({
      authUserId: user.id,
      email: user.email!,
      name: '',
      position: '',
      role: 'member',
      isOnboarded: false,
    });
  }

  if (dbUser.isOnboarded) redirect('/dashboard');

  const name = formData.get('name') as string;
  const invitationToken = formData.get('invitationToken') as string;

  if (!name) {
    throw new Error('Full name is required');
  }

  let organizationId: number | null = null;
  let userRole = 'member';
  let position = '';

  // Handle invitation flow
  if (invitationToken) {
    const invitation = await getValidInvitation(invitationToken);
    
    if (!invitation) {
      throw new Error('Invalid or expired invitation');
    }

    // Verify email matches
    if (invitation.email !== user.email) {
      throw new Error('This invitation was sent to a different email address');
    }

    organizationId = invitation.organizationId;
    userRole = invitation.role;
    position = invitation.position || '';

    // Accept the invitation
    await acceptInvitation(invitationToken);
  } else {
    // For now, users without invitations cannot complete onboarding
    // In a full implementation, you might want to redirect them to a waiting page
    throw new Error('You need an invitation to join FinMark. Please contact your administrator.');
  }

  // Update user with name and position
  await updateUser(dbUser.id, { 
    name, 
    position, 
    isOnboarded: true 
  });

  // Add user to organization if they have an invitation
  if (organizationId) {
    await addUserToOrganization(dbUser.id, organizationId, userRole);
  }

  revalidatePath('/');
  redirect('/dashboard');
}
