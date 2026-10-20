import { requireStaff } from '@/lib/admin';
import { deleteFaq, saveFaq } from '../../actions';
import { AdminTitle, SmallButton } from '../../ui';

export const metadata = { title: 'FAQs' };

type Row = { id: string; question: string; answer: string; category: string; sort: number; published: boolean };

function FaqForm({ f }: { f?: Row }) {
  return (
    <form action={saveFaq} className="grid gap-3 sm:grid-cols-[1fr_10rem_6rem]">
      {f ? <input type="hidden" name="id" value={f.id} /> : null}
      <div className="sm:col-span-3">
        <label className="label" htmlFor={`q-${f?.id ?? 'new'}`}>Question</label>
        <input id={`q-${f?.id ?? 'new'}`} name="question" defaultValue={f?.question} required className="field" />
      </div>
      <div className="sm:col-span-3">
        <label className="label" htmlFor={`a-${f?.id ?? 'new'}`}>Answer</label>
        <textarea id={`a-${f?.id ?? 'new'}`} name="answer" defaultValue={f?.answer} required rows={3} className="field" />
      </div>
      <div>
        <label className="label" htmlFor={`c-${f?.id ?? 'new'}`}>Category</label>
        <input id={`c-${f?.id ?? 'new'}`} name="category" defaultValue={f?.category ?? 'Program'} className="field" />
      </div>
      <div>
        <label className="label" htmlFor={`s-${f?.id ?? 'new'}`}>Order</label>
        <input id={`s-${f?.id ?? 'new'}`} name="sort" type="number" defaultValue={f?.sort ?? 100} className="field" />
      </div>
      <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold">
        <input type="checkbox" name="published" defaultChecked={f?.published ?? true} className="h-4 w-4" /> Live
      </label>
      <div className="flex items-center gap-4 sm:col-span-3">
        <SmallButton>{f ? 'Save' : 'Add FAQ'}</SmallButton>
        {f ? (
          <button formAction={deleteFaq.bind(null, f.id)} className="text-sm font-semibold text-[#B42318] underline underline-offset-4">
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default async function FaqsAdmin() {
  const { db } = await requireStaff();
  const { data } = await db.from('faqs').select('*').order('sort');
  return (
    <>
      <AdminTitle title="FAQs" />
      <section className="card mb-8">
        <h2 className="mb-4 text-2xl">Add a question</h2>
        <FaqForm />
      </section>
      <ul className="grid gap-4">
        {((data ?? []) as Row[]).map((f) => (
          <li key={f.id} className="card">
            <FaqForm f={f} />
          </li>
        ))}
      </ul>
    </>
  );
}
