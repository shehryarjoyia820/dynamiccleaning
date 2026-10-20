'use client';

import { useRef, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

/**
 * Wraps a table whose rows contain <RowCheck value={id} />. Adds a toolbar with
 * select-all and "Delete selected", which asks for confirmation before running
 * the server action with the checked ids.
 */
export function BulkForm({
  action,
  noun,
  canDelete,
  children,
}: {
  action: (form: FormData) => Promise<void>;
  noun: string;
  canDelete: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);

  const boxes = () => Array.from(ref.current?.querySelectorAll<HTMLInputElement>('input[name="ids"]') ?? []);
  const sync = () => setCount(boxes().filter((b) => b.checked).length);
  const total = () => boxes().length;

  return (
    <form
      ref={ref}
      onChange={sync}
      action={async (fd) => {
        setBusy(true);
        try {
          await action(fd);
        } finally {
          setBusy(false);
          boxes().forEach((b) => (b.checked = false));
          setCount(0);
        }
      }}
      onSubmit={(e) => {
        if (!confirm(`Permanently delete ${count} ${noun}${count === 1 ? '' : 's'}? This cannot be undone.`)) e.preventDefault();
      }}
    >
      {canDelete ? (
        <div className="mb-2 flex min-h-[40px] flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={count > 0 && count === total()}
              onChange={(e) => {
                boxes().forEach((b) => (b.checked = e.target.checked));
                sync();
              }}
              aria-label={`Select all ${noun}s on this page`}
            />
            Select all
          </label>
          {count > 0 ? (
            <>
              <span className="text-muted">{count} selected</span>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#B42318] px-3 py-1.5 font-semibold text-white hover:bg-[#912018] disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Trash2 className="h-4 w-4" aria-hidden />}
                Delete selected
              </button>
            </>
          ) : null}
        </div>
      ) : null}
      {children}
    </form>
  );
}

export function RowCheck({ value, label, show }: { value: string; label: string; show: boolean }) {
  if (!show) return null;
  return <input type="checkbox" name="ids" value={value} className="h-4 w-4" aria-label={`Select ${label}`} />;
}
