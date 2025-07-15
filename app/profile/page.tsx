import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';
import { getUserByAuthId, hasAnyUsers } from '../../db/queries/users';
import ProfileClient from './profile-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your FinMark account profile, update personal information, and configure account settings.',
  openGraph: {
    title: 'User Profile | FinMark',
    description: 'Manage your account profile, update personal information, and configure your FinMark settings.',
  },
  twitter: {
    title: 'User Profile | FinMark',
    description: 'Manage your account profile, update personal information, and configure your FinMark settings.',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ProfilePage() {
  // Check if system needs bootstrap first
  try {
    const systemHasUsers = await hasAnyUsers();
    if (!systemHasUsers) {
      redirect('/bootstrap');
    }
  } catch (error) {
    console.error('Failed to check system state:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('users_table') || errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
      redirect('/bootstrap');
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  // Get user data from database
  let dbUser;
  try {
    dbUser = await getUserByAuthId(data.user.id);
    if (!dbUser) {
      redirect('/onboarding');
    }
    if (!dbUser.isOnboarded) {
      redirect('/onboarding');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    redirect('/onboarding');
  }

  return <ProfileClient user={data.user} dbUser={dbUser} />;
}
