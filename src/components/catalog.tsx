'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { BookCard } from '@/components/book-card';
import { BookDetail } from '@/components/book-detail';
import { SectionWrapper } from '@/components/section-wrapper';
import type { BookWithDetails, CategoryData } from '@/lib/types';

async function fetchBooks(filters: {
  search?: string;
  categoryId?: string;
  originType?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<BookWithDetails[]> {
  const params = new URLSearchParams();
  params.set('resource', 'books');
  if (filters.search) params.set('search', filters.search);
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.originType) params.set('originType', filters.originType);
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  const res = await fetch(`/api?${params.toString()}`);
  if (!res.ok) throw new Error('Error al cargar libros');
  return res.json();
}

async function fetchCategories(): Promise<CategoryData[]> {
  const res = await fetch('/api?resource=categories');
  if (!res.ok) throw new Error('Error al cargar categorías');
  return res.json();
}

export function CatalogSection() {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    resetFilters,
    selectedBookId,
    setSelectedBookId,
  } = useAppStore();

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  // Fetch categories
  const { data: categories = [] } = useQuery<CategoryData[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch books
  const { data: books = [], isLoading } = useQuery<BookWithDetails[]>({
    queryKey: ['books', debouncedSearch, filters],
    queryFn: () =>
      fetchBooks({
        search: debouncedSearch || undefined,
        categoryId: filters.categoryId,
        originType: filters.originType,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      }),
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.originType) count++;
    return count;
  }, [filters]);

  const clearAll = useCallback(() => {
    resetFilters();
    setSearchQuery('');
  }, [resetFilters, setSearchQuery]);

  // Selected book for detail
  const selectedBook = books.find((b) => b.id === selectedBookId) || null;

  return (
    <SectionWrapper id="catalogo" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            Catálogo
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explora nuestra colección curada de literatura
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="size-4" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge className="ml-1 size-5 justify-center p-0 text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6 overflow-hidden"
            >
              <div className="space-y-3 rounded-lg border p-4">
                {/* Origin toggle */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={!filters.originType ? 'default' : 'outline'}
                    onClick={() => setFilters({ originType: undefined })}
                  >
                    Todos
                  </Button>
                  <Button
                    size="sm"
                    variant={filters.originType === 'PROPIO' ? 'default' : 'outline'}
                    onClick={() =>
                      setFilters({
                        originType: filters.originType === 'PROPIO' ? undefined : 'PROPIO',
                      })
                    }
                  >
                    Fondo Propio
                  </Button>
                  <Button
                    size="sm"
                    variant={filters.originType === 'TERCERO' ? 'default' : 'outline'}
                    onClick={() =>
                      setFilters({
                        originType: filters.originType === 'TERCERO' ? undefined : 'TERCERO',
                      })
                    }
                  >
                    Terceros
                  </Button>
                </div>

                {/* Category chips */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={!filters.categoryId ? 'default' : 'outline'}
                    onClick={() => setFilters({ categoryId: undefined })}
                  >
                    Todas las categorías
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      size="sm"
                      variant={filters.categoryId === cat.id ? 'default' : 'outline'}
                      onClick={() =>
                        setFilters({
                          categoryId: filters.categoryId === cat.id ? undefined : cat.id,
                        })
                      }
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Limpiar todos los filtros
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p className="mb-4 text-sm text-muted-foreground">
          {isLoading
            ? 'Cargando...'
            : `${books.length} libro${books.length !== 1 ? 's' : ''} encontrado${books.length !== 1 ? 's' : ''}`}
        </p>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] sm:aspect-[3/4.2] rounded-2xl overflow-hidden">
                <Skeleton className="h-full w-full rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Books grid — responsive, uniform cards */}
        {!isLoading && books.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="size-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-serif text-lg font-semibold">
              No se encontraron libros
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Intenta ajustar los filtros o buscar otro término.
            </p>
            <Button variant="outline" className="mt-4" onClick={clearAll}>
              Limpiar filtros
            </Button>
          </div>
        )}

        {/* Book Detail Dialog */}
        <BookDetail
          book={selectedBook}
          open={!!selectedBookId}
          onOpenChange={(open) => {
            if (!open) setSelectedBookId(null);
          }}
          onSelectRelatedTitle={(title) => {
            const clean = title.toLowerCase().replace(/['"«»]/g, '').trim();
            const found = books.find((b) => {
              const bTitle = b.title.toLowerCase().replace(/['"«»]/g, '').trim();
              return bTitle.includes(clean) || clean.includes(bTitle);
            });
            if (found) {
              setSelectedBookId(found.id);
            } else {
              setSelectedBookId(null);
              setSearchQuery(title);
            }
          }}
        />
      </div>
    </SectionWrapper>
  );
}