'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { track } from '@/components/client-effects';
import { cn } from '@/lib/utils';

/** Newsletter signup → /api/subscribe (stored as a contact tagged "newsletter"). */
export function NewsletterForm({
  dark = true,
  label = 'Get Clean Truck Check updates',
  idPrefix = 'nl',
  onSubscribed,
}: {
  dark?: boolean;
  label?: string;
  idPrefix?: string;
  onSubscribed?: () => void;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  if (state === 'done') {
    return (
      <p role="status" className={cn('flex items-center gap-2 font-semibold', dark ? 'text-white' : 'text-ink')}>
        <CheckCircle2 className="h-5 w-5 text-green" aria-hidden /> You’re subscribed. Check your inbox.
      </p>
    );
  }

  return (
    <form
      className="relative"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget).entries());
        setState('sending');
        const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) }).catch(() => null);
        const json = await res?.json().catch(() => ({}));
        if (res?.ok) {
          track('subscribe');
          setState('done');
          onSubscribed?.();
        } else {
          setMsg(json?.error ?? 'Something went wrong. Try again.');
          setState('error');
        }
      }}
    >
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor={`${idPrefix}-email`} className={cn('label', dark && 'text-white')}>
        {label}
      </label>
      <div className="flex gap-2">
        <input id={`${idPrefix}-email`} name="email" type="email" required placeholder="you@company.com" autoComplete="email" className="field min-w-0 flex-1" />
        <button className="btn-primary shrink-0 !min-h-[48px] !px-4" disabled={state === 'sending'}>
          {state === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" aria-label="Subscribing" /> : 'Subscribe'}
        </button>
      </div>
      <p className={cn('mt-2 text-xs', dark ? 'text-muted-dark' : 'text-muted')}>
        Deadline reminders and rule changes. Unsubscribe anytime.{' '}
        <Link href="/privacy" className="underline underline-offset-2">Privacy</Link>
      </p>
      {state === 'error' ? <p role="alert" className="mt-1 text-sm font-semibold text-[#F97066]">{msg}</p> : null}
    </form>
  );
}
