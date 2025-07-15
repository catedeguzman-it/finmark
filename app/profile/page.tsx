import { redirect } from 'next/navigation';
import { handleAuthRedirect } from '@/utils/bootstrap-check';
import { getUserByAuthId } from '../../db/queries/users';
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
  // Handle bootstrap and auth checks
  const systemState = await handleAuthRedirect();

  // Get user data from database
  let dbUser;
  try {
    dbUser = await getUserByAuthId(systemState.user.id);
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

  return <ProfileClient user={systemState.user} dbUser={dbUser} />;
}
