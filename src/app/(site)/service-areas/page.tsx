import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand, PageHero, Reveal } from '@/components/blocks';
import { CaliforniaMap } from '@/components/california-map';
import { pageMeta } from '@/components/seo';
import { REGIONS } from '@/content/seed';
import { getServiceAreas } from '@/lib/content';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Service Areas: Mobile Clean Truck Check Across California',
  description:
    'Diesel Dynamix provides mobile Clean Truck Check testing statewide: Southern California, the Central Valley, the Bay Area, Northern California and the Central Coast.',
  path: '/service-areas',
});

export default async function ServiceAreasPage() {
  const areas = await getServiceAreas();
  return (
    <>
      <PageHero
        eyebrow="Service areas"
        title="Mobile testing anywhere in California"
        intro="These are our most-requested areas, but we cover the whole state. If your city is not listed, just ask."
        crumbs={[{ name: 'Service Areas', path: '/service-areas' }]}
      />
      <section className="bg-[#1B1D23] py-section text-white">
        <div className="container grid items-start gap-12 lg:grid-cols-[1fr_1.4fr]">
          <CaliforniaMap areas={areas} className="mx-auto w-full max-w-md lg:sticky lg:top-28" />
          <div className="grid gap-10">
            {REGIONS.map((r) => {
              const list = areas.filter((a) => a.region === r);
              if (!list.length) return null;
              return (
                <Reveal key={r}>
                  <h2 className="text-3xl text-orange">{r}</h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {list.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/service-areas/${a.slug}`}
                          className="group flex items-center justify-between rounded-lg border border-white/10 bg-steel px-4 py-3.5 transition-colors hover:border-orange/60"
                        >
                          <span className="font-display text-xl font-semibold uppercase">{a.name}</span>
                          <ArrowRight className="h-5 w-5 text-orange transition-transform group-hover:translate-x-1" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <CtaBand title="Don’t see your city?" text="We test statewide. Tell us where your trucks are and we will plan the visit." />
    </>
  );
}
