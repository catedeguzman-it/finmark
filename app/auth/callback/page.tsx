'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finalizeAuth = async () => {
      const supabase = getSupabaseClient();
      const { data: sessionData, error } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        console.log('No session found');
        setTimeout(finalizeAuth, 1000); // Retry once if needed
        return;
      }

      const user = session.user;

      // Check if user already exists in 'users' table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, org_id')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        // 1. Create a default organization
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .insert({ name: `${(user.email ?? 'User').split('@')[0]}'s Org` })
          .select()
          .single();

        if (orgError) {
          console.error('Failed to create org:', orgError);
          return;
        }

        // 2. Add user to users table, linked to the new org
        const { error: userInsertError } = await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          org_id: org.id,
        });

        if (userInsertError) {
          console.error('Failed to link user:', userInsertError);
        }
      
       console.log('User and org linked successfully!');
    }
      router.push('/dashboard');
    };

    finalizeAuth();
  }, [router]);

  return <p className="text-center mt-20">Finalizing login...</p>;
}
