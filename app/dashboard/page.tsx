'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push('/');
        return;
      }
      setUserEmail(data.session.user.email ?? null);
      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#26C6DA] mb-4">Dashboard</h1>
      <p className="text-lg">Welcome, {userEmail}</p>
    </div>
  );
}
