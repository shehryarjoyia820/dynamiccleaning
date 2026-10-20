import Link from 'next/link';
import { ContactButtons, HeroTexture } from '@/components/blocks';
import { BookingProvider } from '@/components/booking-context';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function NotFound() {
  return (
    <BookingProvider>
      <Header />
      <main id="main">
        <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-charcoal pt-28 text-white">
          <HeroTexture />
          <div className="container relative py-16">
            <p className="eyebrow text-orange">Error 404</p>
            <h1 className="mt-3 text-display-xl">Wrong turn</h1>
            <p className="mt-4 max-w-xl text-lg text-white/80">
              That page does not exist. Head back{' '}
              <Link href="/" className="font-semibold text-orange underline underline-offset-4">
                home
              </Link>
              , or get in touch and we will help.
            </p>
            <div className="mt-8">
              <ContactButtons />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </BookingProvider>
  );
}
