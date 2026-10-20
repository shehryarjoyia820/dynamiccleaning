'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarCheck, ClipboardCheck, PhoneCall, Truck, Wrench } from 'lucide-react';
import type { Counter } from '@/content/seed';
import { cn } from '@/lib/utils';

const STEPS = [
  { icon: PhoneCall, title: 'Contact us', text: 'Call, WhatsApp or book online. Tell us how many trucks and where they are.' },
  { icon: CalendarCheck, title: 'Schedule', text: 'We confirm a time that fits your dispatch, even early mornings.' },
  { icon: Wrench, title: 'On-site testing', text: 'Our tester arrives at your yard and runs the test your truck requires.' },
  { icon: ClipboardCheck, title: 'Results & next steps', text: 'Results are submitted and we explain exactly what comes next.' },
];

/** Four steps with a truck that drives along the line as the section scrolls. */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the section top hits 85% of the viewport, 1 when its bottom reaches 55%.
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const active = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length * 0.999));

  return (
    <div ref={ref} className="relative [overflow-x:clip] lg:pt-12">
      {/* Track: vertical on mobile, horizontal on desktop */}
      <div aria-hidden className="absolute left-[26px] top-0 h-full w-1 rounded bg-ink/10 lg:hidden">
        <div className="h-full w-full origin-top rounded bg-accent" style={{ transform: `scaleY(${progress})` }} />
      </div>
      <div aria-hidden className="absolute left-0 top-[74px] hidden h-1 w-full rounded bg-ink/10 lg:block">
        <div className="h-full w-full origin-left rounded bg-accent" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <TruckRunner progress={progress} />
      <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative flex gap-5 lg:flex-col lg:gap-0">
            <span
              className={cn(
                'relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border-4 transition-colors duration-500',
                i <= active ? 'border-accent bg-charcoal text-accent' : 'border-ink/10 bg-white text-muted',
              )}
            >
              <s.icon className="h-6 w-6" aria-hidden />
            </span>
            <div className="lg:mt-6">
              <p className="font-display text-sm font-bold uppercase tracking-widest text-accent-ink">Step {i + 1}</p>
              <h3 className="mt-1 text-2xl">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TruckRunner({ progress }: { progress: number }) {
  return (
    // The wrapper spans the track, so translateX(p * 100%) moves the truck along it (GPU transform only).
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-10 will-change-transform lg:block"
      style={{ transform: `translate3d(${progress * 100}%,0,0)` }}
    >
      <div className="grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full bg-accent-deep text-white shadow-lift">
        <Truck className="h-5 w-5" />
      </div>
    </div>
  );
}

/** Counts up once when scrolled into view. Only real, verified numbers belong here. */
export function Counters({ items, dark }: { items: Counter[]; dark?: boolean }) {
  const ref = useRef<HTMLDListElement>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setT(1);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1600);
          setT(1 - Math.pow(1 - p, 3));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <dl ref={ref} className="grid gap-6 sm:grid-cols-3">
      {items.map((c) => (
        <div key={c.label} className={cn('rounded-xl border p-6', dark ? 'border-white/10 bg-steel' : 'border-ink/10 bg-white shadow-card')}>
          <dt className={cn('order-2 mt-1', dark ? 'text-muted-dark' : 'text-muted')}>{c.label}</dt>
          <dd className={cn('font-display text-6xl font-extrabold tabular-nums', dark ? 'text-accent' : 'text-accent-ink')}>
            {/* Screen readers get the final value, not the animation. */}
            <span aria-hidden>{Math.round(c.value * t).toLocaleString()}</span>
            <span className="sr-only">{c.value.toLocaleString()}</span>
            {c.suffix}
          </dd>
        </div>
      ))}
    </dl>
  );
}
