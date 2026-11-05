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
  BookOpen,
  Layers,
  ChevronRight,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { BookCard } from '@/components/book-card';
import { SectionWrapper } from '@/components/section-wrapper';
import type { BookWithDetails } from '@/lib/types';

// Oficial hierarchy from "página web horizonte.docx"
export const COLECCIONES_HORIZONTE = [
  {
    id: 'cjma',
    code: 'CJMA',
    name: 'Colección José María Arguedas (CJMA)',
    short: 'José María Arguedas',
    series: ['Serie Narrativa', 'Serie Poesía', 'Serie Ensayo', 'Serie Estudios Críticos', 'Plan Lector'],
    description: 'Ediciones oficiales conmemorativas, narrativa completa, poesía y ensayos antropológicos.',
  },
  {
    id: 'ccv',
    code: 'CCV',
    name: 'Colección César Vallejo (CCV)',
    short: 'César Vallejo',
    series: ['Serie Poesía', 'Serie Estudios Críticos'],
    description: 'Poesía completa, cartas inéditas y análisis críticos del universal poeta liberteño.',
  },
  {
    id: 'cfc',
    code: 'CFC',
    name: 'Colección Francisco Carrillo (CFC)',
    short: 'Francisco Carrillo',
    series: ['Serie Enciclopedia Histórica de la Literatura Peruana'],
    description: 'Enciclopedia monumental que recorre desde la literatura quechua y cronistas hasta la República.',
  },
  {
    id: 'crb',
    code: 'CRB',
    name: 'Colección Ralph Bolton (CRB)',
    short: 'Ralph Bolton',
    series: ['Serie Estudios Etnográficos', 'Serie Etnografía Clásica en el Altiplano Peruano 1940-1980'],
    description: 'Investigaciones pioneras sobre el campesinado andino, parentesco y memoria en el Altiplano.',
  },
  {
    id: 'cn',
    code: 'CN',
    name: 'Colección Narrativa (CN)',
    short: 'Narrativa',
    series: ['Serie Clásicos', 'Serie Contemporáneos'],
    description: 'Novela, relato y cuento peruano con autores clásicos y contemporáneos.',
  },
  {
    id: 'cp',
    code: 'CP',
    name: 'Colección Poesía (CP)',
    short: 'Poesía',
    series: [],
    description: 'Voces fundamentales del canon lírico nacional y antologías bilingües.',
  },
  {
    id: 'ce',
    code: 'CE',
    name: 'Colección Ensayo (CE)',
    short: 'Ensayo',
    series: ['Serie Crítica Literaria', 'Serie Ciencias Sociales', 'Serie Arte y Cultura', 'Serie Amazonía'],
    description: 'Reflexión crítica sobre el Estado, economía política, antropología y culturas originarias.',
  },
  {
    id: 'cij',
    code: 'CIJ',
    name: 'Colección Infanto-Juvenil (CIJ)',
    short: 'Infanto-Juvenil',
    series: ['Plan Lector'],
    description: 'Narraciones ilustradas y fábulas tradicionales para jóvenes lectores.',
  },
  {
    id: 'cm',
    code: 'CM',
    name: 'Colección Miscelánea (CM)',
    short: 'Miscelánea',
    series: [],
    description: 'Testimonios, crónicas de actualidad y aportes al debate cultural.',
  },
  {
    id: 'ci',
    code: 'CI',
    name: 'Colección Idiomas (CI)',
    short: 'Idiomas',
    series: ['Lingüística y Gramática'],
    description: 'Manuales de gramática quechua, lingüística andina y preservación de lenguas originarias.',
  },
];

