'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { BookingForm } from '@/components/forms';

type Ctx = { open: (prefill?: { location?: string; trucks?: number }) => void };
// Outside a provider (e.g. admin), "Book" falls back to the booking page.
const BookingCtx = createContext<Ctx>({ open: () => window.location.assign('/book') });

export function useBooking() {
  return useContext(BookingCtx);
}

/** Booking modal available from every "Book" button on the site. */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [prefill, setPrefill] = useState<{ location?: string; trucks?: number }>({});
  const [mounted, setMounted] = useState(false);

  const open = useCallback((p?: { location?: string; trucks?: number }) => {
    setPrefill(p ?? {});
    setMounted(true);
    // The <dialog> is always rendered, so it can open now; its form mounts on the next render.
    if (!ref.current?.open) ref.current?.showModal();
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener('click', onClick);
    return () => d.removeEventListener('click', onClick);
  }, [mounted]);

  return (
    <BookingCtx.Provider value={{ open }}>
      {children}
      <dialog
        ref={ref}
        aria-labelledby="book-modal-title"
        className="on-light w-[min(100%-1.5rem,40rem)] rounded-2xl bg-offwhite p-0 text-ink shadow-lift backdrop:bg-charcoal/80 backdrop:backdrop-blur-sm open:animate-fade-up"
      >
        {mounted ? (
          <div className="max-h-[90dvh] overflow-y-auto p-5 sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-accent-ink">Book mobile testing</p>
                <h2 id="book-modal-title" className="mt-2 text-3xl">
                  We come to you
                </h2>
                <p className="mt-1 text-muted">Tell us about your truck(s). We reply fast, usually the same business day.</p>
              </div>
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink/5 hover:bg-ink/10"
                aria-label="Close booking form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <BookingForm key={`${prefill.location}-${prefill.trucks}`} compact defaultLocation={prefill.location} defaultTrucks={prefill.trucks} source="modal" />
          </div>
        ) : null}
      </dialog>
    </BookingCtx.Provider>
  );
}

export function BookButton({
  children,
  className,
  location,
}: {
  children: React.ReactNode;
  className?: string;
  location?: string;
}) {
  const { open } = useBooking();
  return (
    <a
      href="/book"
      className={className}
      data-track="book_click"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        open({ location });
      }}
    >
      {children}
    </a>
  );
}
