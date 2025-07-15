'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '@/utils/supabase/server';
import { getUserByAuthId, getAllUsersWithOrganizations } from '@/db/queries/users';
import { getAllOrganizations, addUserToOrganization } from '@/db/queries/organizations';
import { canManageUsers } from '@/lib/rbac';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { userOrganizationsTable } from '@/db/schema';

export async function inviteUserToSystem(formData: FormData) {
  const supabase = await createClient();

  // Get current user and verify admin permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbUser = await getUserByAuthId(user.id);
  if (!dbUser) throw new Error('User not found');

  // Check if user has admin permissions
  if (!canManageUsers(dbUser.role as any)) {
    throw new Error('Insufficient permissions to invite users');
  }

  // Parse and validate form data
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const position = formData.get('position') as string;

  if (!email || !role) {
    throw new Error('Email and role are required');
  }

  try {
    // Use admin client to send invitation
    const adminClient = createAdminClient();

    const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=${encodeURIComponent('/set-password')}`,
      data: {
        // Store invitation metadata in user metadata
        invited_role: role,
        invited_position: position || '',
        invitation_flow: true,
      }
    });

    if (error) {
      throw new Error(`Failed to invite user: ${error.message}`);
    }

    console.log('Invitation sent to:', email);
    console.log('Role:', role);
    console.log('Position:', position);

    revalidatePath('/profile');
    return { 
      success: true, 
      message: `Invitation sent to ${email}. They will receive an email with setup instructions.`
    };

  } catch (error) {
    console.error('Error sending invitation:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send invitation');
  }
}

export async function assignUserToOrganization(formData: FormData) {
  const supabase = await createClient();

  // Get current user and verify admin permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbUser = await getUserByAuthId(user.id);
  if (!dbUser) throw new Error('User not found');

  // Check if user has admin permissions
  if (!canManageUsers(dbUser.role as any)) {
    throw new Error('Insufficient permissions to assign users');
  }

  const userId = parseInt(formData.get('userId') as string);
  const organizationId = parseInt(formData.get('organizationId') as string);
  const role = formData.get('role') as string;

  if (!userId || !organizationId || !role) {
    throw new Error('Missing required fields');
  }

  try {
    await addUserToOrganization(userId, organizationId, role);
    
    revalidatePath('/profile');
    return { 
      success: true, 
      message: 'User assigned to organization successfully' 
    };

  } catch (error) {
    console.error('Error assigning user to organization:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to assign user');
  }
}

export async function updateUserOrganizationRole(formData: FormData) {
  const supabase = await createClient();

  // Get current user and verify admin permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbUser = await getUserByAuthId(user.id);
  if (!dbUser) throw new Error('User not found');

  // Check if user has admin permissions
  if (!canManageUsers(dbUser.role as any)) {
    throw new Error('Insufficient permissions to update user roles');
  }

  const userId = parseInt(formData.get('userId') as string);
  const organizationId = parseInt(formData.get('organizationId') as string);
  const newRole = formData.get('role') as string;

  if (!userId || !organizationId || !newRole) {
    throw new Error('Missing required fields');
  }

  try {
    await db
      .update(userOrganizationsTable)
      .set({ role: newRole })
      .where(
        eq(userOrganizationsTable.userId, userId) && 
        eq(userOrganizationsTable.organizationId, organizationId)
      );
    
    revalidatePath('/profile');
    return { 
      success: true, 
      message: 'User role updated successfully' 
    };

  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update user role');
  }
}

export async function getOrganizationMembers() {
  const supabase = await createClient();

  // Get current user and verify admin permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbUser = await getUserByAuthId(user.id);
  if (!dbUser) throw new Error('User not found');

  try {
    const members = await getAllUsersWithOrganizations();
    const organizations = await getAllOrganizations();
    
    return { members, organizations };
  } catch (error) {
    console.error('Error fetching organization members:', error);
    throw new Error('Failed to fetch organization members');
  }
}

export async function getPendingInvitations() {
  const supabase = await createClient();

  // Get current user and verify admin permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbUser = await getUserByAuthId(user.id);
  if (!dbUser) throw new Error('User not found');

  // Check if user has admin permissions
  if (!canManageUsers(dbUser.role as any)) {
    throw new Error('Insufficient permissions to view invitations');
  }

  try {
    // Since we're using Supabase's built-in invite system, 
    // we don't track pending invitations in our database anymore.
    // You could implement this by querying Supabase's admin API if needed.
    return [];
  } catch (error) {
    console.error('Error fetching pending invitations:', error);
    throw new Error('Failed to fetch pending invitations');
  }
}