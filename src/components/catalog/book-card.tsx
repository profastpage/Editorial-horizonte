// ============================================================================
//  BOOK CARD — Tarjeta de libro en catálogo
//  Click navega a /libro/[slug] (subpágina)
// ============================================================================
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import { BookCover } from '@/components/book-cover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUI } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4) }}
      className="group relative flex flex-col"
    >
      <Link href={href} className="relative cursor-pointer block">
        <div className="relative">
          <BookCover
            title={book.title}
            authorName={authorName}
            coverColor={book.metaTitle || '#7c2d12'}
            size="lg"
            className="w-full h-auto aspect-[2/3]"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {book.isNew && (
              <Badge variant="default" className="bg-primary text-primary-foreground text-[10px] uppercase tracking-editorial px-2 py-0.5">
                Nuevo
              </Badge>
            )}
            {book.isFeatured && !book.isNew && (
              <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm text-primary text-[10px] uppercase tracking-editorial px-2 py-0.5">
                <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                Destacado
              </Badge>
            )}
            {book.originType === 'own' && (
              <Badge variant="outline" className="bg-background/90 backdrop-blur-sm border-primary/40 text-primary text-[9px] uppercase tracking-editorial px-2 py-0.5">
                Fondo editorial
              </Badge>
            )}
          </div>

          {/* Hover overlay */}
          <motion.div
            initial={false}
            className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100"
          >
            <span className="text-xs uppercase tracking-editorial text-foreground bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-sm shadow-sm">
              Ver detalle
            </span>
          </motion.div>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-4 flex flex-col flex-1">
        {authorName && (
          <div className="text-[10px] uppercase tracking-editorial text-muted-foreground mb-1">
            {authorName}
          </div>
        )}
        <Link href={href}>
          <h3 className="font-serif font-semibold text-base leading-snug line-clamp-2 cursor-pointer hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>

        {book.publisher && (
          <div className="text-xs text-muted-foreground mt-1">
            {book.publisher.name}
          </div>
        )}

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <div className="font-serif text-lg font-semibold text-foreground">
              {formatPrice(price, currency)}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {totalStock > 0 ? (
                <span className="text-emerald-700 dark:text-emerald-500">
                  {totalStock} en stock
                </span>
              ) : (
                <span className="text-destructive">Agotado</span>
              )}
            </div>
          </div>
          <Link href={href}>
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9"
              disabled={totalStock === 0}
              aria-label="Ver detalle"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// Skeleton
export function BookCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[2/3] w-full bg-muted rounded-sm animate-pulse" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
        <div className="flex justify-between items-end pt-2">
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          <div className="h-9 w-9 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
