import { redirect } from 'next/navigation';
import { handleBootstrapRedirect } from '@/utils/bootstrap-check';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FinMark - Financial Analytics Dashboard',
  description: 'Access your comprehensive financial analytics and business intelligence dashboard. Sign in to view real-time financial data and insights.',
};

export default async function Home() {
  // Check system state and handle redirects
  const systemState = await handleBootstrapRedirect();

  if (systemState.isAuthenticated) {
    redirect('/dashboard');
  }

  redirect('/login');
}
