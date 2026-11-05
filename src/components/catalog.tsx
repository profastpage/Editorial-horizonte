'use client';

import * as React from 'react';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  X,
  SlidersHorizontal,
  BookOpen,
  Layers,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { BookCard } from '@/components/book-card';
import { SectionWrapper } from '@/components/section-wrapper';
import type { BookWithDetails } from '@/lib/types';

// Oficial hierarchy from "página web horizonte.docx"
export const COLECCIONES_HORIZONTE = [
  {
    id: 'cjma',
    name: 'Colección José María Arguedas (CJMA)',
    short: 'José María Arguedas',
    series: ['Serie Narrativa', 'Serie Poesía', 'Serie Ensayo', 'Serie Estudios Críticos', 'Plan Lector'],
  },
  {
    id: 'ccv',
    name: 'Colección César Vallejo (CCV)',
    short: 'César Vallejo',
    series: ['Serie Poesía', 'Serie Estudios Críticos'],
  },
  {
    id: 'cfc',
    name: 'Colección Francisco Carrillo (CFC)',
    short: 'Francisco Carrillo',
    series: ['Serie Enciclopedia Histórica de la Literatura Peruana'],
  },
  {
    id: 'crb',
    name: 'Colección Ralph Bolton (CRB)',
    short: 'Ralph Bolton',
    series: ['Serie Estudios Etnográficos', 'Serie Etnografía Clásica en el Altiplano Peruano 1940-1980'],
  },
  {
    id: 'cn',
    name: 'Colección Narrativa (CN)',
    short: 'Narrativa',
    series: ['Serie Clásicos', 'Serie Contemporáneos'],
  },
  {
    id: 'cp',
    name: 'Colección Poesía (CP)',
    short: 'Poesía',
    series: [],
  },
  {
    id: 'ce',
    name: 'Colección Ensayo (CE)',
    short: 'Ensayo',
    series: ['Serie Crítica Literaria', 'Serie Ciencias Sociales', 'Serie Arte y Cultura', 'Serie Amazonía'],
  },
  {
    id: 'cij',
    name: 'Colección Infanto-Juvenil (CIJ)',
    short: 'Infanto-Juvenil',
    series: [],
  },
  {
    id: 'cm',
    name: 'Colección Miscelánea (CM)',
    short: 'Miscelánea',
    series: [],
  },
  {
    id: 'ci',
    name: 'Colección Idiomas (CI)',
    short: 'Idiomas',
    series: [],
  },
];

async function fetchBooks(): Promise<BookWithDetails[]> {
  const res = await fetch('/api?resource=books');
  if (!res.ok) throw new Error('Error al cargar libros');
  return res.json();
}

