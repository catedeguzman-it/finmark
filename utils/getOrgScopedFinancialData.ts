// utils/getOrgScopedFinancialData.ts
import { createClient } from './supabase/client';

export async function getOrgScopedFinancialData(userId: string) {
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
