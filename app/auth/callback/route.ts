import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { syncUserAfterOAuth } from '../../login/actions';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');
  
  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, error_description);
    return NextResponse.redirect(`${origin}/error?message=${encodeURIComponent(error_description || error)}`);
  }

  if (code) {
    const supabase = await createClient();
    
    try {
      // Exchange the code for a session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        return NextResponse.redirect(`${origin}/error?message=${encodeURIComponent('Authentication failed')}`);
      }

      if (data.user) {
        console.log('User authenticated:', data.user.email);
        
        // Sync user data to our database
        try {
          await syncUserAfterOAuth(data.user);
          console.log('User synced to database successfully');
        } catch (syncError) {
          console.error('User sync error:', syncError);
          // Continue anyway, as the user is authenticated
        }
        
        // Determine redirect destination
        let redirectPath = '/dashboard';
        const next = searchParams.get('next');
        if (next && next.startsWith('/') && !next.startsWith('//')) {
          redirectPath = decodeURIComponent(next);
        }
        
        console.log('Redirecting to:', redirectPath);
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    } catch (error) {
      console.error('Unexpected error in OAuth callback:', error);
      return NextResponse.redirect(`${origin}/error?message=${encodeURIComponent('Authentication failed')}`);
    }
  }

  // No code parameter - invalid callback
  console.error('No code parameter in OAuth callback');
  return NextResponse.redirect(`${origin}/error?message=${encodeURIComponent('Invalid authentication callback')}`);
} 