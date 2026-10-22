'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/** Re-renders the page every `seconds` while it is visible, so the numbers and feed stay live. */
export function LiveRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter();
  const [at, setAt] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') {
        router.refresh();
        setAt(new Date());
      }
    }, seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className="h-2 w-2 animate-pulse rounded-full bg-green" aria-hidden />
      Live · updated {at.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit', second: '2-digit' })} PT
    </span>
  );
}
