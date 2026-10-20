import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { deletePost, savePost } from '../../../actions';
import { AdminTitle, SmallButton } from '../../../ui';
import { markdownToEditorHtml } from '@/lib/sanitize';
import { BodyEditor, CoverField } from './post-editor';

export const metadata = { title: 'Edit post' };

export default async function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { db } = await requireStaff();
  const isNew = slug === 'new';
  let post = {
    slug: '',
    title: '',
    excerpt: '',
    body: '',
    body_html: null as string | null,
    cover_url: null as string | null,
    cover_alt: null as string | null,
    published_at: new Date().toISOString().slice(0, 10),
    published: false,
  };
  if (!isNew) {
    const { data } = await db.from('posts').select('*').eq('slug', slug).maybeSingle();
    if (!data) notFound();
    post = data;
  }

  return (
    <>
      <Link href="/admin/content/posts" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All posts
      </Link>
      <AdminTitle title={isNew ? 'New post' : 'Edit post'} />
      <form action={savePost} className="card grid max-w-5xl gap-5">
        <input type="hidden" name="original_slug" value={isNew ? '' : post.slug} />
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input id="title" name="title" defaultValue={post.title} required className="field" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="slug">URL slug</label>
            <input id="slug" name="slug" defaultValue={post.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="e.g. 2027-testing-changes" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="published_at">Publish date</label>
            <input id="published_at" name="published_at" type="date" defaultValue={post.published_at} required className="field" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="excerpt">Summary (shown in lists and search results)</label>
          <textarea id="excerpt" name="excerpt" defaultValue={post.excerpt} rows={2} maxLength={400} className="field" />
        </div>
        <CoverField url={post.cover_url ?? ''} alt={post.cover_alt ?? ''} />
        <BodyEditor initialHtml={post.body_html || markdownToEditorHtml(post.body)} />
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="published" defaultChecked={post.published} className="h-4 w-4" /> Published (visible on the site)
        </label>
        <div className="flex items-center gap-4">
          <SmallButton className="px-5 py-2.5">Save post</SmallButton>
          {!isNew ? (
            <>
              <a href={`/blog/${post.slug}`} target="_blank" className="text-sm font-semibold underline underline-offset-4">View</a>
              <button formAction={deletePost.bind(null, post.slug)} formNoValidate className="text-sm font-semibold text-[#B42318] underline underline-offset-4">
                Delete post
              </button>
            </>
          ) : null}
        </div>
      </form>
    </>
  );
}
