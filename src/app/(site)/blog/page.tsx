import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand, PageHero, Reveal } from '@/components/blocks';
import { NewsletterForm } from '@/components/newsletter';
import { pageMeta } from '@/components/seo';
import { getPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Blog & Compliance Updates',
  description: 'Clean Truck Check news, deadline reminders and practical compliance guides for California truck owners and fleets.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero eyebrow="Blog & updates" title="Compliance news and guides" intro="Practical updates on Clean Truck Check for owner-operators and fleets." crumbs={[{ name: 'Blog & Updates', path: '/blog' }]} />
      <section className="py-section">
        <div className="container">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 80}>
                <Link href={`/blog/${p.slug}`} className="card group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                  {p.cover_url ? (
                    <div className="-mx-6 -mt-6 mb-5 aspect-[16/9] overflow-hidden bg-offwhite">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover_url} alt={p.cover_alt ?? ''} loading={i < 3 ? 'eager' : 'lazy'} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : null}
                  <time dateTime={p.published_at} className="text-sm text-muted">
                    {formatDate(p.published_at)}
                  </time>
                  <h2 className="mt-2 text-2xl group-hover:text-accent-ink">{p.title}</h2>
                  <p className="mt-3 flex-1 text-muted">{p.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-display font-bold uppercase text-accent-ink">
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-14 rounded-xl bg-charcoal p-6 sm:p-8">
            <div className="max-w-xl">
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
