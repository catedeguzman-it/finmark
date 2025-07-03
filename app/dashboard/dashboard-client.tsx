'use client';
import { useEffect, useState } from 'react';
import { getFinancialData } from '../../utils/getFinancialData';
import { seedDemoData } from '../../utils/seedDemoData'; 
import { createClient } from '../../utils/supabase/client';
import { User } from '@supabase/supabase-js';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardClientProps {
  user: User;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const supabase = createClient();
  const [orgName, setOrgName] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 🔒 Check if user is in 'users' table
      const { data: existingUser } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', user.id)
        .single();

      let currentOrgId = existingUser?.org_id;

      // 🧱 If not, create org and user record
      if (!existingUser) {
        const { data: newOrg } = await supabase
          .from('organizations')
          .insert({ name: `${(user.email ?? 'Unknown').split('@')[0]}'s Org` })
          .select()
          .single();

        if (!newOrg) {
          console.error("Failed to create new organization.");
          setLoading(false);
          return;
        }
        await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          org_id: newOrg.id,
        });

        currentOrgId = newOrg.id;
      }

      setOrgId(currentOrgId as string | null);

      // 🏷 Get org name
      const { data: orgRecord } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', currentOrgId as string)
        .single();

      setOrgName(orgRecord && typeof orgRecord.name === 'string' ? orgRecord.name : '');

      // 📊 Get paginated data
      if (typeof currentOrgId === 'string') {
        const { data: financials, count } = await getFinancialData(currentOrgId, page, pageSize);
        setData(financials);
        setTotalCount(count || 0);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [page, user.id, user.email, supabase]);

  // 🧪 Seed demo data if orgId is available
  const handleSeedData = async () => {
    if (!orgId) return;
    const success = await seedDemoData(orgId);
    if (success) {
      setPage(1); // reset to first page
      const { data: updatedData, count } = await getFinancialData(orgId, 1, pageSize);
      setData(updatedData);
      setTotalCount(count || 0);
      alert('Demo data seeded!');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#26C6DA]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#26C6DA] mb-1">Dashboard</h1>
            {orgName && (
              <h2 className="text-lg text-gray-600 mb-4">Organization: {orgName}</h2>
            )}
            <p className="text-gray-600">Welcome, {user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={handleSeedData}
            className="bg-gray-300 text-black px-4 py-2 rounded mb-4 hover:bg-gray-400"
          >
            Seed Demo Data
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Month</th>
                <th className="p-4 text-left">Revenue</th>
                <th className="p-4 text-left">Expenses</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No financial data found. Click "Seed Demo Data" to get started.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{row.month}</td>
                    <td className="p-4">${row.revenue.toLocaleString()}</td>
                    <td className="p-4">${row.expenses.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#26C6DA" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#26C6DA] text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#26C6DA] text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 