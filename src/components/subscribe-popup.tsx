'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogoMark } from '@/components/brand';
import { NewsletterForm } from '@/components/newsletter';

const KEY = 'dd-subscribe-popup';
const SNOOZE_DAYS = 30;
// Pages where a prompt would get in the way of the main task.
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
 * Notification-style subscribe prompt that slides down at the top centre of
 * the screen (over the header), like the browser-notification prompts on job
 * sites. Compact: logo, one line, "Later" / "Subscribe"; the email field only
 * appears after Subscribe. Shows after 10 s or 40% scroll; Later snoozes it
 * for 30 days. It is small and dismissible, within Google's interstitial guidance.
 */
export function SubscribePopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
      if (max > 0 && window.scrollY / max > 0.4) show();
    };
    const timer = window.setTimeout(show, 10000);
    window.addEventListener('scroll', onScroll, { passive: true });
    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
    return cleanup;
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && later();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function later() {
    setOpen(false);
    remember(String(Date.now() + SNOOZE_DAYS * 86400000));
  }

  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-[60] flex justify-center px-3 sm:top-3">
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="sub-pop-title"
        aria-describedby="sub-pop-text"
        className="dd-slide-down on-light pointer-events-auto w-full max-w-[27rem] rounded-xl border border-ink/10 bg-white p-4 text-ink shadow-[0_18px_50px_-12px_rgba(11,15,20,0.45)]"
      >
        <div className="flex gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-charcoal">
            <LogoMark className="h-8 w-8" />
          </span>
          <div className="min-w-0">
            <p id="sub-pop-title" className="font-semibold leading-snug">
              Get Clean Truck Check deadline reminders
            </p>
            <p id="sub-pop-text" className="mt-0.5 text-sm text-muted">
              Rule changes and testing tips, by email.
            </p>
          </div>
        </div>

        {expanded ? (
          <div className="mt-3">
            <NewsletterForm
              dark={false}
              idPrefix="pop"
              label="Your email"
              autoFocus
              onSubscribed={() => {
                remember('subscribed');
                window.setTimeout(() => setOpen(false), 2500);
              }}
            />
            <div className="mt-1 text-right">
              <button type="button" onClick={later} className="text-sm font-semibold text-muted hover:text-ink">
                Later
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={later} className="rounded-md px-4 py-2 text-sm font-semibold text-accent-ink hover:bg-accent/10">
              Later
            </button>
            <button type="button" onClick={() => setExpanded(true)} className="rounded-md bg-accent-deep px-5 py-2 text-sm font-bold text-white hover:bg-accent-hover">
              Subscribe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
