'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { createUser, hasAnyUsers } from '@/db/queries/users';
import { createOrganization, addUserToOrganization } from '@/db/queries/organizations';

export async function createRootAdmin(formData: FormData) {
  // Double-check that no users exist before proceeding
  const usersExist = await hasAnyUsers();
  if (usersExist) {
    throw new Error('System already has users. Root admin creation is not allowed.');
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validate inputs
  if (!name || !email || !password || !confirmPassword) {
    throw new Error('All fields are required');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const supabase = await createClient();

  try {
    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (authError) {
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Failed to create user account');
    }

    // Create default organization for the root admin
    const defaultOrg = await createOrganization({
      name: 'Default Organization',
      description: 'Default organization for FinMark',
      type: 'enterprise',
    });

    // Create user in our database with root admin role
    const dbUser = await createUser({
      authUserId: authData.user.id,
      email: authData.user.email!,
      name,
      position: 'Root Administrator',
      role: 'root_admin',
      isOnboarded: true,
    });

    // Add user to the default organization as default
    await addUserToOrganization(dbUser.id, defaultOrg.id, true);

    // Sign in the user automatically
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Auto sign-in failed:', signInError);
      // Don't throw here - user was created successfully, they can sign in manually
    }

  } catch (error: any) {
    console.error('Root admin creation failed:', error);
    throw new Error(error.message || 'Failed to create root admin account');
  }

  revalidatePath('/');
  redirect('/dashboard');
}