export function bookMatchesCollection(book: BookWithDetails, colId: string): boolean {
  const catSlugs = book.categories.map((c) => (c.category?.slug || c.category?.id || '').toLowerCase());
  const catNames = book.categories.map((c) => (c.category?.name || '').toLowerCase());
  const series = (book.series || '').toLowerCase();
  const authorNames = book.authors.map((a) => a.author.name.toLowerCase()).join(' ');

  switch (colId) {
    case 'cjma':
      return catSlugs.includes('cat_arguedas') || catSlugs.includes('jose-maria-arguedas') || series.includes('cjma') || authorNames.includes('arguedas');
    case 'ccv':
      return catSlugs.includes('cat_vallejo') || catSlugs.includes('cesar-vallejo') || series.includes('ccv') || authorNames.includes('vallejo');
    case 'cfc':
      return series.includes('cfc') || authorNames.includes('carrillo') || series.includes('literatura peruana') || series.includes('francisco carrillo');
    case 'crb':
      return series.includes('crb') || authorNames.includes('bolton');
    case 'cn':
      return (catSlugs.includes('cat_narrativa') || catNames.includes('narrativa peruana') || series.includes('cn') || series.includes('serie narrativa')) && !series.includes('cjma') && !authorNames.includes('arguedas');
    case 'cp':
      return (catSlugs.includes('cat_poesia') || catNames.includes('poesía') || series.includes('cp') || series.includes('serie poesía')) && !series.includes('cjma') && !series.includes('ccv') && !authorNames.includes('arguedas') && !authorNames.includes('vallejo');
    case 'ce':
      return (catSlugs.includes('cat_ensayo') || catSlugs.includes('cat_ciencias_sociales') || catSlugs.includes('cat_amazonia') || catNames.some(n => n.includes('ensayo') || n.includes('sociales') || n.includes('amazonía')) || series.includes('ce') || series.includes('serie ensayo')) && !series.includes('cjma') && !authorNames.includes('arguedas');
    case 'cij':
      return catSlugs.includes('cat_infanto_juvenil') || catNames.some(n => n.includes('infanto') || n.includes('juvenil') || n.includes('lector')) || series.includes('cij') || series.includes('infanto');
    case 'cm':
      return catSlugs.includes('cat_miscelanea') || catNames.some(n => n.includes('miscelánea') || n.includes('desarrollo')) || series.includes('cm') || series.includes('miscelánea');
    case 'ci':
      return catSlugs.includes('cat_idiomas') || catNames.some(n => n.includes('idiomas') || n.includes('lingüística')) || series.includes('ci') || series.includes('idiomas');
    default:
      return false;
  }
}

async function fetchBooks(): Promise<BookWithDetails[]> {
  const res = await fetch('/api?resource=books');
  if (!res.ok) throw new Error('Error al cargar libros');
  return res.json();
}

