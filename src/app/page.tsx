// ============================================================================
//  EDITORIAL HORIZONTE — Homepage
//  URL: /
//  Hero con imagen de fondo deluxe + Últimas publicaciones
// ============================================================================

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/sections/hero'
import { LatestPublications } from '@/components/sections/latest-publications'
import { CartDrawer } from '@/components/checkout/cart-drawer'
import { AdminSheetClient } from '@/components/admin/admin-sheet-client'
import { getBooks, getAdminMetrics } from '@/lib/queries'

// Renderización del servidor — los datos se cargan aquí (SSR)
// ISR: revalida cada 60s para que el libro destacado se actualice
export const revalidate = 60

export default async function Home() {
  const [books, adminMetrics] = await Promise.all([
    getBooks().catch(() => []),
    getAdminMetrics().catch(() => null),
  ])

  const featuredBook = books.find((b) => b.isFeatured && b.isNew) ?? books.find((b) => b.isFeatured) ?? books[0]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <Hero featuredBook={featuredBook} />
        <LatestPublications books={books} />
      </main>

      <Footer />
      <CartDrawer />
      <AdminSheetClient metrics={adminMetrics} />
    </div>
  )
}
