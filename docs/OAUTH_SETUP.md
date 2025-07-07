# OAuth Configuration Fix

## The Problem

Your OAuth redirects are going to the wrong domain because:

1. **Hardcoded environment variables**: Your `.env` had `NEXT_PUBLIC_SITE_URL="http://localhost:3000"` which was being used in production
2. **Supabase redirect URL configuration**: Your Supabase project likely has incorrect redirect URLs configured
3. **Google OAuth configuration**: Your Google OAuth app might have incorrect authorized redirect URIs

## The Solution

### 1. Code Changes (Already Applied)

- ✅ Created `utils/site-url.ts` for dynamic URL detection
- ✅ Updated `app/login/actions.ts` to use dynamic URLs
- ✅ Removed hardcoded `NEXT_PUBLIC_SITE_URL` from `.env`

### 2. Supabase Configuration (You Need to Do This)

Go to your Supabase dashboard and update these settings:

#### Site URL Configuration
1. Go to **Authentication > URL Configuration**
2. Set **Site URL** to: `https://finmark.vercel.app`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://finmark.vercel.app/auth/callback`
   - `https://*.vercel.app/auth/callback` (for preview deployments)

#### Additional URLs (if needed)
Add these to **Additional Redirect URLs**:
- `http://127.0.0.1:3000/auth/callback`
- `http://localhost:3001/auth/callback` (if you use different ports)

### 3. Google OAuth Configuration (You Need to Do This)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Find your OAuth 2.0 Client ID
4. Add **Authorized redirect URIs**:
   - `https://tfajblzrzsggtrfiigzq.supabase.co/auth/v1/callback`
   - Make sure this matches your Supabase project URL

### 4. Environment Variables

For **local development**, create `.env.local`:
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For **production** (Vercel), set environment variables:
```bash
NEXT_PUBLIC_SITE_URL=https://finmark.vercel.app
```

Or better yet, don't set `NEXT_PUBLIC_SITE_URL` at all and let the code auto-detect it.

## How the Fix Works

The new code:

1. **Auto-detects environment**: Uses request headers to determine the current domain
2. **Handles Vercel deployments**: Automatically uses `VERCEL_URL` when available
3. **Falls back gracefully**: Uses localhost for development if headers aren't available
4. **Works with preview deployments**: Handles Vercel preview URLs automatically

## Testing

After making the Supabase and Google OAuth changes:

1. **Test localhost**: 
   - Go to `http://localhost:3000/login`
   - Click "Sign in with Google"
   - Should redirect back to `http://localhost:3000/auth/callback`

2. **Test production**:
   - Go to `https://finmark.vercel.app/login`
   - Click "Sign in with Google"
   - Should redirect back to `https://finmark.vercel.app/auth/callback`

## Quick Fix Commands

Run these to verify your setup:

```bash
# Check current environment detection
npm run dev
# Then check browser console for "OAuth redirect URL will be:" logs

# Deploy to test production
vercel --prod
```

## If Still Having Issues

1. **Check Supabase logs**: Go to Supabase Dashboard > Logs
2. **Check browser network tab**: Look for redirect URLs in OAuth flow
3. **Verify Google OAuth settings**: Make sure redirect URI matches Supabase exactly
4. **Clear browser cache**: OAuth can cache redirect URLs

The key insight is that OAuth redirect URLs must be configured in **three places**:
1. Your code (✅ fixed)
2. Supabase project settings (❌ you need to fix)
3. Google OAuth app settings (❌ you need to fix)