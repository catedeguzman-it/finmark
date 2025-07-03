import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return <DashboardClient user={data.user} />;
}
