import type { Metadata } from 'next';
import { Logo, LogoMark } from '@/components/brand';
import { PageHero } from '@/components/blocks';

export const metadata: Metadata = {
  title: 'Brand Guide',
  robots: { index: false, follow: false },
};

// Values from the approved Figma logo file ("Colors & type").
const COLORS = [
  { name: 'Charcoal', role: 'Primary dark: header, hero, footer', hex: '#16181D', rgb: '22, 24, 29', cmyk: '24, 17, 0, 89' },
  { name: 'Amber', role: 'Accent: buttons, icons, highlights', hex: '#F5A524', rgb: '245, 165, 36', cmyk: '0, 33, 85, 4' },
  { name: 'Amber deep', role: 'Logo accent on light backgrounds', hex: '#B86E00', rgb: '184, 110, 0', cmyk: '0, 40, 100, 28' },
  { name: 'Amber ink', role: 'Small amber text on light (WCAG AA)', hex: '#8F5600', rgb: '143, 86, 0', cmyk: '0, 40, 100, 44' },
  { name: 'Off-white', role: 'Light backgrounds, text on dark', hex: '#F4F4F2', rgb: '244, 244, 242', cmyk: '0, 0, 1, 4' },
  { name: 'Muted on dark', role: 'Secondary text on charcoal', hex: '#9AA0AA', rgb: '154, 160, 170', cmyk: '9, 6, 0, 33' },
  { name: 'Steel', role: 'Cards and panels on dark', hex: '#2A2E36', rgb: '42, 46, 54', cmyk: '22, 15, 0, 79' },
  { name: 'Clean green', role: 'Pass / compliant states', hex: '#1E9E5A', rgb: '30, 158, 90', cmyk: '81, 0, 43, 38' },
];

const FILES = [
  ['Primary logo, for dark backgrounds', '/brand/logo-primary-dark.svg'],
  ['Primary logo, for light backgrounds', '/brand/logo-primary-light.svg'],
  ['Stacked logo, for dark backgrounds', '/brand/logo-stacked-dark.svg'],
  ['Mark, on dark', '/brand/mark-on-dark.svg'],
  ['Mark, on light', '/brand/mark-on-light.svg'],
  ['Mark, one color (e.g. on amber)', '/brand/mark-one-color.svg'],
  ['App icon / favicon', '/brand/app-icon.svg'],
];

export default function BrandPage() {
  return (
    <>
      <PageHero eyebrow="Brand guide" title="Diesel Dynamix brand" intro="Logo usage, colors and type for anyone producing Diesel Dynamix materials." crumbs={[{ name: 'Brand Guide', path: '/brand' }]}>
        <span />
      </PageHero>
      <section className="py-section">
        <div className="container grid gap-16">
          <div>
            <h2 className="text-display-md">The logo</h2>
            <p className="mt-3 max-w-prose text-muted">
              A bold “D” holding a pass checkmark, with three speed lines for our mobile service. The wordmark is Barlow Condensed ExtraBold with the tagline “Mobile Clean Truck Check”.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="grid min-h-[12rem] place-items-center rounded-xl bg-charcoal p-10"><Logo /></div>
              <div className="grid min-h-[12rem] place-items-center rounded-xl bg-white p-10 shadow-card"><Logo onDark={false} /></div>
              <div className="grid min-h-[16rem] place-items-center rounded-xl bg-charcoal p-10"><Logo variant="stacked" /></div>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="grid place-items-center rounded-xl bg-charcoal p-6"><LogoMark className="h-16 w-16" /></div>
                <div className="grid place-items-center rounded-xl bg-white p-6 shadow-card"><LogoMark tone="light" className="h-16 w-16" /></div>
                <div className="grid place-items-center rounded-xl bg-amber p-6 text-charcoal"><LogoMark tone="mono" className="h-16 w-16" /></div>
                <div className="flex items-end justify-center gap-4 rounded-xl bg-charcoal p-6 sm:col-span-3">
                  <LogoMark className="h-12 w-12" />
                  <LogoMark className="h-8 w-8" />
                  <LogoMark className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-display-md">Usage</h2>
            <ul className="prose-dd mt-3">
              <li>Clear space around the logo: at least the width of the “D” stem on every side.</li>
              <li>Minimum size: mark 16 px / 5 mm; horizontal logo 140 px / 35 mm wide.</li>
              <li>Use the light version on white or off-white, and the one-color mark on amber.</li>
              <li>Do not stretch, recolor, rotate, add effects, or place the logo on busy photos without a dark overlay.</li>
              <li>Never combine the logo with the CARB or State of California seal. Diesel Dynamix is an independent company.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-display-md">Colors</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COLORS.map((c) => (
                <li key={c.hex} className="overflow-hidden rounded-xl bg-white shadow-card">
                  <div className="h-24 border-b border-ink/10" style={{ background: c.hex }} />
                  <div className="p-4 text-sm">
                    <p className="font-display text-xl font-bold uppercase">{c.name}</p>
                    <p className="text-muted">{c.role}</p>
                    <dl className="mt-2 grid grid-cols-[3.5rem_1fr] gap-y-0.5 font-mono text-xs">
                      <dt>HEX</dt><dd>{c.hex}</dd>
                      <dt>RGB</dt><dd>{c.rgb}</dd>
                      <dt>CMYK</dt><dd>{c.cmyk}</dd>
                    </dl>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">CMYK values are conversions for reference; confirm with a printed proof.</p>
          </div>
          <div>
            <h2 className="text-display-md">Typography</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="card">
                <p className="text-sm text-muted">Headings and wordmark</p>
                <p className="font-display text-5xl font-extrabold uppercase">Barlow Condensed</p>
                <p className="mt-2 text-muted">ExtraBold 800 for the logo, Bold 700 for headings and buttons. Uppercase.</p>
              </div>
              <div className="card">
                <p className="text-sm text-muted">Body, taglines and UI</p>
                <p className="text-4xl font-semibold">Barlow</p>
                <p className="mt-2 text-muted">Regular for body (16–18 px on mobile), SemiBold for taglines and labels.</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-display-md">Files</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {FILES.map(([label, href]) => (
                <li key={href}>
                  <a href={href} download className="flex items-center justify-between rounded-lg border border-ink/10 bg-white px-4 py-3 font-semibold hover:border-amber-ink">
                    {label} <span className="text-sm text-muted">SVG</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">Source: Diesel Dynamix Figma logo file.</p>
          </div>
        </div>
      </section>
    </>
  );
}
