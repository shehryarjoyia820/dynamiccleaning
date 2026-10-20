import Link from 'next/link';
import { PageHero } from '@/components/blocks';
import { CookieSettingsButton } from '@/components/cookie-settings-button';
import { PageBody } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';
import { LINKS, SITE } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Cookie Policy',
  description: 'Which cookies the Diesel Dynamix website uses for essential functions, analytics and Google advertising, and how to change your choices.',
  path: '/cookies',
});

const ROWS: [string, string, string, string][] = [
  ['Essential', 'dd-consent, dd-subscribe-popup (local storage)', 'Remembers your cookie choice and whether you closed the subscribe notice', 'Until you clear it'],
  ['Essential', 'sb-* (admin only)', 'Keeps staff signed in to the admin dashboard', 'Session / up to 1 week'],
  ['Security', 'Cloudflare Turnstile', 'Protects forms from bots and spam', 'Session'],
  ['Analytics (optional)', '_ga, _ga_*', 'Google Analytics: counts visits and how pages are used', 'Up to 2 years'],
  ['Advertising (optional)', '__gads, __gpi, IDE, NID and similar', 'Google AdSense: serves and measures ads, limits repeats; personalised only if you accept', 'Up to 13 months'],
];

export default function CookiesPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Cookie Policy" intro="Last updated October 20, 2026" crumbs={[{ name: 'Cookie Policy', path: '/cookies' }]}>
        <span />
      </PageHero>
      <PageBody aside={<span />}>
        <h2>What cookies are</h2>
        <p>
          Cookies and similar technologies (like local storage) are small files stored by your browser. We use them to make the site work, and, only with your consent, to measure
          usage and show personalised advertising.
        </p>

        <h2>Cookies we use</h2>
        <div className="not-prose mt-4 overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-card">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-charcoal text-white">
              <tr>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Purpose</th>
                <th scope="col" className="px-4 py-3">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {ROWS.map(([type, name, purpose, dur]) => (
                <tr key={name}>
                  <td className="px-4 py-3 font-semibold">{type}</td>
                  <td className="px-4 py-3 font-mono text-xs">{name}</td>
                  <td className="px-4 py-3">{purpose}</td>
                  <td className="px-4 py-3">{dur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Google advertising</h2>
        <p>
          Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalised advertising at{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>. See{' '}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses data from partner sites</a>.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>Use the button below to accept or reject optional cookies at any time.</li>
          <li>We honor the Global Privacy Control (GPC) browser signal as a rejection of optional cookies.</li>
          <li>You can also delete or block cookies in your browser settings; some features may stop working.</li>
        </ul>
        <div className="not-prose mt-6">
          <CookieSettingsButton className="btn-primary" />
        </div>

        <h2>More information</h2>
        <p>
          See our <Link href="/privacy">Privacy Policy</Link> and <Link href="/do-not-sell">Your Privacy Choices</Link>, or contact{' '}
          <a href={LINKS.mailService}>{SITE.emailService}</a>.
        </p>
      </PageBody>
    </>
  );
}
