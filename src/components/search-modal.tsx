'use client';

import * as React from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, BookOpen, Sparkles, CornerDownLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getAllBooks } from '@/lib/books';
import type { BookWithDetails } from '@/lib/types';

export function SearchModal() {
  const router = useRouter();
  const { searchOpen, setSearchOpen, setSearchQuery } = useAppStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const allBooks = useMemo(() => getAllBooks(), []);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  // Autofocus input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  // Filter books
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return allBooks
      .filter((book) => {
        const titleMatch = book.title.toLowerCase().includes(q);
        const authorMatch = book.authors.some((a) =>
          a.author.name.toLowerCase().includes(q)
        );
        const seriesMatch = book.series?.toLowerCase().includes(q);
        const isbnMatch = book.isbn?.toLowerCase().includes(q);
        return titleMatch || authorMatch || seriesMatch || isbnMatch;
      })
      .slice(0, 8);
  }, [allBooks, query]);

  const handleSelectBook = (slug: string) => {
    setSearchOpen(false);
    router.push(`/libro/${slug}`);
  };

  const handleViewAllInCatalog = () => {
    setSearchQuery(query);
    setSearchOpen(false);
    router.push('/catalogo');
  };

  const quickTerms = ['Arguedas', 'Vallejo', 'Novedades', 'Poesía', 'Ensayo', 'Reforma agraria'];

  if (!searchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 sm:px-6">
        {/* Backdrop glass */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSearchOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl z-10 flex flex-col max-h-[82vh]"
        >
          {/* Header Input */}
          <div className="flex items-center px-4 py-3.5 border-b border-border/60 gap-3">
            <Search className="size-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, autor, colección o ISBN..."
              className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Borrar texto"
              >
                <X className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-xs font-semibold px-2 py-1 rounded-md bg-muted text-muted-foreground hover:text-foreground"
            >
              ESC
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto p-4 space-y-4">
            {query.trim().length === 0 ? (
              <div className="space-y-4 py-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                    Búsquedas frecuentes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickTerms.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-border/70 hover:border-primary/50 hover:bg-muted/50 text-foreground transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                    Lanzamientos destacados
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allBooks
                      .filter((b) => b.isNew)
                      .slice(0, 4)
                      .map((book) => (
                        <button
                          key={book.id}
                          type="button"
                          onClick={() => handleSelectBook(book.slug)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/60 transition-colors text-left group"
                        >
                          <div className="size-10 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
                            {book.coverUrl ? (
                              <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <BookOpen className="size-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {book.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {book.authors.map((a) => a.author.name).join(', ')}
                            </p>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  Resultados encontrados ({filtered.length})
                </p>
                {filtered.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => handleSelectBook(book.slug)}
                    className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-muted/70 transition-colors text-left group border border-transparent hover:border-border/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-12 rounded-sm bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-black/10 shadow-2xs">
                        {book.coverUrl ? (
                          <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="size-4 text-muted-foreground/60" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-serif text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {book.title}
                          </p>
                          {book.isNew && (
                            <span className="shrink-0 text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">
                              Novedad
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {book.authors.map((a) => a.author.name).join(', ')}
                          {book.series ? ` · ${book.series}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-serif font-bold text-xs sm:text-sm text-foreground">
                        S/ {book.price.toFixed(2)}
                      </span>
                      <CornerDownLeft className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <BookOpen className="size-8 mx-auto text-muted-foreground/40 stroke-1" />
                <p className="font-serif text-base font-semibold text-foreground">
                  No se encontraron libros para «{query}»
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Prueba buscando por el apellido del autor (ej. Arguedas, Vallejo) o por temática general.
                </p>
              </div>
            )}
          </div>

          {/* Footer Action */}
          {query.trim().length > 0 && (
            <div className="p-3 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs">
              <span className="text-muted-foreground hidden sm:inline">
                Usa ↑ ↓ para navegar · Enter para seleccionar
              </span>
              <button
                type="button"
                onClick={handleViewAllInCatalog}
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline ml-auto"
              >
                <span>Ver todos en el Catálogo completo</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
