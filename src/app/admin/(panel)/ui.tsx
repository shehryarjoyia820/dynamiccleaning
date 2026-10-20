import { cn } from '@/lib/utils';

export const STATUS_STYLES: Record<string, string> = {
  new: 'bg-orange/15 text-orange-ink',
  contacted: 'bg-[#E0EAFF] text-[#2D3E8C]',
  scheduled: 'bg-[#FEF0C7] text-[#7A4A06]',
  completed: 'bg-green/15 text-green-ink',
  closed: 'bg-ink/10 text-muted',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide', STATUS_STYLES[status])}>{status}</span>
  );
}

export function AdminTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <h1 className="text-4xl">{title}</h1>
      {children}
    </div>
  );
}

export function SmallButton({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={cn('rounded-md bg-orange px-3 py-2 text-sm font-bold text-ink hover:bg-orange-deep disabled:opacity-60', className)}>
      {children}
    </button>
  );
}
