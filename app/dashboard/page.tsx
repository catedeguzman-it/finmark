'use client';
import { useEffect, useState } from 'react';
import { getFinancialData } from '../../utils/getFinancialData';
import { getOrgScopedFinancialData } from '../../utils/getOrgScopedFinancialData';
import { seedDemoData } from '../../utils/seedDemoData'; 
import { getSupabaseClient } from '../../lib/supabaseClient';
const supabase = getSupabaseClient();
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';


export default function PaginatedDashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) return;

      const user = session.user;
      setUserEmail(user.email ?? null);

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
          throw new Error("Failed to create new organization.");
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
    };

    fetchData();
  }, [page, orgId]);


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

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#26C6DA] mb-1">Dashboard</h1>
      {orgName && (
        <h2 className="text-lg text-gray-600 mb-4">Organization: {orgName}</h2>
      )}
      <p className="mb-6">Welcome, {userEmail}</p>

      <button
      onClick={handleSeedData}
      className="bg-gray-300 text-black px-4 py-2 rounded mb-4 hover:bg-gray-400"
    >
      Seed Demo Data
    </button>


      <table className="w-full border text-left mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Month</th>
            <th className="p-2">Revenue</th>
            <th className="p-2">Expenses</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-2">{row.month}</td>
              <td className="p-2">${row.revenue}</td>
              <td className="p-2">${row.expenses}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-[#26C6DA] text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-[#26C6DA] text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#26C6DA]">Monthly Revenue vs Expenses</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#26C6DA" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#EF5350" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
