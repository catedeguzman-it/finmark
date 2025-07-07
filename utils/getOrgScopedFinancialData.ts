// utils/getOrgScopedFinancialData.ts
import { createClient } from './supabase/client';
import { getDashboardData } from './getDashboardData';
import { db } from '@/db';
import { userOrganizationsTable, usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getOrgScopedFinancialData(userId: string) {
  console.log('⚠️  getOrgScopedFinancialData is deprecated. Use getDashboardData with organization context.');
  
  try {
    // Try new approach: get user's organization from new schema
    const userOrgs = await db
      .select({ organizationId: userOrganizationsTable.organizationId })
      .from(userOrganizationsTable)
      .innerJoin(usersTable, eq(usersTable.id, userOrganizationsTable.userId))
      .where(eq(usersTable.authUserId, userId))
      .limit(1);

    if (userOrgs.length > 0) {
      const organizationId = userOrgs[0].organizationId;
      return await getDashboardData('financial', organizationId);
    }
  } catch (error) {
    console.error('Error with new org-scoped data structure:', error);
  }

  // Fallback to legacy Supabase approach
  const supabase = createClient();
  const { data, error } = await supabase
    .from('financial_data')
    .select('*, users!inner(id, org_id)')
    .eq('users.id', userId);

  if (error) {
    console.error('Error fetching org-scoped financial data:', error);
    throw error;
  }

  return data;
}
