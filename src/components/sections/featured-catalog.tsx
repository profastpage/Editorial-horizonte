// ============================================================================
//  FEATURED CATALOG — Sección de catálogo destacado en home
//  Muestra 8 libros y CTA a /catalogo
// ============================================================================
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookCard } from '@/components/catalog/book-card'
import type { BookWithRelations } from '@/lib/types'

interface FeaturedCatalogProps {
  books: BookWithRelations[]
}

export function FeaturedCatalog({ books }: FeaturedCatalogProps) {
  // Mostrar destacados primero, máximo 8
  const featured = books
    .slice()
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(b.isNew) - Number(a.isNew))
    .slice(0, 8)

  if (featured.length === 0) return null

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="editorial-rule" />
              <span className="text-xs uppercase tracking-editorial text-muted-foreground">
                Catálogo · {books.length} títulos
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-balance"
            >
              Cada libro, una <span className="italic text-primary">apuesta</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-5 text-base text-muted-foreground leading-relaxed"
            >
              Una selección de nuestro fondo editorial propio y de terceras editoriales
              que distribuimos en librerías aliadas.
            </motion.p>
          </div>

          <Link href="/catalogo">
            <Button variant="outline" size="lg" className="hidden md:inline-flex">
              Ver todo el catálogo
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {featured.map((book, idx) => (
            <BookCard key={book.id} book={book} index={idx} onOpen={() => {}} />
          ))}
        </div>

        {/* CTA móvil */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/catalogo">
            <Button variant="outline" size="lg">
              <BookOpen className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Ver todo el catálogo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
