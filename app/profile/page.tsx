import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';
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
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return <ProfileClient user={data.user} />;
}
