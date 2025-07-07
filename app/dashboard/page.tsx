import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';
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

  return <DashboardClient user={data.user} />;
}
