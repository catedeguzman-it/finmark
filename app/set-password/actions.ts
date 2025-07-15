'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function setUserPassword(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('No user logged in');

  const password = formData.get('password') as string;

  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  try {
    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      throw new Error(`Failed to set password: ${error.message}`);
    }

    revalidatePath('/');
    redirect('/onboarding');
  } catch (error) {
    console.error('Error setting password:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to set password');
  }
}