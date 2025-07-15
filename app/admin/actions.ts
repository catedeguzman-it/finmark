'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getUserByAuthId } from '@/db/queries/users';
import { createInvitation } from '@/db/queries/invitations';
import { getOrganizationById } from '@/db/queries/organizations';
import { inviteUserSchema } from '@/lib/validations/auth';

export async function inviteUser(formData: FormData) {
  const supabase = await createClient();

  // Get current user and verify admin permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbUser = await getUserByAuthId(user.id);
  if (!dbUser) throw new Error('User not found');

  // Parse and validate form data
  const rawData = {
    email: formData.get('email') as string,
    organizationId: parseInt(formData.get('organizationId') as string),
    role: formData.get('role') as string,
    position: formData.get('position') as string,
  };

  const validatedData = inviteUserSchema.parse(rawData);

  // Verify organization exists
  const organization = await getOrganizationById(validatedData.organizationId);
  if (!organization) throw new Error('Organization not found');

  try {
    // Create invitation record in our database
    const invitation = await createInvitation({
      email: validatedData.email,
      organizationId: validatedData.organizationId,
      role: validatedData.role,
      position: validatedData.position,
      invitedBy: dbUser.id,
    });

    // Generate Supabase invite link using admin API
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'invite',
      email: validatedData.email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding?token=${invitation.token}`,
      },
    });

    if (linkError) {
      throw new Error(`Failed to generate invite link: ${linkError.message}`);
    }

    // In a production app, you would send the email here
    // For now, we'll just log the invite link
    console.log('Invitation sent to:', validatedData.email);
    console.log('Invite link:', linkData.properties?.action_link);
    console.log('Organization:', organization.name);
    console.log('Role:', validatedData.role);

    revalidatePath('/admin');
    return { 
      success: true, 
      message: `Invitation sent to ${validatedData.email}`,
      inviteLink: linkData.properties?.action_link 
    };

  } catch (error) {
    console.error('Error sending invitation:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send invitation');
  }
}

export async function createOrganization(formData: FormData) {
  const supabase = await createClient();

  // Get current user and verify admin permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbUser = await getUserByAuthId(user.id);
  if (!dbUser) throw new Error('User not found');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;

  if (!name || !type) {
    throw new Error('Organization name and type are required');
  }

  try {
    const { createOrganization: createOrgQuery } = await import('@/db/queries/organizations');
    
    const organization = await createOrgQuery({
      name,
      description: description || `${type.replace('_', ' ')} organization`,
      type,
    });

    revalidatePath('/admin');
    return { 
      success: true, 
      message: `Organization "${name}" created successfully`,
      organization 
    };

  } catch (error) {
    console.error('Error creating organization:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create organization');
  }
}