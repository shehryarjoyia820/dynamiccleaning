import Link from 'next/link';
import { Plus } from 'lucide-react';
import { requireStaff } from '@/lib/admin';
import { AdminTitle } from '../../ui';

export const metadata = { title: 'Blog posts' };

export default async function PostsAdmin() {
  const { db } = await requireStaff();
  const { data } = await db.from('posts').select('slug,title,published,published_at').order('published_at', { ascending: false });
  return (
    <>
      <AdminTitle title="Blog posts">
        <Link href="/admin/content/posts/new" className="inline-flex items-center gap-2 rounded-md bg-accent-deep px-4 py-2 text-sm font-bold text-white hover:bg-accent-hover">
          <Plus className="h-4 w-4" aria-hidden /> New post
        </Link>
      </AdminTitle>
      <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-card">
        {(data ?? []).map((p) => (
          <li key={p.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <Link href={`/admin/content/posts/${p.slug}`} className="font-semibold hover:underline">{p.title}</Link>
              <p className="text-sm text-muted">/blog/{p.slug} · {p.published_at}</p>
            </div>
            <span className={p.published ? 'text-sm font-bold text-green-ink' : 'text-sm font-bold text-muted'}>{p.published ? 'Published' : 'Draft'}</span>
          </li>
        ))}
        {!data?.length ? <li className="px-5 py-8 text-center text-muted">No posts yet.</li> : null}
      </ul>
    </>
  );
}
