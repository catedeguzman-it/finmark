'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { createUser, getUserByAuthId, getUserByEmail, updateUser } from '@/db/queries/users';
import { assignRandomOrganizationsToUser } from '@/db/queries/organizations';
import { getURL } from '@/utils/site-url';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Validate input
  if (!data.email || !data.password) {
    return { error: 'Email and password are required' };
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Login error:', error);

    // Provide more specific error messages
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password' };
    } else if (error.message.includes('Email not confirmed')) {
      return { error: 'Please check your email and confirm your account' };
    } else {
      return { error: 'Login failed. Please try again.' };
    }
  }

  // Only redirect if login was successful
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Validate input
  if (!data.email || !data.password) {
    return { error: 'Email and password are required' };
  }

  // Check if user already exists in our database
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    return { error: 'An account with this email already exists. Please sign in instead.' };
  }

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Signup error:', error);

    // Provide more specific error messages
    if (error.message.includes('User already registered')) {
      return { error: 'An account with this email already exists. Please sign in instead.' };
    } else if (error.message.includes('Password should be at least')) {
      return { error: 'Password must be at least 6 characters long' };
    } else {
      return { error: error.message || 'Account creation failed. Please try again.' };
    }
  }

  // Create user in our database after successful Supabase auth
  if (authData.user) {
    // Default to 'analyst' role for users without invitation metadata
    const defaultRole = authData.user.user_metadata?.invited_role || 'analyst';
    
    const dbUser = await createUser({
      authUserId: authData.user.id,
      email: authData.user.email!,
      name: authData.user.user_metadata?.full_name || authData.user.email!.split('@')[0],
      role: defaultRole,
    });
    
    // For users without invitation metadata, assign random organizations
    if (!authData.user.user_metadata?.invited_role) {
      console.log('Auto-onboarding signup user - assigning random organizations');
      await assignRandomOrganizationsToUser(dbUser.id, 2);
    }

    // If we get here, either user was created or existing user was returned
    console.log('User synced successfully:', dbUser.email);
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  
  // Get the redirect URL using Supabase's recommended pattern
  const baseUrl = getURL();
  const redirectUrl = `${baseUrl}auth/callback`;
  
  console.log('🔍 OAuth Debug Info:');
  console.log('Base URL from getURL():', baseUrl);
  console.log('Full redirect URL:', redirectUrl);
  console.log('Environment variables:', {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    VERCEL_URL: process.env.VERCEL_URL,
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google OAuth error:', error);
    return { error: 'Google authentication failed. Please try again.' };
  }

  if (data.url) {
    redirect(data.url);
  } else {
    return { error: 'Failed to initiate Google authentication' };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

// Helper function to sync user data after OAuth login with email linking
export async function syncUserAfterOAuth(authUser: any) {
  try {
    console.log('Syncing OAuth user:', authUser.email);

    // Check if user already exists in our database by auth ID
    let dbUser = await getUserByAuthId(authUser.id);

    if (!dbUser) {
      // Check if a user with this email already exists (from email/password signup)
      const existingUserByEmail = await getUserByEmail(authUser.email);

      if (existingUserByEmail) {
        console.log('Found existing user by email, updating auth ID');
        // Update existing user with new auth ID to link accounts
        dbUser = await updateUser(existingUserByEmail.id, {
          authUserId: authUser.id,
          name: authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            existingUserByEmail.name,
        });
      } else {
        // Create new user record
        // Default to 'analyst' role for users without invitation metadata
        const defaultRole = authUser.user_metadata?.invited_role || 'analyst';
        
        dbUser = await createUser({
          authUserId: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            authUser.email.split('@')[0],
          role: defaultRole,
        });
        
        // For users without invitation metadata, assign random organizations
        if (!authUser.user_metadata?.invited_role) {
          console.log('Auto-onboarding OAuth user - assigning random organizations');
          await assignRandomOrganizationsToUser(dbUser.id, 2);
        }
      }

      console.log('User created/linked successfully:', dbUser.email);
    } else {
      console.log('User already exists in database:', dbUser.email);
    }

    return dbUser;
  } catch (error) {
    console.error('Error syncing user after OAuth:', error);
    throw error; // Re-throw to handle in callback
  }
} 
