import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AdminPanel } from '@/components/admin-panel';
import { CartPanel } from '@/components/cart';

export const metadata: Metadata = {
  title: 'Panel de Administración Editorial',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-20 pb-16">
        <AdminPanel />
      </main>
      <Footer />
      <CartPanel />
    </div>
  );
}
