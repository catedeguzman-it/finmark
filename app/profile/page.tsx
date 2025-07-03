import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';
import ProfileClient from './profile-client';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return <ProfileClient user={data.user} />;
}
