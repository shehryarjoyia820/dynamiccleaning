import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { FaqList, Reveal, SectionHeading } from '@/components/blocks';
import { JsonLd, faqSchema } from '@/components/seo';
import { getServiceAreas } from '@/lib/content';
import { Markdown } from '@/lib/markdown';
import { pageSeo, withSeoFaqs } from '@/lib/page-seo';

/**
 * Keyword sections, nearby areas and FAQs for a page (from page-seo.json).
 * `schema={false}` when the page already outputs FAQPage JSON-LD (it merges these FAQs into it with withSeoFaqs),
 * so a page never carries two FAQPage blocks.
 */
export async function SeoExtras({ path, faqs = true, schema = true, area }: { path: string; faqs?: boolean; schema?: boolean; area?: string }) {
  const seo = pageSeo(path);
  if (!seo) return null;
  const list = faqs ? withSeoFaqs(path, []) : [];
  const hasBody = !!(seo.sections?.length || seo.nearby?.length || list.length);
  if (!hasBody) return null;
  // Nearby places that have their own city page become links (internal linking for local SEO).
  const areaBySlug = new Map((seo.nearby?.length ? await getServiceAreas() : []).map((a) => [a.name.toLowerCase(), a.slug]));
  return (
    <section className="bg-white py-section">
      <div className="container grid gap-12">
        {seo.sections?.length ? (
          <div className="grid gap-10 lg:grid-cols-2">
            {seo.sections.map((s) => (
              <Reveal key={s.heading} as="article" className="prose-dd max-w-none">
                <h2 className="!mt-0">{s.heading}</h2>
                <Markdown source={s.body} />
              </Reveal>
            ))}
          </div>
        ) : null}

        {seo.nearby?.length ? (
          <Reveal>
            <h2 className="flex items-center gap-2 text-2xl">
              <MapPin className="h-5 w-5 text-accent-ink" aria-hidden /> {area ? `Areas we drive to around ${area}` : 'Areas we drive to'}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {seo.nearby.map((n) => (
                <li key={n}>
                  {areaBySlug.has(n.toLowerCase()) ? (
                    <Link
                      href={`/service-areas/${areaBySlug.get(n.toLowerCase())}`}
                      className="inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent-ink hover:bg-accent/20"
                    >
                      {n}
                    </Link>
                  ) : (
                    <span className="inline-block rounded-full border border-ink/10 bg-offwhite px-3 py-1.5 text-sm font-semibold text-ink">{n}</span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {list.length ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12">
            {schema ? <JsonLd data={faqSchema(list)} /> : null}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading eyebrow="Questions" title={schema ? 'Frequently asked questions' : 'More questions'} />
              <p className="mt-4 text-muted">
                Still unsure? Call or text <a href="tel:+18583428328" className="font-semibold text-accent-ink underline underline-offset-4">(858) 342-8328</a> and we will help.
              </p>
            </div>
            <FaqList faqs={list} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
