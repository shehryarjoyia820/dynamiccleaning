'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { ArrowRight, Check, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { useBooking } from '@/components/booking-context';
import { ContactButtons } from '@/components/blocks';
import { SceneFleet, SceneHighway, SceneOnSite } from '@/components/home/scenes';
import { cn } from '@/lib/utils';

type Slide = {
  title: string;
  text: string;
  icon: typeof Truck;
  scene: () => React.ReactElement;
  /** Swap in a real photo (WebP/AVIF in /public/hero, under 200 KB) when available. */
  image?: string;
  alt?: string;
};

const SLIDES: Slide[] = [
  { title: 'Stay Compliant. Keep Moving.', text: 'California Clean Truck Check mobile testing.', icon: ShieldCheck, scene: SceneHighway },
  { title: 'We Come to You.', text: 'On-site testing anywhere in Southern California: your yard, jobsite or terminal.', icon: MapPin, scene: SceneOnSite },
  { title: 'One Truck or an Entire Fleet.', text: 'Fleet scheduling made simple, with recurring testing so you never miss a deadline.', icon: Truck, scene: SceneFleet },
];

export function HeroSlider() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, duration: 32 },
    reduced ? [Fade()] : [Fade(), Autoplay({ delay: 6500, stopOnMouseEnter: true, stopOnInteraction: false })],
  );
  const [index, setIndex] = useState(0);
  const [playKey, setPlayKey] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setIndex(embla.selectedScrollSnap());
    setPlayKey((k) => k + 1);
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on('select', onSelect);
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla, onSelect]);

  const go = (i: number) => embla?.scrollTo(i);

  return (
    <section aria-roledescription="carousel" aria-label="Diesel Dynamix highlights" className="relative isolate min-h-[100svh] overflow-hidden bg-charcoal text-white">
      <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {SLIDES.map((s, i) => (
            <div
              key={s.title}
              className="relative h-full min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              aria-hidden={i !== index}
            >
              <div key={i === index ? playKey : 'idle'} className={cn('absolute inset-0 origin-center', i === index && 'motion-safe:animate-kenburns')}>
                {s.image ? (
                  <Image src={s.image} alt={s.alt ?? ''} fill priority={i === 0} sizes="100vw" className="object-cover" />
                ) : (
                  <s.scene />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Overlay: at least 60% dark behind all text, per the brief. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/75 to-charcoal/30" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal to-transparent" />

      <div className="container relative grid min-h-[100svh] items-center gap-10 pb-28 pt-28 sm:pb-24 lg:grid-cols-[minmax(0,1fr)_23rem]">
      <div className="flex flex-col justify-center">
        <h1 className="eyebrow flex animate-fade-up items-center gap-3 text-accent sm:text-sm">
          <span aria-hidden className="h-0.5 w-8 bg-accent" />
          California Clean Truck Check Made Simple
        </h1>
        <div className="relative mt-4 min-h-[9.5rem] sm:min-h-[11rem]" aria-live="off">
          {SLIDES.map((s, i) => (
            <div
              key={s.title}
              className={cn(
                'transition-all duration-700 ease-out',
                i === index ? 'relative translate-y-0 opacity-100' : 'pointer-events-none absolute inset-x-0 top-0 translate-y-4 opacity-0',
              )}
              aria-hidden={i !== index}
            >
              <p className="max-w-3xl font-display text-display-xl font-extrabold uppercase">{s.title}</p>
              <p className="mt-4 flex max-w-xl items-start gap-2 text-lg text-white/85 sm:text-xl">
                <s.icon className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden />
                {s.text}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-2 max-w-xl animate-fade-up font-display text-2xl font-semibold uppercase text-white [animation-delay:120ms]">
          Mobile CARB emissions testing. <span className="text-accent">We come to you.</span>
        </p>
        <div className="mt-8 animate-fade-up [animation-delay:200ms]">
          <ContactButtons />
        </div>
        <ul className="mt-6 flex animate-fade-up flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/80 [animation-delay:260ms]">
          {['All of Southern California', 'Tested at your yard', 'Fleets & owner-operators'].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-accent" aria-hidden /> {t}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center gap-4">
          <button type="button" onClick={() => embla?.scrollPrev()} className="grid h-11 w-11 place-items-center rounded-full border border-white/25 hover:border-white hover:bg-white/10" aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                aria-current={i === index}
                className="group grid h-11 w-11 place-items-center"
              >
                <span className={cn('block h-1.5 rounded-full transition-all duration-300', i === index ? 'w-9 bg-accent' : 'w-4 bg-white/40 group-hover:bg-white/70')} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => embla?.scrollNext()} className="grid h-11 w-11 place-items-center rounded-full border border-white/25 hover:border-white hover:bg-white/10" aria-label="Next slide">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <QuickQuote />
      </div>
    </section>
  );
}

/** Two-field quote starter in the hero; opens the booking modal prefilled. */
function QuickQuote() {
  const { open } = useBooking();
  return (
    <form
      className="hidden animate-fade-up rounded-2xl border border-white/10 bg-charcoal/70 p-6 shadow-lift backdrop-blur-md [animation-delay:300ms] lg:block"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        open({ location: String(f.get('where') || '') || undefined, trucks: Number(f.get('trucks')) || undefined });
      }}
    >
      <p className="eyebrow text-accent">Quick quote</p>
      <p className="mt-2 font-display text-3xl font-bold uppercase leading-none">Get tested this week</p>
      <p className="mt-2 text-sm text-white/70">Two details and we’ll take it from there.</p>
      <label htmlFor="qq-where" className="mt-5 block text-sm font-semibold text-white">Where are your trucks?</label>
      <input id="qq-where" name="where" placeholder="City or ZIP" autoComplete="postal-code" className="field mt-1.5" />
      <label htmlFor="qq-trucks" className="mt-4 block text-sm font-semibold text-white">How many trucks?</label>
      <select id="qq-trucks" name="trucks" className="field mt-1.5" defaultValue="1">
        <option value="1">1 truck</option>
        <option value="3">2–5 trucks</option>
        <option value="10">6–20 trucks</option>
        <option value="25">20+ trucks</option>
      </select>
      <button className="btn-primary mt-5 w-full">
        Check availability <ArrowRight className="h-5 w-5" aria-hidden />
      </button>
      <p className="mt-3 text-center text-xs text-white/60">No obligation · We reply fast</p>
    </form>
  );
}
