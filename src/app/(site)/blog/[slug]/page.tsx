import { notFound } from 'next/navigation';
import { CtaBand, OfficialSourceNote, PageHero } from '@/components/blocks';
import { PageBody } from '@/components/page-parts';
import { JsonLd, pageMeta } from '@/components/seo';
import { POSTS } from '@/content/seed';
import { getPost } from '@/lib/content';
import { Markdown } from '@/lib/markdown';
import { sanitizeBlogHtml } from '@/lib/sanitize';
import { SITE } from '@/lib/site';
import { formatDate } from '@/lib/utils';
import { SeoExtras } from '@/components/seo-extras';

export const revalidate = 300;

/** Guides written in Spanish: marked lang="es" so search engines read them as Spanish. */
const SPANISH = new Set(['clean-truck-check-en-espanol', 'prueba-de-humo-camiones-sur-de-california']);
export const dynamicParams = true;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const meta = pageMeta({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` });
  if (post.cover_url) {
    meta.openGraph = { ...meta.openGraph, type: 'article', publishedTime: post.published_at, images: [{ url: post.cover_url, alt: post.cover_alt ?? post.title }] };
    meta.twitter = { card: 'summary_large_image', images: [post.cover_url] };
  }
  return meta;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.published_at,
          dateModified: post.published_at,
          // Google needs an image for Article rich results: the cover, else the site's share image.
          image: post.cover_url ? [post.cover_url] : [`${SITE.url}/opengraph-image`],
          inLanguage: SPANISH.has(post.slug) ? 'es' : 'en-US',
          author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          publisher: { '@type': 'Organization', '@id': `${SITE.url}/#business`, name: SITE.name, logo: { '@type': 'ImageObject', url: `${SITE.url}/brand/app-icon.svg` } },
          mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
        }}
      />
      <PageHero
        eyebrow={formatDate(post.published_at)}
        title={post.title}
        intro={post.excerpt}
        crumbs={[
          { name: 'Blog & Updates', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <PageBody>
        {post.cover_url ? (
          <figure className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_url} alt={post.cover_alt ?? ''} width={1600} height={900} className="aspect-[16/9] w-full rounded-xl object-cover" fetchPriority="high" />
          </figure>
        ) : null}
        <div lang={SPANISH.has(post.slug) ? 'es' : undefined}>
          {post.body_html ? <div dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.body_html) }} /> : <Markdown source={post.body} />}
        </div>
        <div className="mt-10">
          <OfficialSourceNote />
        </div>
      </PageBody>
      <SeoExtras path={`/blog/${post.slug}`} />
      <CtaBand />
    </>
  );
}
