import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand, PageHero, Reveal } from '@/components/blocks';
import { CaliforniaMap } from '@/components/california-map';
import { pageMeta } from '@/components/seo';
import { PORTS } from '@/content/ports';
import { REGIONS } from '@/content/seed';
import { getServiceAreas } from '@/lib/content';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Clean Truck Check Near Me | Southern California Service Areas',
  description:
    'Diesel Dynamix provides mobile Clean Truck Check testing across Southern California: Los Angeles, Long Beach, Orange County, the Inland Empire, San Diego and the Imperial Valley.',
  path: '/service-areas',
});

export default async function ServiceAreasPage() {
  const areas = await getServiceAreas();
  return (
    <>
      <PageHero
        eyebrow="Service areas"
        title="Clean Truck Check near you, anywhere in Southern California"
        intro="We cover Los Angeles, Orange, Riverside, San Bernardino, San Diego and Imperial counties. If your city is not listed, just ask."
        crumbs={[{ name: 'Service Areas', path: '/service-areas' }]}
      />
      <section className="bg-[#0F141B] py-section text-white">
        <div className="container grid items-start gap-12 lg:grid-cols-[1fr_1.4fr]">
          <CaliforniaMap areas={areas} className="mx-auto w-full max-w-md lg:sticky lg:top-28" />
          <div className="grid gap-10">
            <Reveal>
              <h2 className="text-3xl text-accent">Ports</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {PORTS.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/ports/${p.slug}`}
                      className="group flex items-center justify-between rounded-lg border border-white/10 bg-steel px-4 py-3.5 transition-colors hover:border-accent/60"
                    >
                      <span className="font-display text-xl font-semibold uppercase">{p.name}</span>
                      <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
            {REGIONS.map((r) => {
              const list = areas.filter((a) => a.region === r);
              if (!list.length) return null;
              return (
                <Reveal key={r}>
                  <h2 className="text-3xl text-accent">{r}</h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {list.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/service-areas/${a.slug}`}
                          className="group flex items-center justify-between rounded-lg border border-white/10 bg-steel px-4 py-3.5 transition-colors hover:border-accent/60"
                        >
                          <span className="font-display text-xl font-semibold uppercase">{a.name}</span>
                          <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" aria-hidden />
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
      <CtaBand title="Don’t see your city?" text="We cover all of Southern California. Tell us where your trucks are and we will plan the visit." />
    </>
  );
}
