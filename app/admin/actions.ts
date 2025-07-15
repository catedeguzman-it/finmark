'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getUserByAuthId, getUserByEmail } from '@/db/queries/users';
import { getOrganizationById } from '@/db/queries/organizations';
import { inviteUserSchema } from '@/lib/validations/auth';

export async function inviteUser(formData: FormData) {
  const supabase = await createClient();

  // Get current user and verify admin permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbUser = await getUserByAuthId(user.id);
  if (!dbUser) throw new Error('User not found');
  
  // Check if user has admin permissions (you may want to implement proper RBAC here)
  if (dbUser.role !== 'admin') {
    throw new Error('Insufficient permissions. Only admins can invite users.');
  }

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

  // Check if user already exists with this email
  const existingUser = await getUserByEmail(validatedData.email);
  if (existingUser) {
    throw new Error('A user with this email already exists in the system.');
  }

  try {
    // Call the API route to send the invitation
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validatedData.email,
        organizationName: organization.name,
        role: validatedData.role,
        position: validatedData.position,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send invitation');
    }

    const result = await response.json();

    revalidatePath('/admin');
    return { 
      success: true, 
      message: `Invitation sent to ${validatedData.email}`,
      inviteLink: result.inviteLink 
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