// ============================================================================
//  EDITORIAL HORIZONTE — Homepage
//  URL: /
//  Hero + catálogo destacado + CTA a subpáginas
// ============================================================================

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/sections/hero'
import { FeaturedCatalog } from '@/components/sections/featured-catalog'
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

  const featuredBook = books.find((b) => b.isFeatured && b.isNew) ?? books.find((b) => b.isFeatured) ?? books[0]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <Hero featuredBook={featuredBook} />
        <FeaturedCatalog books={books} />
      </main>

      <Footer />
      <CartDrawer />
      <AdminSheetClient metrics={adminMetrics} />
    </div>
  )
}
