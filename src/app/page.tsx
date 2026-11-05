import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero';
import { HomeRows } from '@/components/home-rows';
import { FeaturesSection } from '@/components/features-section';
import { AboutSection } from '@/components/about';
import { ContactSection } from '@/components/contact-section';
import { NewsletterCta } from '@/components/newsletter-cta';
import { Footer } from '@/components/footer';
import { CartPanel } from '@/components/cart';
import { CheckoutDialog } from '@/components/checkout';
import { getAllBooks } from '@/lib/books';

export default function Home() {
  const books = getAllBooks();
  const novedades = books.filter((b) => b.isNew);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HomeRows novedades={novedades} />
        <FeaturesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <NewsletterCta />
      <Footer />
      <CartPanel />
      <CheckoutDialog />
    </div>
  );
}
