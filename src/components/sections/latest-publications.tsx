// ============================================================================
//  ÚLTIMAS PUBLICACIONES — Editorial Horizonte
//  Grid 3 columnas (desktop) / 2 (tablet) / 1 (mobile)
//  Tarjetas deluxe con hover lift 12px + scale 1.03 + overlay género/año
// ============================================================================
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookCover } from '@/components/book-cover'
import { formatPrice } from '@/lib/utils'
import type { BookWithRelations } from '@/lib/types'

interface LatestPublicationsProps {
  books: BookWithRelations[]
}

export function LatestPublications({ books }: LatestPublicationsProps) {
  // Tomar 6 libros: priorizar nuevos, luego destacados
  const latest = books
    .slice()
    .sort((a, b) => Number(b.isNew) - Number(a.isNew) || Number(b.isFeatured) - Number(a.isFeatured))
    .slice(0, 6)

  if (latest.length === 0) return null

  return (
    <section className="relative py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #f8f5f0 0%, #faf8f4 50%, #f8f5f0 100%)' }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className="h-px w-12" style={{ background: '#BFA076' }} />
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Catálogo · {books.length} títulos
            </span>
            <span className="h-px w-12" style={{ background: '#BFA076' }} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="font-serif font-semibold tracking-tight text-balance"
            style={{
              fontFamily: 'var(--font-fraunces), Georgia, serif',
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              color: '#2C2C2C',
              letterSpacing: '-0.02em',
            }}
          >
            Últimas <span className="italic" style={{ color: '#C05A42' }}>publicaciones</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 text-base text-muted-foreground max-w-xl mx-auto leading-[1.7]"
          >
            Una selección de nuestro fondo editorial propio y de terceras editoriales
            que distribuimos en librerías aliadas.
          </motion.p>
        </div>

        {/* Grid de libros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {latest.map((book, idx) => {
            const authorName = book.authors?.[0]?.fullName
            const totalStock = (book.inventory ?? []).reduce((s, i) => s + i.stockAvailable, 0)
            const year = book.publicationDate
              ? new Date(book.publicationDate).getFullYear()
              : null
            const genre = book.categories?.[0]?.name ?? 'Literatura'

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.1,
                  ease: [0.175, 0.885, 0.32, 1.275],
                }}
              >
                <Link href={`/libro/${book.slug}`} className="block group">
                  <div
                    className="relative overflow-hidden bg-white border border-primary/8"
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px -8px rgba(0,0,0,0.08)',
                    }}
                  >
                    {/* Portada — 80% del espacio */}
                    <div className="relative p-6 pb-4">
                      <motion.div
                        whileHover={{
                          y: -12,
                          scale: 1.03,
                          transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] },
                        }}
                        className="relative"
                        style={{ boxShadow: '0 20px 40px -12px rgba(0,0,0,0.3)' }}
                      >
                        <BookCover
                          title={book.title}
                          authorName={authorName}
                          coverColor={book.metaTitle || '#7c2d12'}
                          size="lg"
                          className="w-full h-auto aspect-[2/3]"
                        />

                        {/* Overlay hover con género/año */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-6 rounded-sm">
                          <div className="text-center text-white">
                            <div className="text-[10px] uppercase tracking-[0.15em] opacity-90">
                              {genre}
                            </div>
                            {year && (
                              <div className="text-xs opacity-80 mt-1">{year}</div>
                            )}
                          </div>
                        </div>

                        {/* Badge "Nuevo" */}
                        {book.isNew && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.1em] font-semibold text-white shadow-md" style={{ background: '#C05A42' }}>
                            Nuevo
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Info: título + autor */}
                    <div className="px-6 pb-6 pt-2 text-center">
                      {authorName && (
                        <div className="text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground mb-1.5">
                          {authorName}
                        </div>
                      )}
                      <h3
                        className="font-serif font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors"
                        style={{
                          fontFamily: 'var(--font-fraunces), Georgia, serif',
                          fontSize: '1.2rem',
                          color: '#1A1A1A',
                        }}
                      >
                        {book.title}
                      </h3>
                      <div className="mt-3 flex items-center justify-center gap-3">
                        <span className="font-serif font-semibold text-base" style={{ color: '#C05A42' }}>
                          {formatPrice(book.pricePen, 'PEN')}
                        </span>
                        {totalStock > 0 ? (
                          <span className="text-[10px] text-emerald-700">
                            {totalStock} en stock
                          </span>
                        ) : (
                          <span className="text-[10px] text-destructive">Agotado</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* CTA ver todo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Link href="/catalogo">
            <Button
              size="lg"
              variant="outline"
              className="btn-pill h-14 px-9 text-base font-medium border-primary/30 bg-white hover:bg-card"
            >
              Ver todo el catálogo
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
