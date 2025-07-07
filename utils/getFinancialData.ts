import { createClient } from './supabase/client';
import { getFinancialData as getNewFinancialData } from './getDashboardData';

export async function getFinancialData(
  orgId: string,
  page: number,
  pageSize: number
): Promise<{ data: any[]; count: number }> {
  console.log('⚠️  getFinancialData is deprecated. Use getDashboardData instead.');
  
  // Try new data structure first
  const organizationId = parseInt(orgId, 10);
  if (!isNaN(organizationId)) {
    try {
      const newData = await getNewFinancialData(organizationId);
      const { financialMetrics } = newData;
      
      // Paginate the results
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      const paginatedData = financialMetrics.slice(from, to);
      
      return { 
        data: paginatedData, 
        count: financialMetrics.length 
      };
    } catch (error) {
      console.error('Error with new financial data structure:', error);
    }
  }

  // Fallback to legacy Supabase approach
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
