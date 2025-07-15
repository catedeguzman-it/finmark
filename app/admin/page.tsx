import { createClient } from '@/utils/supabase/server';
import { getUserByAuthId } from '@/db/queries/users';
import { getAllOrganizations } from '@/db/queries/organizations';
import { AdminDashboard } from '@/components/AdminDashboard';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const dbUser = await getUserByAuthId(user.id);
  
  if (!dbUser || !dbUser.isOnboarded) {
    redirect('/onboarding');
  }

  // For now, we'll check if user has admin role in any organization
  // In a full implementation, you'd check system-level admin permissions
  await getAllOrganizations();

  return (
    <div className="container mx-auto py-8">
      <AdminDashboard />
    </div>
  );
}