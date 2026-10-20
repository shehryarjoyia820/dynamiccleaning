'use client';

import { CalendarCheck, MessageSquareText, Phone } from 'lucide-react';
import { useBooking } from '@/components/booking-context';
import { LINKS } from '@/lib/site';

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.39 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

/** Floating WhatsApp button (tablet/desktop). Phones get the sticky bar instead. */
export function WhatsAppFab() {
  return (
    <a
      href={LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
      aria-label="Chat with Diesel Dynamix on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 hidden h-16 w-16 place-items-center rounded-full bg-[#128048] text-white shadow-lift transition-transform duration-200 hover:-translate-y-1 hover:scale-105 md:grid"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/50 motion-safe:animate-pulse-ring" aria-hidden />
      <WhatsAppIcon className="relative h-8 w-8" />
    </a>
  );
}

/** Sticky bottom action bar on phones: Call · Text · WhatsApp · Book. */
export function StickyMobileBar() {
  const { open } = useBooking();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-charcoal/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="grid grid-cols-4">
        <a href={LINKS.tel} data-track="call_click" className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-white active:bg-white/10">
          <Phone className="h-5 w-5 text-accent" aria-hidden />
          <span className="font-display text-sm font-bold uppercase tracking-wide">Call</span>
        </a>
        <a href={LINKS.sms} data-track="sms_click" className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 border-l border-white/10 text-white active:bg-white/10">
          <MessageSquareText className="h-5 w-5 text-accent" aria-hidden />
          <span className="font-display text-sm font-bold uppercase tracking-wide">Text</span>
        </a>
        <a
          href={LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp_click"
          className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 border-x border-white/10 text-white active:bg-white/10"
        >
          <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
          <span className="font-display text-sm font-bold uppercase tracking-wide">WhatsApp</span>
        </a>
        <a
          href="/book"
          data-track="book_click"
          onClick={(e) => {
            e.preventDefault();
            open();
          }}
          className="flex min-h-[60px] flex-col items-center justify-center gap-0.5 bg-accent-deep text-white active:bg-accent-hover"
        >
          <CalendarCheck className="h-5 w-5" aria-hidden />
          <span className="font-display text-sm font-bold uppercase tracking-wide">Book</span>
        </a>
      </div>
    </div>
  );
}
