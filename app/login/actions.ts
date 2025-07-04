'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';
import { createUser, getUserByAuthId, getUserByEmail } from '../../src/db/queries/users';

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Login error:', error);
    redirect('/error?message=' + encodeURIComponent('Invalid email or password'));
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Signup error:', error);
    redirect('/error?message=' + encodeURIComponent(error.message));
  }

  // Create user in our database after successful Supabase auth
  if (authData.user) {
    try {
      await createUser({
        authUserId: authData.user.id,
        email: authData.user.email!,
        name: authData.user.user_metadata?.full_name || authData.user.email!.split('@')[0],
      });
    } catch (dbError) {
      console.error('Error creating user in database:', dbError);
      // Continue anyway as the auth user was created successfully
    }
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google OAuth error:', error);
    redirect('/error?message=' + encodeURIComponent('Google authentication failed'));
  }

  if (data.url) {
    redirect(data.url);
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
        console.log('Found existing user by email, linking OAuth account');
        // User exists with this email but different auth method
        // We should update their authUserId to link the accounts
        // Note: This is a simplified approach. In production, you might want
        // to implement a more sophisticated account linking flow
        
        // For now, we'll create a new user record as Supabase handles auth linking
        dbUser = await createUser({
          authUserId: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || 
                authUser.user_metadata?.name || 
                existingUserByEmail.name ||
                authUser.email.split('@')[0],
        });
      } else {
        // Create new user record
        dbUser = await createUser({
          authUserId: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || 
                authUser.user_metadata?.name || 
                authUser.email.split('@')[0],
        });
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