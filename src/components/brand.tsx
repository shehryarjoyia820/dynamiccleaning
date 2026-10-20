import { cn } from '@/lib/utils';

/**
 * Diesel Dynamix mark: a clean-emissions gauge reading in the green zone,
 * set on a road line with motion streaks for the mobile service.
 * Built on a 64-unit grid so it stays legible at 16 px.
 */
export function LogoMark({
  className,
  tone = 'color',
  title,
}: {
  className?: string;
  tone?: 'color' | 'white' | 'black';
  title?: string;
}) {
  const bg = tone === 'color' ? '#16181D' : 'none';
  const arc = tone === 'color' ? '#FF6B1A' : tone === 'white' ? '#FFFFFF' : '#111318';
  const needle = tone === 'black' ? '#111318' : '#FFFFFF';
  const zone = tone === 'color' ? '#1E9E5A' : arc;
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      {tone === 'color' ? <rect width="64" height="64" rx="14" fill={bg} /> : null}
      <path d="M13 40a21 21 0 0 1 42 0" fill="none" stroke={arc} strokeWidth="6.5" strokeLinecap="round" />
      <path d="M48.9 25.2a21 21 0 0 1 6.1 14.8" fill="none" stroke={zone} strokeWidth="6.5" strokeLinecap="round" />
      <path d="M34 40 46.5 25" stroke={needle} strokeWidth="5" strokeLinecap="round" />
      <circle cx="34" cy="40" r="5.5" fill={needle} />
      <path d="M13 51h42" stroke={arc} strokeWidth="4" strokeLinecap="round" opacity={tone === 'color' ? 0.9 : 1} />
      <path d="M5 30h5M3 38h5" stroke={arc} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className,
  variant = 'horizontal',
  onDark = true,
}: {
  className?: string;
  variant?: 'horizontal' | 'stacked';
  onDark?: boolean;
}) {
  const word = (
    <span className={cn('font-display font-extrabold uppercase leading-none tracking-wide', variant === 'stacked' ? 'text-center' : '')}>
      <span className={onDark ? 'text-white' : 'text-ink'}>Diesel</span>{' '}
      <span className={onDark ? 'text-orange' : 'text-orange-ink'}>Dynamix</span>
    </span>
  );
  if (variant === 'stacked') {
    return (
      <span className={cn('inline-flex flex-col items-center gap-2', className)}>
        <LogoMark className="h-14 w-14" />
        <span className="text-2xl">{word}</span>
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="whitespace-nowrap text-[1.45rem]">{word}</span>
    </span>
  );
}
