'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProfilePage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('users').select('*').then(({ data }) => {
      setData(data || []);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6 text-[#2E2E2E] font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#26C6DA]">User List</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {data.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No users found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {data.map((u) => (
                <li key={u.id} className="p-4 hover:bg-gray-50 transition">
                  <p className="text-lg font-medium">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
