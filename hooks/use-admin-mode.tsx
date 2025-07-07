'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useAdminMode() {
  const searchParams = useSearchParams();
  
  const isAdminMode = useMemo(() => {
    return searchParams.get('admin') === 'true';
  }, [searchParams]);

  return { isAdminMode };
}