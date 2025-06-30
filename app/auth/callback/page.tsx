'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.push('/dashboard');
      } else {
        console.log('No session found');
        setTimeout(checkSession, 1000); // retry once if needed
      }
    };

    checkSession();
  }, [router]);

  return <p className="text-center mt-20">Finalizing login...</p>;
}
