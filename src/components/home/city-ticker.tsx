import Link from 'next/link';
import { PORTS } from '@/content/ports';
import type { ServiceArea } from '@/content/seed';

/** Scrolling band of every city and port we serve (pauses on hover; static with reduced motion). */
export function CityTicker({ areas }: { areas: ServiceArea[] }) {
  const items = [
    ...areas.map((a) => ({ href: `/service-areas/${a.slug}`, label: a.name })),
    ...PORTS.map((p) => ({ href: `/ports/${p.slug}`, label: p.name })),
  ];
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it.href} className="flex items-center">
          <Link
            href={it.href}
            tabIndex={hidden ? -1 : undefined}
            className="whitespace-nowrap px-5 font-display text-lg font-semibold uppercase tracking-wide text-ink/80 hover:text-amber-ink"
          >
            Clean Truck Check {it.label}
          </Link>
          <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-amber" />
        </li>
      ))}
    </ul>
  );
  return (
    <nav aria-label="Cities we serve" className="group overflow-hidden border-y border-ink/10 bg-amber/10 py-4">
      <div className="flex w-max motion-safe:animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </nav>
  );
}
