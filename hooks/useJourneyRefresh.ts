'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    Grow?: {
      refresh?: () => void;
    };
  }
}

export function useJourneyRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.Grow && typeof window.Grow.refresh === 'function') {
      window.Grow.refresh();
    }
  }, [pathname]);
}
