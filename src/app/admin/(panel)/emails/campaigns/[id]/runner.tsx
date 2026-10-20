'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { processNow } from '../../../email-actions';

/**
 * Keeps sending while this page is open, in short batches, so a large send
 * finishes in minutes instead of waiting for the daily cron.
 */
export function SendRunner({ hasDue }: { hasDue: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState(hasDue ? 'Sending…' : 'First emails sent. Follow-ups are scheduled.');
  const [running, setRunning] = useState(hasDue);
  const stop = useRef(false);

  useEffect(() => {
    if (!running) return;
    stop.current = false;
    (async () => {
      let total = 0;
      while (!stop.current) {
        try {
          const r = await processNow();
          total += r.sent;
          router.refresh();
          if (r.notConfigured) {
            setStatus('Email is not configured (SMTP).');
            break;
          }
          if (r.limited) {
            setStatus(`Daily sending limit reached. ${total} sent now; the rest go out automatically tomorrow.`);
            break;
          }
          if (!r.due) {
            setStatus(`Done: ${total} email(s) sent.`);
            break;
          }
          setStatus(`Sending… ${total} sent, ${r.due} waiting`);
        } catch (e) {
          setStatus(`Paused: ${e instanceof Error ? e.message : 'error'}. Retrying in 30s.`);
          await new Promise((res) => setTimeout(res, 30000));
        }
      }
      setRunning(false);
    })();
    return () => {
      stop.current = true;
    };
  }, [running, router]);

  return (
    <p role="status" className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold shadow-card">
      {running ? <Loader2 className="h-4 w-4 animate-spin text-amber-ink" aria-hidden /> : null}
      {status}
    </p>
  );
}
