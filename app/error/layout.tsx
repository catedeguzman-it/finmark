import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Error',
  description: 'An error occurred while processing your request. Please try again or contact support if the issue persists.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}