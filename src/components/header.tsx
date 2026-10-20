'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, MessageSquareText, Phone, X } from 'lucide-react';
import { WhatsAppIcon } from '@/components/contact-bars';
import { Logo } from '@/components/brand';
import { BookButton } from '@/components/booking-context';
import { LINKS, NAV, SITE } from '@/lib/site';
import { cn } from '@/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Dropdown opened by tap (touch tablets have no hover).
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    if (!openGroup) return;
    const close = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.('[data-nav-group]')) setOpenGroup(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenGroup(null);
    document.addEventListener('pointerdown', close);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [openGroup]);

  useEffect(() => {
    if (!menuOpen) return;
    // Lock the page behind the menu. overflow:hidden alone is ignored by iOS Safari,
    // so pin the body in place and restore the scroll position on close.
    const y = window.scrollY;
    const path = window.location.pathname;
    const body = document.body.style;
    Object.assign(body, { position: 'fixed', top: `-${y}px`, left: '0', right: '0', overflow: 'hidden' });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      Object.assign(body, { position: '', top: '', left: '', right: '', overflow: '' });
      // Same page: return to where the reader was. New page: start at the top.
      window.scrollTo(0, window.location.pathname === path ? y : 0);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,padding] duration-300 ease-out',
        // No backdrop-blur while the menu is open: it would trap the fixed menu panel inside the header.
        menuOpen
          ? 'border-white/10 bg-charcoal py-2'
          : scrolled
            ? 'border-white/10 bg-charcoal/95 py-2 backdrop-blur-md'
            : 'border-transparent bg-gradient-to-b from-charcoal/90 to-charcoal/0 py-4',
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-accent-deep focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="container flex items-center justify-between gap-4">
        <Link href="/" aria-label="Diesel Dynamix home" className={cn('transition-transform duration-300', scrolled && 'scale-[0.92] origin-left')}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.href} data-nav-group className="group relative">
                <Link
                  href={item.href}
                  aria-haspopup="true"
                  aria-expanded={openGroup === item.href}
                  onClick={(e) => {
                    // On touch screens the first tap opens the dropdown; a second tap follows the link.
                    if (window.matchMedia('(hover: none)').matches && openGroup !== item.href) {
                      e.preventDefault();
                      setOpenGroup(item.href);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-1 whitespace-nowrap rounded px-3 py-2 font-display text-[1.05rem] font-semibold uppercase tracking-wide text-white/85 hover:text-white',
                    item.children.some((c) => isActive(c.href)) && 'text-accent',
                  )}
                >
                  {item.label}
                  <ChevronDown className={cn('h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180', openGroup === item.href && 'rotate-180')} aria-hidden />
                </Link>
                <div
                  className={cn(
                    'invisible absolute left-0 top-full w-64 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
                    openGroup === item.href && 'visible translate-y-0 opacity-100',
                  )}
                >
                  <ul className="rounded-lg border border-white/10 bg-steel p-2 shadow-lift">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className={cn('block rounded px-3 py-2.5 text-[0.95rem] text-white/85 hover:bg-white/5 hover:text-white active:bg-white/10', isActive(c.href) && 'text-accent')}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'whitespace-nowrap rounded px-3 py-2 font-display text-[1.05rem] font-semibold uppercase tracking-wide text-white/85 hover:text-white',
                  isActive(item.href) && 'text-accent',
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={LINKS.tel}
            data-track="call_click"
            className="hidden items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 font-display text-lg font-bold uppercase tracking-wide text-white hover:text-accent md:inline-flex"
          >
            <Phone className="h-5 w-5 text-accent" aria-hidden />
            <span className="hidden xl:inline">Call Now</span>
            <span className="xl:hidden">{SITE.phoneDisplay}</span>
          </a>
          <BookButton className="btn-primary hidden whitespace-nowrap !min-h-[44px] !py-2 sm:inline-flex">Book Mobile Testing</BookButton>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-md text-white hover:bg-white/10 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto overscroll-contain border-t border-white/10 bg-charcoal pb-[calc(1.5rem+env(safe-area-inset-bottom))] motion-safe:animate-menu-in lg:hidden"
      >
        <nav aria-label="Mobile" className="container py-4">
          <div className="grid gap-5">
            {[
              ...NAV.filter((g) => g.children).map((g) => ({ title: g.label, items: g.children! })),
              { title: 'More', items: NAV.filter((g) => !g.children) },
            ].map((group) => (
              <div key={group.title}>
                <p className="eyebrow mb-2 text-accent">{group.title}</p>
                <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-steel/60">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={cn(
                          'flex items-center justify-between gap-3 px-4 py-3 font-display text-lg font-semibold uppercase text-white transition-colors hover:bg-white/5 active:bg-accent/15',
                          isActive(item.href) && 'bg-accent/10 text-accent',
                        )}
                      >
                        {item.label}
                        <ChevronRight className="h-4 w-4 shrink-0 text-white/40" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            <BookButton className="btn-primary w-full">Book Mobile Testing</BookButton>
            <div className="grid grid-cols-3 gap-2">
              <a href={LINKS.tel} data-track="call_click" className="btn-ghost-dark !px-2 text-base">
                <Phone className="h-5 w-5" aria-hidden /> Call
              </a>
              <a href={LINKS.sms} data-track="sms_click" className="btn-ghost-dark !px-2 text-base">
                <MessageSquareText className="h-5 w-5" aria-hidden /> Text
              </a>
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" className="btn-whatsapp !px-2 text-base">
                <WhatsAppIcon className="h-5 w-5" /> Chat
              </a>
            </div>
            <p className="text-center text-sm text-white/60">{SITE.phoneDisplay} · {SITE.emailService}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
