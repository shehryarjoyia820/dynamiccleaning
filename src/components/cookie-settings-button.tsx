'use client';

import { openCookieSettings } from '@/components/client-effects';

/** Re-opens the cookie consent banner so visitors can change their choice. */
export function CookieSettingsButton({ className, label = 'Cookie settings' }: { className?: string; label?: string }) {
  return (
    <button type="button" className={className} onClick={openCookieSettings}>
      {label}
    </button>
  );
}
