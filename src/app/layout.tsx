import type { Metadata, Viewport } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import { SITE } from '@/lib/site';
import './globals.css';

// next/font downloads these at build time and serves them from our own domain.
const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});
// Brand type (Figma): Barlow Condensed ExtraBold for headings, Barlow for body and UI.
const body = Barlow({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Clean Truck Check California | Mobile CARB Testing | Diesel Dynamix',
    template: '%s | Diesel Dynamix',
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
  // Google Search Console ownership check for dieseldynamix.com.
  verification: { google: 'UKZDM6bQPORKowgeNLDj3_Q0b8y5y7lz-CfLFNZEN9M' },
  // Lets Google AdSense verify site ownership.
  ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT ? { other: { 'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT } } : {}),
};

export const viewport: Viewport = {
  themeColor: '#0B0F14',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script adds the `js` class before React hydrates.
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks the page as JS-capable before paint so scroll reveals never flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
