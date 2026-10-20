import Link from 'next/link';
import { PageHero } from '@/components/blocks';
import { PageBody } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';
import { LINKS, SITE } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Privacy Policy',
  description:
    'How Diesel Dynamix collects, uses and protects personal information, including cookies, Google advertising, email marketing and your California privacy rights.',
  path: '/privacy',
});

const UPDATED = 'October 20, 2026';

// Template text: have it reviewed by the client's legal counsel before launch.
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" intro={`Last updated ${UPDATED}`} crumbs={[{ name: 'Privacy Policy', path: '/privacy' }]}>
        <span />
      </PageHero>
      <PageBody aside={<span />}>
        <h2>Who we are</h2>
        <p>
          {SITE.name} (“we”, “us”) provides mobile Clean Truck Check testing in Southern California. This policy explains what personal information we collect through our
          website and services, how we use it, and the choices you have. Questions: <a href={LINKS.mailService}>{SITE.emailService}</a> or{' '}
          <a href={LINKS.tel}>{SITE.phoneDisplay}</a>.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li><strong>Information you give us:</strong> name, company, phone, email, truck count, truck location, engine type, preferred date, and any notes or messages you send through our forms, by phone, WhatsApp or email.</li>
          <li><strong>Newsletter:</strong> your email address (and name, if given) when you subscribe.</li>
          <li><strong>Technical information:</strong> a one-way hashed version of your IP address to prevent spam and abuse, and basic device and browser data sent automatically by your browser.</li>
          <li><strong>Cookies and similar technologies:</strong> see <Link href="/cookies">our Cookie Policy</Link>.</li>
          <li><strong>Email engagement:</strong> our marketing emails may record whether an email was opened, so we can avoid sending unwanted follow-ups.</li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>To respond to requests, schedule and perform testing, and send confirmations and service messages.</li>
          <li>To send proposals, follow-ups and updates you may be interested in. Every marketing email has an unsubscribe link.</li>
          <li>To keep business, tax and service records.</li>
          <li>To protect our website and forms from spam, fraud and abuse.</li>
          <li>With your consent, to understand how our website is used (analytics) and to show advertising.</li>
        </ul>

        <h2>Advertising and Google</h2>
        <p>
          Our website may show ads served by Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or
          other websites. Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the internet.
        </p>
        <ul>
          <li>
            You can opt out of personalised advertising by visiting{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>, or opt out of some third-party vendors’ use of cookies at{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>.
          </li>
          <li>
            Learn how Google uses information from sites that use its services:{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses data</a>.
          </li>
          <li>If you click “Reject non-essential” in our cookie notice, or your browser sends a Global Privacy Control signal, we only allow non-personalised ads.</li>
        </ul>

        <h2>Analytics</h2>
        <p>
          With your consent we use Google Analytics to measure how visitors use the site, such as pages visited and device type. You can withdraw consent at any time in{' '}
          <Link href="/cookies">Cookie settings</Link>, or install the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out add-on</a>.
        </p>

        <h2>Who we share information with</h2>
        <p>
          Service providers that help us run our business, under contracts that limit their use of your information: website hosting (Vercel), database and login (Supabase), email
          delivery, spam protection (Cloudflare), analytics and advertising (Google). We may also disclose information when required by law or to protect our rights.
        </p>
        <p>
          <strong>We do not sell your personal information for money.</strong> Allowing advertising cookies may count as “sharing” for cross-context behavioral advertising under
          California law. You can opt out at any time; see <Link href="/do-not-sell">Your Privacy Choices</Link>.
        </p>

        <h2>Your California privacy rights (CCPA / CPRA)</h2>
        <p>If you are a California resident, you have the right to:</p>
        <ul>
          <li>Know what personal information we collect, use and disclose, and request a copy.</li>
          <li>Request deletion or correction of your personal information.</li>
          <li>Opt out of the sale or sharing of your personal information, including by using a Global Privacy Control signal, which we honor.</li>
          <li>Limit the use of sensitive personal information (we do not collect any).</li>
          <li>Not be discriminated against for exercising these rights.</li>
        </ul>
        <p>
          To make a request, email <a href={LINKS.mailService}>{SITE.emailService}</a> or call <a href={LINKS.tel}>{SITE.phoneDisplay}</a>. We will verify your request using the
          contact details we hold and respond within 45 days. You may use an authorized agent.
        </p>

        <h2>Email marketing</h2>
        <p>
          We send proposals, follow-ups and updates in line with the U.S. CAN-SPAM Act. Each message identifies us, includes our postal address and a working unsubscribe link, and we
          honor unsubscribe requests promptly.
        </p>

        <h2>Children</h2>
        <p>Our services are for businesses and vehicle owners. We do not knowingly collect information from children under 13.</p>

        <h2>Data retention and security</h2>
        <p>
          We keep lead and customer records only as long as needed for the purposes above and for legal and accounting requirements. Data is encrypted in transit, and access to our
          admin system is limited to authorized staff.
        </p>

        <h2>Changes to this policy</h2>
        <p>We may update this policy from time to time. The “Last updated” date shows the latest version.</p>

        <h2>Contact</h2>
        <p>
          {SITE.name} · <a href={LINKS.mailService}>{SITE.emailService}</a> · <a href={LINKS.tel}>{SITE.phoneDisplay}</a>
        </p>
      </PageBody>
    </>
  );
}
