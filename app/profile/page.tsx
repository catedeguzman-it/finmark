'use client'; // 👈 This is critical for Supabase client use!

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient'; // adjust import path

export default function Profile() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('users').select('*').then((result: { data: any[] | null }) => {
      setData(result.data || []);
    });
  }, []);

  return (
    <div>
      <h1>User List</h1>
      {data.map((u) => (
        <p key={u.id}>{u.name}</p>
      ))}
    </div>
  );
}
