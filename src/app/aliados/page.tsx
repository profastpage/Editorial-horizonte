// ============================================================================
//  EDITORIAL HORIZONTE — Librerías aliadas
//  URL: /aliados
// ============================================================================
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Allies } from '@/components/sections/allies'
import { CartDrawer } from '@/components/checkout/cart-drawer'
import { AdminSheetClient } from '@/components/admin/admin-sheet-client'
import { getWarehouses, getAdminMetrics } from '@/lib/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Aliados — Editorial Horizonte',
  description: 'Encuéntranos en las mejores librerías de Lima. Nuestros títulos están disponibles en consignación en librerías independientes como SUR, El Virrey y Crisol.',
  alternates: { canonical: '/aliados' },
}

export default async function AliadosPage() {
  const [warehouses, adminMetrics] = await Promise.all([
    getWarehouses().catch(() => []),
    getAdminMetrics().catch(() => null),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <Allies warehouses={warehouses} />
      </main>
      <Footer />
      <CartDrawer />
      <AdminSheetClient metrics={adminMetrics} />
    </div>
  )
}
