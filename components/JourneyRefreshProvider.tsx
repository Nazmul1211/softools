'use client';

import { useJourneyRefresh } from '@/hooks/useJourneyRefresh';

export default function JourneyRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useJourneyRefresh();
  return <>{children}</>;
}
