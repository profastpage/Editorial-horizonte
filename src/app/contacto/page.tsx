// ============================================================================
//  EDITORIAL HORIZONTE — Contacto
//  URL: /contacto
//  Página estática (prerenderizada en build) para navegación instantánea
// ============================================================================
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Contact } from '@/components/sections/contact'
import { CartDrawer } from '@/components/checkout/cart-drawer'
import { AdminSheetClient } from '@/components/admin/admin-sheet-client'
import { getAdminMetrics } from '@/lib/queries'

// Estática: se prerenderea en build time → navegación instantánea
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Contacto — Editorial Horizonte',
  description: '¿Tienes un manuscrito o una consulta editorial? Escríbenos. Recibimos propuestas todo el año.',
  alternates: { canonical: '/contacto' },
}

export default async function ContactoPage() {
  const adminMetrics = await getAdminMetrics().catch(() => null)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <AdminSheetClient metrics={adminMetrics} />
    </div>
  )
}