export function CatalogSection({
  isSubpage = false,
  initialBooks,
}: {
  isSubpage?: boolean;
  initialBooks?: BookWithDetails[];
}) {
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

  const { data: allBooks = initialBooks || [], isLoading } = useQuery<BookWithDetails[]>({
    queryKey: ['all-books'],
    queryFn: fetchBooks,
    initialData: initialBooks,
  });

  // Filter books for a specific selection or search
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
      if (selectedColeccion && !bookMatchesCollection(book, selectedColeccion)) {
        return false;
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Cabecera Editorial */}
        <div className="space-y-3 max-w-3xl">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
            Estructura y Clasificación Oficial
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            Catálogo Editorial
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Explora las obras fundamentales de las letras peruanas organizadas por sellos editoriales y sus 10 colecciones oficiales con sus series temáticas.
          </p>
        </div>

        {/* ─── OPCIÓN A: BARRA DE BÚSQUEDA DIRECTA ─── */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Opción A: Buscar por título, autor o ISBN (ej. Arguedas, Vallejo, 978...)"
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
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-border/80 bg-muted/30 shrink-0">
            <Button
              size="sm"
              variant={selectedOrigin === null ? 'default' : 'ghost'}
              onClick={() => setSelectedOrigin(null)}
              className="rounded-lg text-xs h-9 px-3 font-semibold"
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

        {/* ─── OPCIÓN B: SELECTOR DE SELLOS EDITORIALES (2 SELLOS) ─── */}
        <div className="border-t border-border/40 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Sellos Editoriales
            </span>
            {(selectedColeccion || selectedSerie || searchQuery || selectedOrigin) && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Restablecer vista general
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedSello('horizonte');
                setSelectedColeccion(null);
                setSelectedSerie(null);
              }}
              className={`px-5 py-2.5 rounded-xl font-serif text-sm font-bold transition-all shadow-xs ${
                selectedSello === 'horizonte'
                  ? 'bg-primary text-primary-foreground shadow-primary/20 scale-102'
                  : 'bg-card border border-border/70 text-muted-foreground hover:text-foreground'
              }`}
            >
              Editorial Horizonte (10 Colecciones Oficiales)
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
              <span className="ml-2 text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                Próximamente
              </span>
            </button>
          </div>
        </div>

        {/* ─── DIRECTORIO VISUAL DE LAS 10 COLECCIONES OFICIALES ─── */}
        {selectedSello === 'horizonte' && (
          <div className="space-y-4 border-t border-border/40 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                Directorio Oficial de Colecciones (Selecciona una opción)
              </span>
              <span className="text-xs text-muted-foreground">
                10 colecciones temáticas
              </span>
            </div>

            {/* Grid Directorio de las 10 Colecciones */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {COLECCIONES_HORIZONTE.map((col, index) => {
                const isSelected = selectedColeccion === col.id;
                const bookCount = allBooks.filter((b) => bookMatchesCollection(b, col.id)).length;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedColeccion(null);
                        setSelectedSerie(null);
                      } else {
                        setSelectedColeccion(col.id);
                        setSelectedSerie(null);
                      }
                    }}
                    className={`flex flex-col text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-102'
                        : 'bg-card/60 hover:bg-card border-border/60 hover:border-primary/50 text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`font-mono text-[10px] font-bold ${isSelected ? 'text-primary-foreground/80' : 'text-primary'}`}>
                        {index + 1 < 10 ? `0${index + 1}` : index + 1} · {col.code}
                      </span>
                      {bookCount > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {bookCount}
                        </span>
                      )}
                    </div>
                    <span className="font-serif font-bold text-xs line-clamp-1 leading-snug">
                      {col.short}
                    </span>
                    <span className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
                      {col.series.length > 0 ? `${col.series.length} series` : 'Obras completas'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sub-series si hay una colección activa */}
            {activeColeccionObj && activeColeccionObj.series.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Filter className="size-3.5" />
                    Series de la {activeColeccionObj.name}:
                  </span>
                  {selectedSerie && (
                    <button
                      type="button"
                      onClick={() => setSelectedSerie(null)}
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      Ver todas las series de esta colección
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSerie(null)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedSerie === null
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border border-border/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Todas ({filteredBooks.length})
                  </button>
                  {activeColeccionObj.series.map((serie) => {
                    const isSelected = selectedSerie === serie;
                    return (
                      <button
                        key={serie}
                        type="button"
                        onClick={() => setSelectedSerie(isSelected ? null : serie)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                            : 'bg-background border border-border/80 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {serie}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ─── VISTA 1: PAPEL DE VIENTO EN PREPARACIÓN ─── */}
        {selectedSello === 'papel-de-viento' ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border/80 bg-card p-8 space-y-3">
            <BookOpen className="size-12 text-primary/40 mx-auto stroke-1" />
            <h3 className="font-serif text-xl font-bold text-foreground">Sello Editorial Papel de Viento</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Nuevo sello editorial en preparación dedicado a la narrativa contemporánea y nuevas voces literarias. Próximamente se integrará su catálogo oficial.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSelectedSello('horizonte')}>
              Volver a Editorial Horizonte
            </Button>
          </div>
        ) : debouncedSearch || selectedColeccion || selectedOrigin ? (
          /* ─── VISTA 2: RESULTADOS FILTRADOS POR BÚSQUEDA O COLECCIÓN SELECCIONADA ─── */
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-3">
              <span className="font-semibold text-foreground">
                {activeColeccionObj ? activeColeccionObj.name : 'Resultados de búsqueda'}
                {selectedSerie ? ` · ${selectedSerie}` : ''}
              </span>
              <span>
                {isLoading ? 'Cargando...' : `${filteredBooks.length} obra${filteredBooks.length !== 1 ? 's' : ''} encontrada${filteredBooks.length !== 1 ? 's' : ''}`}
              </span>
            </div>

            {isLoading && (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4.2] rounded-xl overflow-hidden">
                    <Skeleton className="h-full w-full rounded-xl" />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && filteredBooks.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {!isLoading && filteredBooks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-card/40 rounded-xl border p-6">
                <Search className="size-10 text-muted-foreground/30 mb-3" />
                <h3 className="font-serif text-base font-bold">No se encontraron títulos con este filtro</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                  Prueba seleccionando otra colección o limpiando los términos de búsqueda.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={resetAllFilters}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* ─── VISTA 3: CATÁLOGO CLASIFICADO POR BLOQUES/MÓDULOS DE COLECCIONES (OFICIAL) ─── */
          <div className="space-y-16 pt-4">
            {COLECCIONES_HORIZONTE.map((col, idx) => {
              const colBooks = allBooks.filter((b) => bookMatchesCollection(b, col.id));
              if (colBooks.length === 0) return null;

              return (
                <div key={col.id} className="space-y-6 border-t border-border/40 pt-8 first:border-t-0 first:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">
                          0{idx + 1}
                        </span>
                        <span className="text-muted-foreground text-xs">/</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          {col.code}
                        </span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                        {col.name}
                      </h2>
                      <p className="text-xs text-muted-foreground max-w-2xl">
                        {col.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedColeccion(col.id);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0 group"
                    >
                      <span>Ver todas ({colBooks.length} obras)</span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Fila ordenada de libros de la colección (hasta 4 u 8) */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {colBooks.slice(0, 4).map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
