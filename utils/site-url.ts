/**
 * Get the site URL based on the current environment
 * This handles both client-side and server-side detection
 */
export function getSiteUrl(): string {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side detection
  // Check for Vercel environment variables first
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Check for custom environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Default to localhost for development
  return 'http://localhost:3000';
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
 * Get OAuth redirect URL for the current environment
 */
export function getOAuthRedirectUrl(headers?: Headers): string {
  const baseUrl = headers ? getSiteUrlFromHeaders(headers) : getSiteUrl();
  return `${baseUrl}/auth/callback`;
}