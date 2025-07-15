import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserByAuthId } from '@/db/queries/users';
import { getAllUsersWithOrganizations } from '@/db/queries/users';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user and verify permissions
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const dbUser = await getUserByAuthId(user.id);
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all users with their organization details
    const usersWithOrganizations = await getAllUsersWithOrganizations();
    
    return NextResponse.json(usersWithOrganizations);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}