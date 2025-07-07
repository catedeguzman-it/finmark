import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your FinMark account to access your financial analytics dashboard. Secure login with email/password or Google OAuth.',
  openGraph: {
    title: 'Sign In to FinMark',
    description: 'Access your financial analytics dashboard. Sign in securely with email/password or Google OAuth.',
  },
  twitter: {
    title: 'Sign In to FinMark',
    description: 'Access your financial analytics dashboard. Sign in securely with email/password or Google OAuth.',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}