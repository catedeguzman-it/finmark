import { createClient } from './supabase/client';

export async function getFinancialData(
  orgId: string,
  page: number,
  pageSize: number
): Promise<{ data: any[]; count: number }> {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('financial_data')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId)
    .range(from, to);

  if (error) {
    console.error('getFinancialData error:', error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count ?? 0 };
}
