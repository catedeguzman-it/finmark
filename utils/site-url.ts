/**
 * Get the site URL based on the current environment
 * Follows Supabase's recommended pattern for dynamic URLs
 */
export function getSiteUrl(): string {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side detection following Supabase pattern
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`
  
  return url.slice(0, -1); // Remove trailing slash for consistency with origin
}

/**
 * Get the site URL from request headers (server-side only)
 * This is the most reliable method for OAuth redirects
 */
export function getSiteUrlFromHeaders(headers: Headers): string {
  const host = headers.get('host');
  const protocol = headers.get('x-forwarded-proto') || 
                  headers.get('x-forwarded-protocol') ||
                  (host?.includes('localhost') || host?.includes('127.0.0.1') ? 'http' : 'https');

  if (host) {
    return `${protocol}://${host}`;
  }

  // Fallback to environment detection
  return getSiteUrl();
}

/**
 * Get URL following Supabase's exact recommended pattern
 * This is the function from Supabase documentation
 */
export function getURL(): string {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`
  
  return url
}

/**
 * Get OAuth redirect URL for the current environment
 */
export function getOAuthRedirectUrl(headers?: Headers): string {
  const baseUrl = headers ? getSiteUrlFromHeaders(headers) : getSiteUrl();
  return `${baseUrl}/auth/callback`;
}