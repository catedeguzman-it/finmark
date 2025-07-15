import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';
import { hasAnyUsers, getUserByAuthId } from '@/db/queries/users';
import DashboardClient from './dashboard-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your comprehensive financial analytics dashboard with real-time data, interactive charts, and business intelligence insights.',
  openGraph: {
    title: 'Financial Analytics Dashboard | FinMark',
    description: 'Access real-time financial data, interactive charts, and comprehensive business analytics in your personalized dashboard.',
  },
  twitter: {
    title: 'Financial Analytics Dashboard | FinMark',
    description: 'Access real-time financial data, interactive charts, and comprehensive business analytics in your personalized dashboard.',
  },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  // Check if system needs bootstrap
  try {
    const systemHasUsers = await hasAnyUsers();
    if (!systemHasUsers) {
      redirect('/bootstrap');
    }
  } catch (error) {
    console.error('Failed to check system state:', error);
    // If database tables don't exist, redirect to bootstrap
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('users_table') || errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
      redirect('/bootstrap');
    }
  }

  // Check user onboarding status and get user data
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
    console.error('Error checking user onboarding status:', error);
    redirect('/onboarding');
  }

  return <DashboardClient user={data.user} dbUser={dbUser} />;
}
