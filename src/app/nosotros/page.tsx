// ============================================================================
//  EDITORIAL HORIZONTE — Sobre nosotros
//  URL: /nosotros
// ============================================================================
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { About } from '@/components/sections/about'
import { CartDrawer } from '@/components/checkout/cart-drawer'
import { AdminSheetClient } from '@/components/admin/admin-sheet-client'
import { getAdminMetrics } from '@/lib/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Nosotros — Editorial Horizonte',
  description: 'Una editorial que escucha a la literatura latinoamericana. Conoce nuestra historia, misión y valores desde 2019.',
  alternates: { canonical: '/nosotros' },
}

export default async function NosotrosPage() {
  const adminMetrics = await getAdminMetrics().catch(() => null)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <About />
      </main>
      <Footer />
      <CartDrawer />
      <AdminSheetClient metrics={adminMetrics} />
    </div>
  )
}
