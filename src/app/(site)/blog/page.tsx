import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand, PageHero, Reveal } from '@/components/blocks';
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
                <Link href={`/blog/${p.slug}`} className="card group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1">
                  <time dateTime={p.published_at} className="text-sm text-muted">
                    {formatDate(p.published_at)}
                  </time>
                  <h2 className="mt-2 text-2xl group-hover:text-orange-ink">{p.title}</h2>
                  <p className="mt-3 flex-1 text-muted">{p.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-display font-bold uppercase text-orange-ink">
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
