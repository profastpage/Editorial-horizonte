// ============================================================================
//  EDITORIAL HORIZONTE — Catálogo completo
//  URL: /catalogo
// ============================================================================
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CatalogSection } from '@/components/sections/catalog'
import { CartDrawer } from '@/components/checkout/cart-drawer'
import { AdminSheetClient } from '@/components/admin/admin-sheet-client'
import { getBooks, getCategories, getAdminMetrics } from '@/lib/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Catálogo — Editorial Horizonte',
  description: 'Explora nuestro fondo editorial propio y la selección de terceras editoriales que distribuimos. Filtra por origen, categoría o búsqueda libre.',
  alternates: { canonical: '/catalogo' },
}

export default async function CatalogoPage() {
  const [books, categories, adminMetrics] = await Promise.all([
    getBooks().catch(() => []),
    getCategories().catch(() => []),
    getAdminMetrics().catch(() => null),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <CatalogSection books={books} categories={categories} />
      </main>
      <Footer />
      <CartDrawer />
      <AdminSheetClient metrics={adminMetrics} />
    </div>
  )
}
