import { redirect } from 'next/navigation';
import { createClient } from '../utils/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FinMark - Financial Analytics Dashboard',
  description: 'Access your comprehensive financial analytics and business intelligence dashboard. Sign in to view real-time financial data and insights.',
};

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect('/dashboard');
  }

  redirect('/login');
}
