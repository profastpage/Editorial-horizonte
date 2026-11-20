'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BookCard } from '@/components/book-card';
import type { BookWithDetails } from '@/lib/types';

interface HomeRowsProps {
  novedades: BookWithDetails[];
}

export function HomeRows({ novedades }: HomeRowsProps) {
  return (
    <div className="w-full py-12 sm:py-16">
      {/* ─── FILA: NOVEDADES EDITORIALES 2026 ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="size-3.5" />
              Lanzamientos Oficiales 2026
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Novedades
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Nuevas publicaciones y revisiones críticas de nuestro catálogo
            </p>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline group"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Novedades Grid — 4 productos destacados, formato amplio y visual */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {novedades.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
