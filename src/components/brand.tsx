/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils';

// Clean Truck Check logo (traced to vector from the approved artwork, Oct 2026).
// Files live in /public/brand: "-dark" versions use a lighter blue so they read on black,
// "-light" versions use the original navy for white / off-white backgrounds.
const ALT = 'Clean Truck Check by Diesel Dynamix';
// Bump when the logo files change: the file names stayed the same, so this stops browsers showing the old logo.
const V = '?v=2';

// Aspect ratios (width / height) of each file's viewBox, so the images never reflow.
const RATIO = { horizontal: 4232 / 778, stacked: 2809 / 1655, mark: 1313 / 787 } as const;

export function LogoMark({
  className,
  tone = 'dark',
  title,
}: {
  className?: string;
  tone?: 'dark' | 'light' | 'mono';
  title?: string;
}) {
  if (tone === 'mono') {
    // One color (inherits currentColor), e.g. white on blue.
    return (
      <span
        role={title ? 'img' : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
        className={cn('inline-block bg-current', className)}
        style={{ mask: 'url(/brand/mark-one-color.svg?v=2) center / contain no-repeat', WebkitMask: 'url(/brand/mark-one-color.svg?v=2) center / contain no-repeat' }}
      />
    );
  }
  return (
    <img
      src={tone === 'dark' ? `/brand/mark-on-dark.svg${V}` : `/brand/mark-on-light.svg${V}`}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      width={64}
      height={Math.round(64 / RATIO.mark)}
      className={cn('object-contain', className)}
    />
  );
}

export function Logo({
  className,
  variant = 'horizontal',
  onDark = true,
  compact = false,
  priority = false,
}: {
  className?: string;
  variant?: 'horizontal' | 'stacked';
  onDark?: boolean;
  /** Smaller on phones (header), full size from 640px. */
  compact?: boolean;
  /** Load straight away (above-the-fold header logo). */
  priority?: boolean;
}) {
  const tone = onDark ? 'dark' : 'light';
  if (variant === 'stacked') {
    return (
      <img
        src={`/brand/logo-stacked-${tone}.svg${V}`}
        alt={ALT}
        width={170}
        height={Math.round(170 / RATIO.stacked)}
        className={cn('h-24 w-auto', className)}
      />
    );
  }
  return (
    <img
      src={`/brand/logo-primary-${tone}.svg${V}`}
      alt={ALT}
      width={240}
      height={Math.round(240 / RATIO.horizontal)}
      fetchPriority={priority ? 'high' : undefined}
      className={cn('w-auto', compact ? 'h-8 sm:h-10 xl:h-11' : 'h-11', className)}
    />
  );
}
