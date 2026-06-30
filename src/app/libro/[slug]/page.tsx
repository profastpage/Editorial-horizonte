// ============================================================================
//  EDITORIAL HORIZONTE — Ficha de libro
//  URL: /libro/[slug]
// ============================================================================
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookCover } from '@/components/book-cover'
import { BookDetailClient } from '@/components/catalog/book-detail-client'
import { CartDrawer } from '@/components/checkout/cart-drawer'
import { AdminSheetClient } from '@/components/admin/admin-sheet-client'
import { getBooks, getAdminMetrics } from '@/lib/queries'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const books = await getBooks().catch(() => [])
  const book = books.find((b) => b.slug === slug)
  if (!book) return { title: 'Libro no encontrado — Editorial Horizonte' }
  return {
    title: `${book.title} — Editorial Horizonte`,
    description: book.synopsis ?? `Ficha del libro ${book.title}`,
    alternates: { canonical: `/libro/${book.slug}` },
    openGraph: {
      title: book.title,
      description: book.synopsis ?? '',
      type: 'book',
    },
  }
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params
  const [books, adminMetrics] = await Promise.all([
    getBooks().catch(() => []),
    getAdminMetrics().catch(() => null),
  ])
  const book = books.find((b) => b.slug === slug)

  if (!book) notFound()

  const authorName = book.authors?.[0]?.fullName
  const totalStock = (book.inventory ?? []).reduce((s, i) => s + i.stockAvailable, 0)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/catalogo">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al catálogo
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Portada */}
            <div className="lg:col-span-2 flex justify-center lg:justify-start">
              <div className="relative">
                <BookCover
                  title={book.title}
                  authorName={authorName}
                  coverColor={book.metaTitle || '#7c2d12'}
                  size="xl"
                />
                {/* Badges flotantes */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {book.isNew && (
                    <Badge className="bg-primary text-primary-foreground text-[10px] uppercase tracking-editorial">
                      Nuevo
                    </Badge>
                  )}
                  {book.originType === 'own' && (
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm border-primary/40 text-primary text-[9px] uppercase tracking-editorial">
                      Fondo editorial
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Detalle */}
            <div className="lg:col-span-3 flex flex-col">
              {authorName && (
                <div className="text-xs uppercase tracking-editorial text-muted-foreground mb-2">
                  {authorName}
                </div>
              )}
              <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight text-balance">
                {book.title}
              </h1>

              <div className="text-sm text-muted-foreground mt-3 flex flex-wrap items-center gap-2">
                {book.publisher && <span>{book.publisher.name}</span>}
                {book.publicationDate && (
                  <>
                    <span className="text-border">·</span>
                    <span>{formatDate(book.publicationDate, { year: 'numeric', month: 'long' })}</span>
                  </>
                )}
                {book.pages && (
                  <>
                    <span className="text-border">·</span>
                    <span>{book.pages} págs.</span>
                  </>
                )}
              </div>

              {/* Sinopsis */}
              {book.synopsis && (
                <div className="mt-8">
                  <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Sinopsis
                  </h2>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                    {book.synopsis}
                  </p>
                </div>
              )}

              {/* Categorías */}
              {book.categories && book.categories.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {book.categories.map((c) => (
                    <Badge key={c.id} variant="secondary" className="text-xs">
                      {c.name}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator className="my-8" />

              {/* Ficha técnica */}
              <div>
                <h2 className="font-serif text-xl font-semibold mb-4">Ficha técnica</h2>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {book.isbn && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">ISBN</dt>
                      <dd className="font-mono text-xs mt-1">{book.isbn}</dd>
                    </div>
                  )}
                  {book.edition && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">Edición</dt>
                      <dd className="mt-1">{book.edition}</dd>
                    </div>
                  )}
                  {book.language && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">Idioma</dt>
                      <dd className="mt-1">{book.language}</dd>
                    </div>
                  )}
                  {book.format && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">Formato</dt>
                      <dd className="mt-1 capitalize">{book.format === 'physical' ? 'Físico' : book.format}</dd>
                    </div>
                  )}
                  {book.dimensions && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">Dimensiones</dt>
                      <dd className="mt-1">{book.dimensions}</dd>
                    </div>
                  )}
                  {book.weightGrams && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">Peso</dt>
                      <dd className="mt-1">{book.weightGrams} g</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Cliente interactivo: selector de almacén + add to cart */}
          <div className="mt-12">
            <BookDetailClient book={book} />
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <AdminSheetClient metrics={adminMetrics} />
    </div>
  )
}
