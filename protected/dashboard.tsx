'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) router.push('/');
      else setUser(data.user);
    });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
    </div>
  );
}
