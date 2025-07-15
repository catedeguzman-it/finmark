import { redirect } from 'next/navigation';
import { createClient } from '../utils/supabase/server';
import { hasAnyUsers } from '@/db/queries/users';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FinMark - Financial Analytics Dashboard',
  description: 'Access your comprehensive financial analytics and business intelligence dashboard. Sign in to view real-time financial data and insights.',
};

export default async function Home() {
  // Check if system needs bootstrap first
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

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect('/dashboard');
  }

  redirect('/login');
}
