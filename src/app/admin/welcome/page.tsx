'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/brand';
import { browserClient } from '@/lib/supabase/browser';

// Only internal admin paths are allowed as the next stop.
function nextPath() {
  const n = new URLSearchParams(window.location.search).get('next') ?? '';
  return /^\/admin(\/[\w-]+)*$/.test(n) ? n : '/admin';
}

/**
 * Landing page for links in invite and password-reset emails. The Supabase
 * browser client reads the session from the link, then we continue to the
 * requested admin page (usually "choose your password").
 */
export default function WelcomePage() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    (async () => {
      const sb = browserClient();
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (code) await sb.auth.exchangeCodeForSession(code);
      const { data } = await sb.auth.getSession();
      if (data.session) {
        router.replace(nextPath());
        router.refresh();
      } else {
        setFailed(true);
      }
    })();
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="rounded-xl bg-charcoal p-5"><Logo /></div>
        {failed ? (
          <>
            <h1 className="mt-8 text-3xl">Link expired</h1>
            <p className="mt-2 text-muted">This sign-in link is no longer valid. Ask an admin to send a new invite, or use “Forgot password” on the sign-in page.</p>
            <a href="/admin/login" className="btn-primary mt-6">Go to sign in</a>
          </>
        ) : (
          <p className="mt-8 flex items-center justify-center gap-2 text-muted">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Signing you in…
          </p>
        )}
      </div>
    </main>
  );
}
