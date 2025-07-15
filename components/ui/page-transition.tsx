'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PageLoading } from './loading';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Listen for route changes
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function(...args) {
      handleStart();
      const result = originalPush.apply(this, args);
      setTimeout(handleComplete, 100); // Small delay for smooth transition
      return result;
    };

    window.history.replaceState = function(...args) {
      handleStart();
      const result = originalReplace.apply(this, args);
      setTimeout(handleComplete, 100);
      return result;
    };

    // Handle browser back/forward
    const handlePopState = () => {
      handleStart();
      setTimeout(handleComplete, 100);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  if (loading) {
    return <PageLoading text="Navigating..." />;
  }

  return <>{children}</>;
}