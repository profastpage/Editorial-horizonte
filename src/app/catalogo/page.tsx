import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { CatalogSection } from '@/components/catalog';
import { Footer } from '@/components/footer';
import { CartPanel } from '@/components/cart';
import { CheckoutDialog } from '@/components/checkout';

export const metadata: Metadata = {
  title: 'Catálogo Oficial de Libros | Editorial Horizonte',
  description:
    'Catálogo completo de obras de José María Arguedas, César Vallejo, literatura peruana, historia, poesía y ciencias sociales.',
};

export default function CatalogoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-20 pb-16">
        <CatalogSection isSubpage={true} />
      </main>
      <Footer />
      <CartPanel />
      <CheckoutDialog />
    </div>
  );
}
