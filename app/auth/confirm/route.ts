import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/dashboard';

  console.log('DEBUG: Auth confirm route - token_hash:', token_hash);
  console.log('DEBUG: Auth confirm route - type:', type);
  console.log('DEBUG: Auth confirm route - next:', next);
  console.log('DEBUG: Auth confirm route - full URL:', request.url);

  if (token_hash && type) {
    const supabase = await createClient();
    
    // Map the type correctly for verifyOtp
    let verifyType: EmailOtpType = type;
    if (type === 'email' || type === 'signup') {
      verifyType = 'email';
    } else if (type === 'invite') {
      verifyType = 'invite';
    } else if (type === 'recovery') {
      verifyType = 'recovery';
    } else if (type === 'email_change') {
      verifyType = 'email_change';
    }
    
    console.log('DEBUG: Auth confirm route - using verifyType:', verifyType);
    
    const { data, error } = await supabase.auth.verifyOtp({
      type: verifyType,
      token_hash,
    });
    
    console.log('DEBUG: Auth confirm route - verifyOtp result:', { data, error });
    
    if (!error) {
      // Check if this is an invitation flow by looking at user metadata
      if (data.user?.user_metadata?.invitation_flow || verifyType === 'invite') {
        console.log('DEBUG: Auth confirm route - invitation flow detected, redirecting to set-password');
        redirect('/set-password');
      }
      
      // redirect user to specified redirect URL or dashboard
      redirect(next);
    } else {
      console.log('DEBUG: Auth confirm route - verifyOtp error:', error);
      redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/error?message=Invalid or expired confirmation link');
} 