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
import { AdminSheet } from '@/components/admin/admin-sheet'
import { AdminSheetClient } from '@/components/admin/admin-sheet-client'
import { getBooks, getCategories, getWarehouses, getAdminMetrics } from '@/lib/queries'

// Renderización del servidor — los datos se cargan aquí (SSR)
export default async function Home() {
  const [books, categories, warehouses, adminMetrics] = await Promise.all([
    getBooks(),
    getCategories(),
    getWarehouses(),
    getAdminMetrics(),
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
