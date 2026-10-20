import { BookingProvider } from '@/components/booking-context';
import { Analytics, RevealObserver } from '@/components/client-effects';
import { StickyMobileBar, WhatsAppFab } from '@/components/contact-bars';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { JsonLd, organizationSchema } from '@/components/seo';
import { SubscribePopup } from '@/components/subscribe-popup';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <JsonLd data={organizationSchema()} />
      <Header />
      <main id="main" className="on-light">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
      <StickyMobileBar />
      <SubscribePopup />
      <RevealObserver />
      <Analytics />
    </BookingProvider>
  );
}
