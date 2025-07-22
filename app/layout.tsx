import '../styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: {
    default: 'FinMark - Financial Analytics Dashboard',
    template: '%s | FinMark'
  },
  description: 'Comprehensive financial analytics and business intelligence platform for data-driven decision making.',
  keywords: ['financial analytics', 'business intelligence', 'dashboard', 'data visualization', 'financial reporting'],
  authors: [{ name: 'FinMark Team' }],
  creator: 'FinMark',
  publisher: 'FinMark',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://finmark.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://finmark.vercel.app',
    title: 'FinMark - Financial Analytics Dashboard',
    description: 'Comprehensive financial analytics and business intelligence platform for data-driven decision making.',
    siteName: 'FinMark',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinMark - Financial Analytics Dashboard',
    description: 'Comprehensive financial analytics and business intelligence platform for data-driven decision making.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
