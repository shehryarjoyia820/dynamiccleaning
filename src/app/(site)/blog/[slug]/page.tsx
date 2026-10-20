import { notFound } from 'next/navigation';
import { CtaBand, OfficialSourceNote, PageHero } from '@/components/blocks';
import { PageBody } from '@/components/page-parts';
import { JsonLd, pageMeta } from '@/components/seo';
import { POSTS } from '@/content/seed';
import { getPost } from '@/lib/content';
import { Markdown } from '@/lib/markdown';
import { SITE } from '@/lib/site';
import { formatDate } from '@/lib/utils';

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return pageMeta({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` });
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
          author: { '@type': 'Organization', name: SITE.name },
          publisher: { '@id': `${SITE.url}/#business` },
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
        <Markdown source={post.body} />
        <div className="mt-10">
          <OfficialSourceNote />
        </div>
      </PageBody>
      <CtaBand />
    </>
  );
}
