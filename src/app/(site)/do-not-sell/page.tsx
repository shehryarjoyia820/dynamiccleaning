import Link from 'next/link';
import { PageHero } from '@/components/blocks';
import { CookieSettingsButton } from '@/components/cookie-settings-button';
import { PageBody } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';
import { LINKS, SITE } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Your Privacy Choices: Do Not Sell or Share My Personal Information',
  description: 'How California residents can opt out of the sale or sharing of personal information with Diesel Dynamix, including Global Privacy Control.',
  path: '/do-not-sell',
});

export default function DoNotSellPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Do Not Sell or Share My Personal Information"
        intro="Your privacy choices under the California Consumer Privacy Act (CCPA/CPRA)."
        crumbs={[{ name: 'Your Privacy Choices', path: '/do-not-sell' }]}
      >
        <span />
      </PageHero>
      <PageBody aside={<span />}>
        <h2>We do not sell your information</h2>
        <p>
          {SITE.name} does not sell personal information for money. If you allow advertising cookies, Google may use cookie data to personalise ads, which California law can treat
          as “sharing” for cross-context behavioral advertising.
        </p>
        <h2>How to opt out</h2>
        <ul>
          <li><strong>On this website:</strong> open Cookie settings and choose “Reject non-essential”. We will only allow non-personalised ads and no analytics.</li>
          <li><strong>Automatically:</strong> turn on Global Privacy Control (GPC) in your browser. We treat it as an opt-out.</li>
          <li>
            <strong>By email or phone:</strong> contact <a href={LINKS.mailService}>{SITE.emailService}</a> or <a href={LINKS.tel}>{SITE.phoneDisplay}</a> and ask us to opt you
            out. We will also remove you from marketing emails if you ask.
          </li>
        </ul>
        <div className="not-prose mt-6">
          <CookieSettingsButton className="btn-primary" label="Open cookie settings" />
        </div>
        <p>
          Read the full <Link href="/privacy">Privacy Policy</Link> and <Link href="/cookies">Cookie Policy</Link>.
        </p>
      </PageBody>
    </>
  );
}
