'use client';

import { getSiteUrl } from './site-url';

/**
 * Debug utility to check OAuth configuration
 * Call this from your browser console or add to a debug page
 */
export function debugOAuthConfig() {
  const config = {
    currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A (server-side)',
    detectedSiteUrl: getSiteUrl(),
    expectedRedirectUrl: `${getSiteUrl()}/auth/callback`,
    environment: {
      isClient: typeof window !== 'undefined',
      isLocalhost: typeof window !== 'undefined' ? window.location.hostname === 'localhost' : false,
      isVercel: typeof window !== 'undefined' ? window.location.hostname.includes('vercel.app') : false,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
    },
    envVars: {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'Not set',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
    }
  };

  console.group('🔍 OAuth Configuration Debug');
  console.log('Current Configuration:', config);
  console.log('Expected Supabase Redirect URLs:');
  console.log('- http://localhost:3000/auth/callback');
  console.log('- https://finmark.vercel.app/auth/callback');
  console.log('- https://*.vercel.app/auth/callback');
  console.groupEnd();

  return config;
}

/**
 * Test OAuth redirect URL generation
 */
export function testOAuthRedirect() {
  const siteUrl = getSiteUrl();
  const redirectUrl = `${siteUrl}/auth/callback`;
  
  console.group('🧪 OAuth Redirect Test');
  console.log('Site URL:', siteUrl);
  console.log('Redirect URL:', redirectUrl);
  console.log('Is this correct for your environment?');
  console.groupEnd();
  
  return { siteUrl, redirectUrl };
}

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugOAuthConfig = debugOAuthConfig;
  (window as any).testOAuthRedirect = testOAuthRedirect;
}