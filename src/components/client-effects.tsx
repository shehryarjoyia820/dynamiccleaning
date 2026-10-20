'use client';

import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CONSENT_KEY = 'dd-consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  window.gtag?.('event', event, params);
}

/** Observes every [data-reveal] element and adds .is-visible when it scrolls in. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}

/**
 * GA4 loads only after the visitor accepts analytics cookies.
 * Every element with data-track="event_name" is reported as a GA4 event
 * (call_click, whatsapp_click, email_click, book_click); mark these as
 * conversions in GA4 along with generate_lead from the forms.
 */
export function Analytics() {
  const [consent, setConsent] = useState<'granted' | 'denied' | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(CONSENT_KEY);
      if (v === 'granted' || v === 'denied') setConsent(v);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (el) track(el.dataset.track!, { link_url: (el as HTMLAnchorElement).href, page_path: location.pathname });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  const choose = (v: 'granted' | 'denied') => {
    setConsent(v);
    try {
      localStorage.setItem(CONSENT_KEY, v);
    } catch {}
  };

  return (
    <>
      {GA_ID && consent === 'granted' ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      ) : null}
      {GA_ID && ready && consent === null ? (
        <div
          role="region"
          aria-label="Cookie notice"
          className="fixed inset-x-3 bottom-[76px] z-50 mx-auto max-w-xl rounded-xl border border-white/10 bg-steel p-4 text-sm text-white shadow-lift md:bottom-6 md:left-6 md:right-auto"
        >
          <p>
            We use analytics cookies to understand how visitors use this site. No ads, no selling data.{' '}
            <Link href="/privacy" className="font-semibold text-amber underline underline-offset-4">
              Privacy Policy
            </Link>
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn-primary !min-h-[40px] !py-1.5 !text-base" onClick={() => choose('granted')}>
              Accept
            </button>
            <button type="button" className="btn-ghost-dark !min-h-[40px] !py-1.5 !text-base" onClick={() => choose('denied')}>
              Decline
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