export function CatalogSection({ isSubpage = false }: { isSubpage?: boolean }) {
  const { searchQuery, setSearchQuery } = useAppStore();
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSello, setSelectedSello] = useState<'horizonte' | 'papel-de-viento'>('horizonte');
  const [selectedColeccion, setSelectedColeccion] = useState<string | null>(null);
  const [selectedSerie, setSelectedSerie] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<'PROPIO' | 'TERCERO' | null>(null);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  const { data: allBooks = [], isLoading } = useQuery<BookWithDetails[]>({
    queryKey: ['all-books'],
    queryFn: fetchBooks,
  });

  // Filter books based on hierarchy
  const filteredBooks = useMemo(() => {
    if (selectedSello === 'papel-de-viento') {
      return [];
    }

    return allBooks.filter((book) => {
      // 1. Text search
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const matchTitle = book.title.toLowerCase().includes(q);
        const matchAuthor = book.authors.some((a) => a.author.name.toLowerCase().includes(q));
        const matchIsbn = book.isbn ? book.isbn.includes(q) : false;
        if (!matchTitle && !matchAuthor && !matchIsbn) return false;
      }

      // 2. Sello propio vs distribuido
      if (selectedOrigin && book.originType !== selectedOrigin) {
        return false;
      }

      // 3. Colección filter
      if (selectedColeccion) {
        const colObj = COLECCIONES_HORIZONTE.find((c) => c.id === selectedColeccion);
        if (colObj) {
          const catMatch = book.categories.some((c) =>
            c.category.name.toLowerCase().includes(colObj.short.toLowerCase())
          );
          const seriesMatch = book.series ? book.series.toLowerCase().includes(colObj.short.toLowerCase()) : false;
          if (!catMatch && !seriesMatch) return false;
        }
      }

      // 4. Serie filter
      if (selectedSerie && book.series) {
        const cleanSerie = selectedSerie.replace('Serie ', '').toLowerCase();
        if (!book.series.toLowerCase().includes(cleanSerie)) return false;
      }

      return true;
    });
  }, [allBooks, debouncedSearch, selectedSello, selectedColeccion, selectedSerie, selectedOrigin]);

  const activeColeccionObj = COLECCIONES_HORIZONTE.find((c) => c.id === selectedColeccion);

  const resetAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedColeccion(null);
    setSelectedSerie(null);
    setSelectedOrigin(null);
    setSelectedSello('horizonte');
  }, [setSearchQuery]);

  return (
    <SectionWrapper id="catalogo" className={isSubpage ? 'pt-8 pb-24' : 'py-16 sm:py-20'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header — clean without generic copy */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Catálogo Editorial
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest font-semibold">
            Ediciones Oficiales · Literatura, Humanidades y Ciencias Sociales
          </p>
        </div>

        {/* ─── 1. SELECTOR DE SELLOS EDITORIALES ─── */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedSello('horizonte')}
            className={`px-5 py-2.5 rounded-xl font-serif text-sm font-bold transition-all shadow-xs ${
              selectedSello === 'horizonte'
                ? 'bg-primary text-primary-foreground shadow-primary/20 scale-102'
                : 'bg-card border border-border/70 text-muted-foreground hover:text-foreground'
            }`}
          >
            Editorial Horizonte
          </button>

          <button
            type="button"
            onClick={() => setSelectedSello('papel-de-viento')}
            className={`px-5 py-2.5 rounded-xl font-serif text-sm font-semibold transition-all border border-dashed ${
              selectedSello === 'papel-de-viento'
                ? 'bg-muted border-primary text-foreground'
                : 'border-border/60 text-muted-foreground/80 hover:text-foreground'
            }`}
          >
            <span>Papel de Viento</span>
            <span className="ml-1.5 text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              Próximo
            </span>
          </button>
        </div>

        {/* ─── 2. BARRA DE BÚSQUEDA Y ORIGEN ─── */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por título, autor o ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 rounded-xl bg-card border-border/80 text-sm shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Toggle Sello propio vs Sello distribuido */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-border/80 bg-muted/40 shrink-0">
            <Button
              size="sm"
              variant={selectedOrigin === null ? 'default' : 'ghost'}
              onClick={() => setSelectedOrigin(null)}
              className="rounded-lg text-xs h-9 px-3"
            >
              Todos
            </Button>
            <Button
              size="sm"
              variant={selectedOrigin === 'PROPIO' ? 'default' : 'ghost'}
              onClick={() => setSelectedOrigin(selectedOrigin === 'PROPIO' ? null : 'PROPIO')}
              className="rounded-lg text-xs h-9 px-3"
            >
              Sello propio
            </Button>
            <Button
              size="sm"
              variant={selectedOrigin === 'TERCERO' ? 'default' : 'ghost'}
              onClick={() => setSelectedOrigin(selectedOrigin === 'TERCERO' ? null : 'TERCERO')}
              className="rounded-lg text-xs h-9 px-3"
            >
              Sello distribuido
            </Button>
          </div>
        </div>

        {/* ─── 3. CLASIFICACIÓN MODULAR POR COLECCIONES (OFICIAL) ─── */}
        {selectedSello === 'horizonte' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                Colecciones Oficiales
              </span>
              {(selectedColeccion || selectedSerie || searchQuery || selectedOrigin) && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Chips de Colecciones */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedColeccion(null);
                  setSelectedSerie(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedColeccion === null
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'bg-card border border-border/70 text-muted-foreground hover:text-foreground'
                }`}
              >
                Todas las colecciones
              </button>

              {COLECCIONES_HORIZONTE.map((col) => {
                const isSelected = selectedColeccion === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      setSelectedColeccion(isSelected ? null : col.id);
                      setSelectedSerie(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-2xs'
                        : 'bg-card border border-border/70 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {col.short}
                  </button>
                );
              })}
            </div>

            {/* Sub-series si la colección seleccionada tiene series */}
            {activeColeccionObj && activeColeccionObj.series.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2 flex flex-wrap items-center gap-2"
              >
                <span className="text-[11px] text-muted-foreground font-medium mr-1">
                  Series de {activeColeccionObj.short}:
                </span>
                {activeColeccionObj.series.map((serie) => {
                  const isSelected = selectedSerie === serie;
                  return (
                    <button
                      key={serie}
                      type="button"
                      onClick={() => setSelectedSerie(isSelected ? null : serie)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        isSelected
                          ? 'bg-primary/20 text-primary border border-primary/40 font-bold'
                          : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {serie}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        )}

        {/* ─── 4. GRILLA DE LIBROS ─── */}
        {selectedSello === 'papel-de-viento' ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border/80 bg-card p-8 space-y-3">
            <BookOpen className="size-12 text-primary/40 mx-auto stroke-1" />
            <h3 className="font-serif text-xl font-bold text-foreground">Sello Papel de Viento</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Nuevo sello editorial en preparación. Próximamente se integrarán las obras y títulos de esta colección.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSelectedSello('horizonte')}>
              Volver a Editorial Horizonte
            </Button>
          </div>
        ) : (
          <>
            {/* Resultados count */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <span>
                {isLoading
                  ? 'Cargando obras...'
                  : `${filteredBooks.length} libro${filteredBooks.length !== 1 ? 's' : ''} disponible${filteredBooks.length !== 1 ? 's' : ''}`}
              </span>
              {activeColeccionObj && (
                <span className="font-medium text-foreground">
                  Filtrando por: {activeColeccionObj.name} {selectedSerie ? `· ${selectedSerie}` : ''}
                </span>
              )}
            </div>

            {/* Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4.2] rounded-2xl overflow-hidden">
                    <Skeleton className="h-full w-full rounded-2xl" />
                  </div>
                ))}
              </div>
            )}

            {/* Books Grid — Responsive, uniform cards with clean covers */}
            {!isLoading && filteredBooks.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && filteredBooks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border">
                <Search className="size-12 text-muted-foreground/30 mb-3" />
                <h3 className="font-serif text-lg font-bold">No se encontraron títulos</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm">
                  Intenta ajustar el término de búsqueda o selecciona otra colección.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={resetAllFilters}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
