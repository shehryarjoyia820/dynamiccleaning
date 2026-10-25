import { Mail, Phone } from 'lucide-react';
import { BookButton } from '@/components/booking-context';
import { WhatsAppIcon } from '@/components/contact-bars';
import { LINKS, SITE } from '@/lib/site';

/** Article column + sticky booking card. */
export function PageBody({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="py-section">
      <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,50rem)_22rem] xl:justify-center xl:gap-16 2xl:grid-cols-[minmax(0,52rem)_24rem]">
        <div data-reveal className="prose-dd">
          {children}
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">{aside ?? <BookCard />}</aside>
      </div>
    </section>
  );
}

export function BookCard({ location }: { location?: string }) {
  return (
    <div className="rounded-xl bg-charcoal p-6 text-white shadow-lift">
      <p className="eyebrow text-accent">We come to you</p>
      <h2 className="mt-2 text-3xl">Book mobile testing</h2>
      <p className="mt-2 text-white/80">Tell us how many trucks and where. We reply fast.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <BookButton className="btn-primary w-full" location={location}>
          Book Now
        </BookButton>
        <a href={LINKS.tel} data-track="call_click" className="btn-ghost-dark w-full">
          <Phone className="h-5 w-5" aria-hidden /> {SITE.phoneDisplay}
        </a>
        <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" className="btn-whatsapp w-full">
          <WhatsAppIcon className="h-5 w-5" /> WhatsApp
        </a>
      </div>
      <a href={LINKS.mailService} data-track="email_click" className="mt-4 flex items-center justify-center gap-2 text-sm text-white/80 hover:text-white">
        <Mail className="h-4 w-4" aria-hidden /> {SITE.emailService}
      </a>
    </div>
  );
}

export function Checklist({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="!list-none !pl-0">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green text-[11px] font-bold text-ink" aria-hidden>
            ✓
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
