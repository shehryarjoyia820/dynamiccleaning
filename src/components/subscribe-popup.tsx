'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter';
import { cn } from '@/lib/utils';

const KEY = 'dd-subscribe-popup';
const SNOOZE_DAYS = 30;
// Pages where a popup would get in the way of the main task.
const SKIP = ['/book', '/contact', '/unsubscribe', '/privacy', '/terms', '/cookies', '/disclaimer', '/accessibility', '/do-not-sell', '/brand'];

function snoozed() {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'subscribed') return true;
    return v ? Date.now() < Number(v) : false;
  } catch {
    return true; // storage blocked: don't nag
  }
}

function remember(value: string) {
  try {
    localStorage.setItem(KEY, value);
  } catch {}
}

/**
 * Small subscribe notification that slides down just below the header
 * (top-right card on desktop, slim bar on phones). It never covers the page,
 * which keeps it within Google's guidance on intrusive interstitials.
 * Shows after 25 s or half-way down the page; dismissing snoozes it 30 days.
 */
export function SubscribePopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(64);

  useEffect(() => {
    if (SKIP.some((p) => pathname.startsWith(p)) || snoozed()) return;
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      cleanup();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.5) show();
    };
    const timer = window.setTimeout(show, 25000);
    window.addEventListener('scroll', onScroll, { passive: true });
    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
    return cleanup;
  }, [pathname]);

  // Sit flush under the fixed header, which shrinks once the page scrolls.
  useEffect(() => {
    if (!open) return;
    const header = document.querySelector('header');
    const place = () => setTop(Math.round(header?.getBoundingClientRect().bottom ?? 64));
    place();
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function dismiss() {
    setOpen(false);
    remember(String(Date.now() + SNOOZE_DAYS * 86400000));
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="sub-pop-title"
      className={cn(
        'dd-slide-down fixed inset-x-0 z-40 transition-[top] duration-300 border-b border-white/10 bg-charcoal/95 text-white shadow-lift backdrop-blur-md',
        'md:inset-x-auto md:right-6 md:mt-3 md:w-[26rem] md:rounded-2xl md:border',
      )}
      style={{ top }}
    >
      <div className="relative px-4 py-4 pr-12 md:p-6 md:pr-12">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 hidden h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent sm:grid">
            <BellRing className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p id="sub-pop-title" className="font-display text-xl font-bold uppercase leading-tight md:text-2xl">
              Never miss a <span className="text-accent">Clean Truck Check</span> deadline
            </p>
            <p className="mt-1 hidden text-sm text-white/75 md:block">Deadline reminders, rule changes and testing tips for Southern California truck owners.</p>
            <div className="mt-3">
              <NewsletterForm
                idPrefix="pop"
                label="Your email"
                onSubscribed={() => {
                  remember('subscribed');
                  window.setTimeout(() => setOpen(false), 2500);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
