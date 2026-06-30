// ============================================================================
//  CATALOG SECTION — Catálogo completo con filtros + grid + skeletons
//  Para la página /catalogo
// ============================================================================
'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookCard, BookCardSkeleton } from '@/components/catalog/book-card'
import { useCatalog } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { BookWithRelations } from '@/lib/types'

interface CatalogSectionProps {
  books: BookWithRelations[]
  categories: Array<{ id: string; name: string; slug: string }>
}

export function CatalogSection({ books, categories }: CatalogSectionProps) {
  const { search, setSearch, originType, setOriginType, categorySlug, setCategorySlug, sortBy, setSortBy } = useCatalog()
  const [showFilters, setShowFilters] = useState(false)
  const [loading] = useState(false)

  const filteredBooks = useMemo(() => {
    let result = [...books]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.authors?.some((a) => a.fullName.toLowerCase().includes(q)) ||
          b.publisher?.name.toLowerCase().includes(q) ||
          b.isbn?.toLowerCase().includes(q)
      )
    }

    if (originType !== 'all') {
      result = result.filter((b) => b.originType === originType)
    }

    if (categorySlug !== 'all') {
      result = result.filter((b) => b.categories?.some((c) => c.slug === categorySlug))
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (b.publicationDate ?? '').localeCompare(a.publicationDate ?? ''))
        break
      case 'price_asc':
        result.sort((a, b) => a.pricePen - b.pricePen)
        break
      case 'price_desc':
        result.sort((a, b) => b.pricePen - a.pricePen)
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'featured':
      default:
        result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
        break
    }

    return result
  }, [books, search, originType, categorySlug, sortBy])

  function clearFilters() {
    setSearch('')
    setOriginType('all')
    setCategorySlug('all')
    setSortBy('featured')
  }

  const hasActiveFilters = search || originType !== 'all' || categorySlug !== 'all' || sortBy !== 'featured'

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
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
              Explora nuestro fondo editorial propio y la selección de terceras editoriales
              que distribuimos. Filtra por origen, categoría o búsqueda libre.
            </motion.p>
          </div>
        </div>

        {/* Barra de filtros */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <Input
                type="search"
                placeholder="Buscar por título, autor, editorial o ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Button
              variant="outline"
              size="default"
              className="h-11 lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Filtros
            </Button>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="h-11 w-full sm:w-56">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados primero</SelectItem>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
                <SelectItem value="title">Título (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chips de filtros */}
          <div className={cn('flex flex-wrap items-center gap-2', !showFilters && 'hidden lg:flex')}>
            <span className="text-xs uppercase tracking-editorial text-muted-foreground mr-1">
              Origen:
            </span>
            {([
              { v: 'all', l: 'Todos' },
              { v: 'own', l: 'Fondo editorial' },
              { v: 'third_party', l: 'Terceras' },
            ] as const).map((opt) => (
              <button
                key={opt.v}
                onClick={() => setOriginType(opt.v as any)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                  originType === opt.v
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground/70 border-border hover:border-primary/40'
                )}
              >
                {opt.l}
              </button>
            ))}

            <span className="text-xs uppercase tracking-editorial text-muted-foreground ml-3 mr-1">
              Categoría:
            </span>
            <button
              onClick={() => setCategorySlug('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                categorySlug === 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground/70 border-border hover:border-primary/40'
              )}
            >
              Todas
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategorySlug(c.slug)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                  categorySlug === c.slug
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground/70 border-border hover:border-primary/40'
                )}
              >
                {c.name}
              </button>
            ))}

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-2 text-xs text-muted-foreground"
              >
                <X className="w-3 h-3 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Resultado count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'resultado' : 'resultados'}
          {search && <> para «<span className="text-foreground font-medium">{search}</span>»</>}
        </div>

        {/* Grid de libros */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : filteredBooks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
                <Filter className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-2">No encontramos libros</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Prueba ajustando los filtros o usando otra palabra de búsqueda.
              </p>
              <Button onClick={clearFilters} variant="outline">
                <X className="w-4 h-4 mr-2" /> Limpiar filtros
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {filteredBooks.map((book, idx) => (
                <BookCard key={book.id} book={book} index={idx} onOpen={() => {}} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
