import { requireStaff } from '@/lib/admin';
import { inviteStaff, removeStaff } from '../actions';
import { AdminTitle, SmallButton } from '../ui';

export const metadata = { title: 'Team' };

export default async function TeamPage() {
  const { db, user } = await requireStaff({ admin: true });
  const { data } = await db.from('profiles').select('id,full_name,role,created_at').order('created_at');
  return (
    <>
      <AdminTitle title="Team" />
      <section className="card mb-8 max-w-3xl">
        <h2 className="text-2xl">Invite a team member</h2>
        <p className="mt-1 text-sm text-muted">They get an email link, set up two-factor authentication, then choose a password.</p>
        <form action={inviteStaff} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_8rem_auto]">
          <input name="full_name" required placeholder="Full name" aria-label="Full name" className="field" />
          <input name="email" type="email" required placeholder="Email" aria-label="Email" className="field" />
          <select name="role" aria-label="Role" className="field">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <SmallButton>Invite</SmallButton>
        </form>
      </section>
      <ul className="max-w-3xl divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-card">
        {(data ?? []).map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="font-semibold">{p.full_name || '(no name)'}</p>
              <p className="text-sm capitalize text-muted">{p.role}</p>
            </div>
            {p.id !== user.id ? (
              <form action={removeStaff.bind(null, p.id)}>
                <button className="text-sm font-semibold text-[#B42318] underline underline-offset-4">Remove access</button>
              </form>
            ) : (
              <span className="text-sm text-muted">You</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
