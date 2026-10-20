import { Camera } from 'lucide-react';
import { CtaBand, PageHero, Reveal } from '@/components/blocks';
import { pageMeta } from '@/components/seo';
import { SceneFleet, SceneHighway, SceneOnSite } from '@/components/home/scenes';

export const metadata = pageMeta({
  title: 'Gallery',
  description: 'Photos of the Diesel Dynamix mobile testing vehicle, equipment and technicians at work across Southern California.',
  path: '/gallery',
});

/**
 * Real photos go in /public/gallery as WebP and are listed here with alt text.
 * Until they arrive the page shows the brand illustrations, clearly labelled.
 */
const PHOTOS: { src: string; alt: string }[] = [];

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="On the road and on-site" intro="A look at our mobile testing service at work." crumbs={[{ name: 'Gallery', path: '/gallery' }]} />
      <section className="py-section">
        <div className="container">
          {PHOTOS.length === 0 ? (
            <>
              <Reveal className="mb-8 flex items-center gap-3 rounded-lg border border-ink/10 bg-white p-4 text-muted shadow-card">
                <Camera className="h-5 w-5 shrink-0 text-accent-ink" aria-hidden />
                Real photos of our vehicle, team and equipment are coming soon. Below are illustrations of our service.
              </Reveal>
              <ul className="grid gap-6 md:grid-cols-3">
                {[SceneHighway, SceneOnSite, SceneFleet].map((Scene, i) => (
                  <Reveal as="li" key={i} delay={i * 100} className="aspect-[4/3] overflow-hidden rounded-xl bg-charcoal">
                    <Scene />
                  </Reveal>
                ))}
              </ul>
            </>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PHOTOS.map((p, i) => (
                <Reveal as="li" key={p.src} delay={(i % 3) * 80} className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105" />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
