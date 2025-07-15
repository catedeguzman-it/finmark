'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        const supabase = createClient();
        
        // Check for hash fragment parameters (invitation flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenType = hashParams.get('token_type');
        const type = hashParams.get('type');
        
        console.log('DEBUG: Confirm page - hash params:', {
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          tokenType,
          type
        });

        // Check for query parameters (email confirmation flow)
        const tokenHash = searchParams.get('token_hash');
        const queryType = searchParams.get('type');
        const next = searchParams.get('next') ?? '/dashboard';

        console.log('DEBUG: Confirm page - query params:', {
          tokenHash: tokenHash ? 'present' : 'missing',
          queryType,
          next
        });

        if (accessToken && refreshToken && type === 'invite') {
          // Handle invitation flow with session tokens
          console.log('DEBUG: Confirm page - handling invitation flow');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('DEBUG: Confirm page - setSession error:', error);
            setError('Failed to confirm invitation');
            return;
          }

          console.log('DEBUG: Confirm page - session set successfully:', data);
          
          // Check if this is an invitation flow
          if (data.user?.user_metadata?.invitation_flow) {
            console.log('DEBUG: Confirm page - redirecting to set-password');
            router.push('/set-password');
          } else {
            router.push('/dashboard');
          }
        } else if (tokenHash && queryType) {
          // Handle email confirmation flow with token hash
          console.log('DEBUG: Confirm page - handling email confirmation flow with token_hash');
          console.log('DEBUG: Confirm page - queryType:', queryType);
          
          // Map the query type to the correct verifyOtp type
          let verifyType: string = queryType;
          if (queryType === 'email' || queryType === 'signup') {
            verifyType = 'email';
          } else if (queryType === 'invite') {
            verifyType = 'invite';
          } else if (queryType === 'recovery') {
            verifyType = 'recovery';
          } else if (queryType === 'email_change') {
            verifyType = 'email_change';
          }
          
          console.log('DEBUG: Confirm page - using verifyType:', verifyType);
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: verifyType as any,
          });

          if (error) {
            console.error('DEBUG: Confirm page - verifyOtp error:', error);
            setError(`Failed to confirm: ${error.message}`);
            return;
          }

          console.log('DEBUG: Confirm page - email confirmed successfully:', data);
          
          // Check if this is an invitation flow
          if (data.user?.user_metadata?.invitation_flow || verifyType === 'invite') {
            console.log('DEBUG: Confirm page - invitation flow detected, redirecting to set-password');
            router.push('/set-password');
          } else {
            router.push(next);
          }
        } else {
          console.log('DEBUG: Confirm page - no valid parameters found');
          setError('Invalid confirmation link');
        }
      } catch (err) {
        console.error('DEBUG: Confirm page - unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    handleConfirmation();
  }, [router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Confirming your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirmation Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}