import type { Metadata } from 'next';
import { Logo, LogoMark } from '@/components/brand';
import { PageHero } from '@/components/blocks';

export const metadata: Metadata = {
  title: 'Brand Guide',
  robots: { index: false, follow: false },
};

const COLORS = [
  { name: 'Charcoal', role: 'Primary dark', hex: '#16181D', rgb: '22, 24, 29', cmyk: '24, 17, 0, 89' },
  { name: 'Steel gray', role: 'Secondary dark', hex: '#2A2E36', rgb: '42, 46, 54', cmyk: '22, 15, 0, 79' },
  { name: 'Off-white', role: 'Light background', hex: '#F5F6F8', rgb: '245, 246, 248', cmyk: '1, 1, 0, 3' },
  { name: 'Near black', role: 'Text on light', hex: '#111318', rgb: '17, 19, 24', cmyk: '29, 21, 0, 91' },
  { name: 'Safety orange', role: 'Accent', hex: '#FF6B1A', rgb: '255, 107, 26', cmyk: '0, 58, 90, 0' },
  { name: 'Deep orange', role: 'Accent hover', hex: '#E2550A', rgb: '226, 85, 10', cmyk: '0, 62, 96, 11' },
  { name: 'Orange ink', role: 'Orange text on light (AA)', hex: '#B8430A', rgb: '184, 67, 10', cmyk: '0, 64, 95, 28' },
  { name: 'Clean green', role: 'Pass / compliant', hex: '#1E9E5A', rgb: '30, 158, 90', cmyk: '81, 0, 43, 38' },
];

const FILES = [
  ['Icon (color)', '/brand/icon-color.svg'],
  ['Icon (white)', '/brand/icon-white.svg'],
  ['Icon (black)', '/brand/icon-black.svg'],
  ['Horizontal (dark backgrounds)', '/brand/logo-horizontal-color-dark-bg.svg'],
  ['Horizontal (light backgrounds)', '/brand/logo-horizontal-color-light-bg.svg'],
  ['Horizontal (white)', '/brand/logo-horizontal-white.svg'],
  ['Horizontal (black)', '/brand/logo-horizontal-black.svg'],
];

export default function BrandPage() {
  return (
    <>
      <PageHero eyebrow="Brand guide · draft" title="Diesel Dynamix brand" intro="Logo usage, colors and type for anyone producing Diesel Dynamix materials." crumbs={[{ name: 'Brand Guide', path: '/brand' }]}>
        <span />
      </PageHero>
      <section className="py-section">
        <div className="container grid gap-16">
          <div>
            <h2 className="text-display-md">The mark</h2>
            <p className="mt-3 max-w-prose text-muted">
              A clean-emissions gauge with its needle in the green zone, on a road line with motion streaks for our mobile service. It is drawn on a 64-unit grid with heavy strokes so it reads at 16 px and on a truck wrap.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="grid place-items-center rounded-xl bg-charcoal p-10"><Logo /></div>
              <div className="grid place-items-center rounded-xl bg-white p-10 shadow-card"><Logo onDark={false} /></div>
              <div className="grid place-items-center rounded-xl bg-charcoal p-10"><Logo variant="stacked" /></div>
              <div className="flex items-end justify-center gap-6 rounded-xl bg-white p-10 shadow-card">
                <LogoMark className="h-16 w-16" />
                <LogoMark className="h-8 w-8" />
                <LogoMark className="h-4 w-4" />
              </div>
              <div className="grid place-items-center rounded-xl bg-orange p-10"><LogoMark tone="black" className="h-20 w-20" /></div>
              <div className="grid place-items-center rounded-xl bg-steel p-10"><LogoMark tone="white" className="h-20 w-20" /></div>
            </div>
          </div>
          <div>
            <h2 className="text-display-md">Clear space and minimum size</h2>
            <ul className="prose-dd mt-3">
              <li>Keep clear space around the logo equal to the height of the gauge needle hub × 2 (about ¼ of the icon height).</li>
              <li>Minimum size: icon 16 px / 5 mm; horizontal logo 120 px / 30 mm wide.</li>
              <li>Do not stretch, recolor, rotate, add effects or place the full-color logo on busy photos. Use the white version on dark images.</li>
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
                <p className="text-sm text-muted">Headings</p>
                <p className="font-display text-5xl font-extrabold uppercase">Barlow Condensed</p>
                <p className="mt-2 text-muted">Weights 600, 700, 800. Uppercase for headings and buttons.</p>
              </div>
              <div className="card">
                <p className="text-sm text-muted">Body</p>
                <p className="text-4xl font-semibold">Inter</p>
                <p className="mt-2 text-muted">16–18 px on mobile. Regular for body, semibold for emphasis.</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-display-md">Files</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {FILES.map(([label, href]) => (
                <li key={href}>
                  <a href={href} download className="flex items-center justify-between rounded-lg border border-ink/10 bg-white px-4 py-3 font-semibold hover:border-orange-ink">
                    {label} <span className="text-sm text-muted">SVG</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
