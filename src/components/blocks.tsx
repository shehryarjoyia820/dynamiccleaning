import Link from 'next/link';
import { ChevronRight, ExternalLink, Phone, Plus } from 'lucide-react';
import { BookButton } from '@/components/booking-context';
import { WhatsAppIcon } from '@/components/contact-bars';
import { JsonLd, breadcrumbSchema } from '@/components/seo';
import { LINKS, SITE } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { Faq, RequirementRow } from '@/content/seed';

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
}) {
  return (
    <Tag data-reveal className={className} style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark,
  center,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal className={cn('max-w-3xl', center && 'mx-auto text-center')}>
      {eyebrow ? <p className={cn('eyebrow', dark ? 'text-orange' : 'text-orange-ink')}>{eyebrow}</p> : null}
      <h2 className={cn('mt-3 text-display-lg', dark ? 'text-white' : 'text-ink')}>{title}</h2>
      {intro ? <p className={cn('mt-4 text-lg', dark ? 'text-muted-dark' : 'text-muted')}>{intro}</p> : null}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: React.ReactNode;
  crumbs: { name: string; path: string }[];
  children?: React.ReactNode;
}) {
  const all = [{ name: 'Home', path: '/' }, ...crumbs];
  return (
    <section className="relative overflow-hidden bg-charcoal pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
      <JsonLd data={breadcrumbSchema(all)} />
      <HeroTexture />
      <div className="container relative">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-dark">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight className="h-3.5 w-3.5" aria-hidden /> : null}
                {i < all.length - 1 ? (
                  <Link href={c.path} className="hover:text-white hover:underline">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/90">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow mt-8 animate-fade-up text-orange">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl animate-fade-up text-display-xl [animation-delay:80ms]">{title}</h1>
        <div className="mt-5 max-w-2xl animate-fade-up text-lg text-white/80 [animation-delay:160ms]">{intro}</div>
        <div className="mt-8 animate-fade-up [animation-delay:240ms]">{children ?? <ContactButtons />}</div>
      </div>
    </section>
  );
}

/** Lightweight decorative background: diagonal hazard stripes + road glow, no images. */
export function HeroTexture() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,107,26,0.18),transparent_55%)]" />
      <div className="absolute -right-24 top-0 h-full w-1/2 opacity-[0.06] [background:repeating-linear-gradient(-45deg,#fff_0_2px,transparent_2px_22px)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange/60 to-transparent" />
    </div>
  );
}

export function ContactButtons({ location, light }: { location?: string; light?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <BookButton className="btn-primary" location={location}>
        Book Mobile Testing
      </BookButton>
      <a href={LINKS.tel} data-track="call_click" className={light ? 'btn-ghost-light' : 'btn-ghost-dark'}>
        <Phone className="h-5 w-5" aria-hidden /> Call {SITE.phoneDisplay}
      </a>
      <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" className="btn-whatsapp">
        <WhatsAppIcon className="h-5 w-5" /> WhatsApp
      </a>
    </div>
  );
}

export function CtaBand({ title = 'Need your trucks tested?', text }: { title?: string; text?: string }) {
  return (
    <section className="relative overflow-hidden bg-steel py-section text-white">
      <HeroTexture />
      <div className="container relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="eyebrow text-orange">We come to you</p>
          <h2 className="mt-3 text-display-lg">{title}</h2>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            {text ?? 'One truck or an entire fleet, anywhere in California. Book online, call or WhatsApp. We reply fast.'}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <ContactButtons />
        </Reveal>
      </div>
    </section>
  );
}

export function RequirementsTable({ rows, frequency }: { rows: RequirementRow[]; frequency: string }) {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-card">
        <table className="w-full text-left">
          <caption className="sr-only">Clean Truck Check test method by vehicle type</caption>
          <thead className="bg-charcoal text-white">
            <tr>
              <th scope="col" className="px-4 py-3.5 font-display text-lg uppercase tracking-wide sm:px-6">Vehicle</th>
              <th scope="col" className="px-4 py-3.5 font-display text-lg uppercase tracking-wide sm:px-6">Test method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {rows.map((r) => (
              <tr key={r.vehicle} className="transition-colors hover:bg-offwhite">
                <td className="px-4 py-4 font-semibold sm:px-6">{r.vehicle}</td>
                <td className="px-4 py-4 sm:px-6">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-green" aria-hidden />
                    {r.method}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted">
        {frequency}{' '}
        <a href={LINKS.carbCtcVis} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-orange-ink underline underline-offset-4">
          Open CTC-VIS <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
        <span className="mt-1 block">Source: California Air Resources Board.</span>
      </p>
    </div>
  );
}

export function FaqList({ faqs, dark }: { faqs: Faq[]; dark?: boolean }) {
  return (
    <div className={cn('divide-y rounded-xl border', dark ? 'divide-white/10 border-white/10 bg-steel' : 'divide-ink/10 border-ink/10 bg-white shadow-card')}>
      {faqs.map((f) => (
        <details key={f.id} className="group">
          <summary
            className={cn(
              'flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 font-display text-xl font-semibold uppercase sm:px-6 [&::-webkit-details-marker]:hidden',
              dark ? 'text-white' : 'text-ink',
            )}
          >
            {f.question}
            <Plus className="h-5 w-5 shrink-0 text-orange transition-transform duration-300 group-open:rotate-45" aria-hidden />
          </summary>
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
            <p className={cn('overflow-hidden px-5 pb-5 sm:px-6', dark ? 'text-white/80' : 'text-muted')}>{f.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function OfficialSourceNote() {
  return (
    <aside className="rounded-xl border-l-4 border-orange bg-white p-5 shadow-card">
      <p className="font-semibold">Official program information</p>
      <p className="mt-1 text-muted">
        Clean Truck Check is run by the California Air Resources Board. For the official rules, deadlines and exemptions, visit{' '}
        <a href={LINKS.carbCtc} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-ink underline underline-offset-4">
          CARB’s Clean Truck Check page
        </a>{' '}
        and check your vehicles in{' '}
        <a href={LINKS.carbCtcVis} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-ink underline underline-offset-4">
          CTC-VIS
        </a>
        . Diesel Dynamix is an independent testing service.
      </p>
    </aside>
  );
}
