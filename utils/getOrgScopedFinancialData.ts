// utils/getOrgScopedFinancialData.ts
import { supabase } from '../lib/supabaseClient';

export async function getOrgScopedFinancialData(userId: string) {
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
