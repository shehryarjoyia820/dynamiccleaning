'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, MinusCircle, XCircle } from 'lucide-react';
import { processNow } from '../../../email-actions';

type FeedItem = { email: string; status: 'sent' | 'failed' | 'skipped'; step: number; at: string };

/**
 * Keeps sending while this page is open, in short batches, and shows a live
 * feed of who each email went to. The recipient table below refreshes after
 * every batch, so progress is visible without reloading.
 */
export function SendRunner({ hasDue }: { hasDue: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState(hasDue ? 'Starting…' : '');
  const [running, setRunning] = useState(hasDue);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [total, setTotal] = useState({ sent: 0, failed: 0, skipped: 0 });
  const stop = useRef(false);

  useEffect(() => {
    if (!running) return;
    stop.current = false;
    (async () => {
      while (!stop.current) {
        try {
          const r = await processNow();
          if (r.feed?.length) setFeed((f) => [...r.feed, ...f].slice(0, 200));
          setTotal((t) => ({ sent: t.sent + r.sent, failed: t.failed + r.failed, skipped: t.skipped + r.skipped }));
          router.refresh();
          if (r.notConfigured) {
            setStatus('Email is not configured (SMTP).');
            break;
          }
          if (r.limited) {
            setStatus('Daily sending limit reached. The rest go out automatically tomorrow.');
            break;
          }
          if (!r.due) {
            setStatus('Done');
            break;
          }
          setStatus(`Sending… ${r.due} waiting`);
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

  if (!hasDue && !feed.length) return null;

  return (
    <section className="card mb-6" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-2xl">
          {running ? <Loader2 className="h-5 w-5 animate-spin text-accent-ink" aria-hidden /> : <CheckCircle2 className="h-5 w-5 text-green-ink" aria-hidden />}
          {running ? 'Sending now' : status === 'Done' ? 'Finished sending' : 'Sending stopped'}
        </h2>
        <p className="text-sm font-semibold">
          <span className="text-green-ink">{total.sent} sent</span>
          {total.failed ? <span className="ml-3 text-[#B42318]">{total.failed} failed</span> : null}
          {total.skipped ? <span className="ml-3 text-muted">{total.skipped} skipped</span> : null}
        </p>
      </div>
      {status && status !== 'Done' ? <p className="mt-1 text-sm text-muted">{status}</p> : null}
      {status === 'Done' ? (
        <p className="mt-1 text-sm text-muted">All due emails went out. The full list of who received this email is in the table below.</p>
      ) : null}
      {feed.length ? (
        <ul className="mt-4 max-h-72 divide-y divide-ink/5 overflow-y-auto rounded-lg border border-ink/10 text-sm">
          {feed.map((f, i) => (
            <li key={`${f.email}-${f.at}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2">
              <span className="flex min-w-0 items-center gap-2">
                {f.status === 'sent' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-ink" aria-hidden />
                ) : f.status === 'failed' ? (
                  <XCircle className="h-4 w-4 shrink-0 text-[#B42318]" aria-hidden />
                ) : (
                  <MinusCircle className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                )}
                <span className="truncate">{f.email}</span>
                {f.step ? <span className="shrink-0 rounded bg-offwhite px-1.5 text-xs text-muted">follow-up {f.step}</span> : null}
              </span>
              <span className="shrink-0 text-xs text-muted">
                {f.status} · {new Date(f.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
              </span>
            </li>
          ))}
        </ul>
      ) : running ? (
        <p className="mt-4 text-sm text-muted">Connecting to the mail server…</p>
      ) : null}
    </section>
  );
}
