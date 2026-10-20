'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

/** Shows the ?error= message set by userError() at the top of any admin page. */
export function AdminNotice() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const error = params.get('error');
  if (!error) return null;
  return (
    <div role="alert" className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-[#FDA29B] bg-[#FEE4E2] p-4 text-sm font-semibold text-[#912018]">
      <span>{error}</span>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          const p = new URLSearchParams(params.toString());
          p.delete('error');
          router.replace(p.size ? `${pathname}?${p}` : pathname);
        }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
