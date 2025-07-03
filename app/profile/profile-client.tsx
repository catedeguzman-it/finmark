'use client';
import { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const supabase = createClient();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data: users, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setData(users || []);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#26C6DA]"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6 text-[#2E2E2E] font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#26C6DA]">User Profile</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">User ID:</span> {user.id}</p>
            <p><span className="font-medium">Last Sign In:</span> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Users</h2>
          </div>
          {data.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No users found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {data.map((u) => (
                <li key={u.id} className="p-4 hover:bg-gray-50 transition">
                  <p className="text-lg font-medium">{u.name || 'No name'}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <p className="text-xs text-gray-400">ID: {u.id}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 