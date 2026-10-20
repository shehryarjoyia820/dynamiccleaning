import { cn } from '@/lib/utils';

// Diesel Dynamix mark from the approved Figma logo file: a "D" with a pass
// checkmark and three speed lines for the mobile service. 64-unit grid.
const D_PATH =
  'M18 8H36C42.3652 8 48.4697 10.5286 52.9706 15.0294C57.4714 19.5303 60 25.6348 60 32C60 38.3652 57.4714 44.4697 52.9706 48.9706C48.4697 53.4714 42.3652 56 36 56H18V8ZM28 18H36C39.713 18 43.274 19.475 45.8995 22.1005C48.525 24.726 50 28.287 50 32C50 35.713 48.525 39.274 45.8995 41.8995C43.274 44.525 39.713 46 36 46H28V18Z';
const LINES_PATH = 'M12 16H2a2 2 0 0 0 0 4h10a2 2 0 0 0 0-4ZM12 30H6a2 2 0 0 0 0 4h6a2 2 0 0 0 0-4ZM12 44h-2a2 2 0 0 0 0 4h2a2 2 0 0 0 0-4Z';

const TONES = {
  dark: { lines: '#4C8DFF', d: '#4C8DFF', check: '#22C55E' }, // blue D, green pass check, on black
  light: { lines: '#1F5FE0', d: '#0B0F14', check: '#16A34A' }, // black D, on white / off-white
  mono: { lines: 'currentColor', d: 'currentColor', check: 'currentColor' }, // one color, e.g. white on blue
} as const;

export function LogoMark({
  className,
  tone = 'dark',
  title,
}: {
  className?: string;
  tone?: keyof typeof TONES;
  title?: string;
}) {
  const c = TONES[tone];
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d={LINES_PATH} fill={c.lines} />
      <path fillRule="evenodd" clipRule="evenodd" d={D_PATH} fill={c.d} />
      <path d="M30.5 32.5 36 38l9-13" stroke={c.check} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({
  className,
  variant = 'horizontal',
  onDark = true,
  tagline = true,
}: {
  className?: string;
  variant?: 'horizontal' | 'stacked';
  onDark?: boolean;
  tagline?: boolean;
}) {
  const name = (
    <span className="block whitespace-nowrap font-display font-extrabold uppercase leading-[0.9] tracking-[0.01em]">
      <span className={onDark ? 'text-offwhite' : 'text-ink'}>Diesel</span> <span className={onDark ? 'text-accent' : 'text-accent-ink'}>Dynamix</span>
    </span>
  );
  const tag = tagline ? (
    <span className={cn('mt-1 block whitespace-nowrap font-sans font-semibold uppercase tracking-[0.28em]', onDark ? 'text-muted-dark' : 'text-muted')}>
      Mobile Clean Truck Check
    </span>
  ) : null;

  if (variant === 'stacked') {
    return (
      <span className={cn('inline-flex flex-col items-center text-center', className)}>
        <LogoMark tone={onDark ? 'dark' : 'light'} className="h-16 w-16" />
        <span className="mt-3 text-4xl">{name}</span>
        <span className="text-[0.6rem]">{tag}</span>
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark tone={onDark ? 'dark' : 'light'} className="h-10 w-10 shrink-0" />
      <span className="flex flex-col">
        <span className="text-[1.6rem]">{name}</span>
        <span className="text-[0.5rem]">{tag}</span>
      </span>
    </span>
  );
}
