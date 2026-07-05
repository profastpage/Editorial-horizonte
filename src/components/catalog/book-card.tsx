// ============================================================================
//  BOOK CARD ULTRA PRO — Tarjeta de libro premium
//  - Portada grande con sombra prominente
//  - Hover: lift 12px + scale 1.03 + overlay con género/año
//  - Título Playfair Display + autor Inter
//  - Precio destacado + indicador de stock
//  - Badges: Nuevo / Destacado / Fondo editorial
//  - Mobile-first 100% responsivo
// ============================================================================
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Star, MapPin } from 'lucide-react'
import { BookCover } from '@/components/book-cover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUI } from '@/lib/store'
import { formatPrice, cn } from '@/lib/utils'
import type { BookWithRelations } from '@/lib/types'

interface BookCardProps {
  book: BookWithRelations
  index?: number
  onOpen?: (book: BookWithRelations) => void
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  const { currency } = useUI()
  const price = currency === 'PEN' ? book.pricePen : book.priceUsd
  const totalStock = (book.inventory ?? []).reduce((s, i) => s + i.stockAvailable, 0)
  const authorName = book.authors?.[0]?.fullName
  const href = `/libro/${book.slug}`
  const year = book.publicationDate ? new Date(book.publicationDate).getFullYear() : null
  const genre = book.categories?.[0]?.name ?? 'Literatura'
  const warehousesWithStock = (book.inventory ?? []).filter((i) => i.stockAvailable > 0).length

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.175, 0.885, 0.32, 1.275],
      }}
      className="group relative flex flex-col h-full"
    >
      <Link href={href} className="block h-full">
        <div
          className="relative flex flex-col h-full bg-white border border-primary/8 overflow-hidden"
          style={{
            borderRadius: '16px',
            boxShadow: '0 10px 25px -8px rgba(0,0,0,0.08)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          {/* === PORTADA === */}
          <div className="relative p-5 pb-3">
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

              {/* Overlay hover con género + año */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 rounded-sm">
                <div className="text-center text-white px-3">
                  <div className="text-[10px] uppercase tracking-[0.15em] opacity-95 font-medium">
                    {genre}
                  </div>
                  {year && (
                    <div className="text-xs opacity-85 mt-1">{year}</div>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <MapPin className="w-2.5 h-2.5" />
                    {warehousesWithStock} almacenes
                  </div>
                </div>
              </div>

              {/* Badges esquina superior izquierda */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {book.isNew && (
                  <Badge
                    className="text-[10px] uppercase tracking-[0.1em] font-semibold text-white border-0 shadow-md"
                    style={{ background: '#C05A42' }}
                  >
                    Nuevo
                  </Badge>
                )}
                {book.isFeatured && !book.isNew && (
                  <Badge className="bg-white/95 backdrop-blur-sm text-primary text-[10px] uppercase tracking-[0.1em] font-semibold border-0 shadow-md">
                    <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                    Destacado
                  </Badge>
                )}
                {book.originType === 'own' && (
                  <Badge
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm border-primary/40 text-primary text-[9px] uppercase tracking-[0.1em] font-semibold shadow-sm"
                  >
                    Fondo editorial
                  </Badge>
                )}
              </div>
            </motion.div>
          </div>

          {/* === INFO === */}
          <div className="px-5 pb-5 pt-2 flex flex-col flex-1">
            {authorName && (
              <div className="text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground mb-1.5 font-medium">
                {authorName}
              </div>
            )}
            <h3
              className="font-serif font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2"
              style={{
                fontFamily: 'var(--font-fraunces), Georgia, serif',
                fontSize: '1.15rem',
                color: '#1A1A1A',
              }}
            >
              {book.title}
            </h3>

            {/* Categoría + año */}
            <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground mb-3">
              <span className="uppercase tracking-[0.08em]">{genre}</span>
              {year && (
                <>
                  <span className="text-border">·</span>
                  <span>{year}</span>
                </>
              )}
              {book.pages && (
                <>
                  <span className="text-border">·</span>
                  <span>{book.pages}p</span>
                </>
              )}
            </div>

            {/* Precio + stock */}
            <div className="mt-auto pt-3 flex items-end justify-between gap-2 border-t border-border/50">
              <div>
                <div
                  className="font-serif font-bold text-lg leading-none"
                  style={{ color: '#C05A42' }}
                >
                  {formatPrice(price, currency)}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1.5">
                  {totalStock > 0 ? (
                    <span className="text-emerald-700 dark:text-emerald-500">
                      ● {totalStock} en stock
                    </span>
                  ) : (
                    <span className="text-destructive">● Agotado</span>
                  )}
                </div>
              </div>
              <div
                className="w-9 h-9 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                aria-label="Ver detalle"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

// Skeleton para loading
export function BookCardSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="aspect-[2/3] w-full bg-muted rounded-2xl animate-pulse" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
        <div className="flex justify-between items-end pt-2">
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}
