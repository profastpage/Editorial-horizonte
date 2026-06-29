// ============================================================================
//  EDITORIAL HORIZONTE — Página principal (single-page con scroll-spy)
//  Secciones: inicio · catalogo · nosotros · aliados · contacto
//  + Cart drawer + Checkout dialog + Admin sheet
// ============================================================================

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Allies } from '@/components/sections/allies'
import { Contact } from '@/components/sections/contact'
import { CatalogSection } from '@/components/sections/catalog'
import { CartDrawer } from '@/components/checkout/cart-drawer'
import { AdminSheetClient } from '@/components/admin/admin-sheet-client'
import { getBooks, getCategories, getWarehouses, getAdminMetrics } from '@/lib/queries'

// SSR dinámico — NO prerenderear en build time.
// Esto evita que el build en Vercel intente acceder a la DB antes de tener
// DATABASE_URL configurada. La página se renderiza en cada request.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  // Carga con fallback: si la DB no está configurada, la app renderiza con
  // datos vacíos en lugar de crashear.
  const [books, categories, warehouses, adminMetrics] = await Promise.all([
    getBooks().catch(() => []),
    getCategories().catch(() => []),
    getWarehouses().catch(() => []),
    getAdminMetrics().catch(() => null),
  ])

  const featuredBook = books.find((b) => b.isFeatured && b.isNew) ?? books.find((b) => b.isFeatured) ?? books[0]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <Hero featuredBook={featuredBook} />
        <CatalogSection books={books} categories={categories} />
        <About />
        <Allies warehouses={warehouses} />
        <Contact />
      </main>

      <Footer />

      {/* Overlays globales */}
      <CartDrawer />
      <AdminSheetClient metrics={adminMetrics} />
    </div>
  )
}
