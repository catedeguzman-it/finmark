import { redirect } from 'next/navigation';
import { handleAuthRedirect } from '@/utils/bootstrap-check';
import { getUserByAuthId } from '@/db/queries/users';
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
  // Handle bootstrap and auth checks
  const systemState = await handleAuthRedirect();

  // Check user onboarding status and get user data
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
    console.error('Error checking user onboarding status:', error);
    redirect('/onboarding');
  }

  return <DashboardClient user={systemState.user} dbUser={dbUser} />;
}
