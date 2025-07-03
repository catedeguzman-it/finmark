import { createClient } from './supabase/client';

export const seedDemoData = async (orgId: string) => {
  const supabase = createClient();
  const demoRows = [
    { month: 'Jan', revenue: 12000, expenses: 8000 },
    { month: 'Feb', revenue: 15000, expenses: 9000 },
    { month: 'Mar', revenue: 10000, expenses: 7000 },
    { month: 'Apr', revenue: 18000, expenses: 11000 },
    { month: 'May', revenue: 16000, expenses: 9500 },
  ];

  const payload = demoRows.map((row) => ({
    ...row,
    org_id: orgId,
  }));

  const { error } = await supabase.from('financial_data').insert(payload);

  if (error) {
    console.error('Seed error:', error);
    return false;
  }

  return true;
};
