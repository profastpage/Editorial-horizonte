// ============================================================================
//  EDITORIAL HORIZONTE — Homepage
//  URL: /
//  Hero carrusel de portadas + Últimas publicaciones + CTA
// ============================================================================

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroCarrusel } from '@/components/sections/hero-carrusel'
import { LatestPublications } from '@/components/sections/latest-publications'
import { CartDrawer } from '@/components/checkout/cart-drawer'
import { AdminSheetClient } from '@/components/admin/admin-sheet-client'
import { getBooks, getAdminMetrics } from '@/lib/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const [books, adminMetrics] = await Promise.all([
    getBooks().catch(() => []),
    getAdminMetrics().catch(() => null),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <HeroCarrusel books={books} />
        <LatestPublications books={books} />
      </main>

      <Footer />
      <CartDrawer />
      <AdminSheetClient metrics={adminMetrics} />
    </div>
  )
}
