'use client';

import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADSENSE = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // ca-pub-XXXXXXXXXXXXXXXX
const CONSENT_KEY = 'dd-consent';
const OPEN_SETTINGS = 'dd-open-cookie-settings';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: number };
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

/** Re-opens the cookie banner (used by the footer “Cookie settings” link). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS));
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
 * Cookie consent + Google tags (Consent Mode v2).
 * - GA4 loads only after the visitor accepts.
 * - AdSense loads once a choice is made: personalised ads if accepted,
 *   non-personalised ads if rejected.
 * - A Global Privacy Control signal (CCPA/CPRA opt-out) counts as “reject”.
 * Every element with data-track="event_name" is reported to GA4
 * (call_click, whatsapp_click, email_click, book_click, subscribe, generate_lead).
 */
export function Analytics() {
  const [consent, setConsent] = useState<'granted' | 'denied' | null>(null);
  const [ready, setReady] = useState(false);
  const needsConsent = Boolean(GA_ID || ADSENSE);

  useEffect(() => {
    let v: string | null = null;
    try {
      v = localStorage.getItem(CONSENT_KEY);
    } catch {}
    if (v === 'granted' || v === 'denied') setConsent(v);
    else if (navigator.globalPrivacyControl) setConsent('denied');
    setReady(true);
    const reopen = () => setConsent(null);
    window.addEventListener(OPEN_SETTINGS, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS, reopen);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (el) track(el.dataset.track!, { link_url: (el as HTMLAnchorElement).href, page_path: location.pathname });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  // Keep Google's consent state in sync if the visitor changes their mind.
  useEffect(() => {
    if (!consent) return;
    const g = consent === 'granted' ? 'granted' : 'denied';
    window.gtag?.('consent', 'update', { analytics_storage: g, ad_storage: g, ad_user_data: g, ad_personalization: g });
  }, [consent]);

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
          <Script id="consent-default" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      ) : null}
      {ADSENSE && consent ? (
        <>
          {consent === 'denied' ? (
            <Script id="adsense-npa" strategy="afterInteractive">
              {`(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1;`}
            </Script>
          ) : null}
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        </>
      ) : null}
      {needsConsent && ready && consent === null ? (
        <div
          role="region"
          aria-label="Cookie notice"
          className="fixed inset-x-3 bottom-[76px] z-50 mx-auto max-w-xl rounded-xl border border-white/10 bg-steel p-4 text-sm text-white shadow-lift md:bottom-6 md:left-6 md:right-auto"
        >
          <p>
            We use cookies for analytics{ADSENSE ? ' and advertising (including Google)' : ''}. Essential cookies are always on. You can accept or reject the rest, and change
            your choice any time in Cookie settings.{' '}
            <Link href="/cookies" className="font-semibold text-accent underline underline-offset-4">
              Cookie Policy
            </Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn-primary !min-h-[40px] !py-1.5 !text-base" onClick={() => choose('granted')}>
              Accept all
            </button>
            <button type="button" className="btn-ghost-dark !min-h-[40px] !py-1.5 !text-base" onClick={() => choose('denied')}>
              Reject non-essential
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
