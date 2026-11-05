'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { BookCard } from '@/components/book-card';
import type { BookWithDetails } from '@/lib/types';

interface HomeRowsProps {
  novedades: BookWithDetails[];
}

const proximamente = [
  {
    id: 'prox_1',
    title: 'Relatos completos',
    author: 'José María Arguedas',
    series: 'CJMA - Serie Narrativa',
    year: '2026',
    format: 'Edición conmemorativa ilustrada',
  },
  {
    id: 'prox_2',
    title: 'Amauta 100 años',
    author: 'José Carlos Mariátegui',
    series: 'Colección Ensayo',
    year: '2026',
    format: 'Facsimilar y estudios críticos',
  },
  {
    id: 'prox_3',
    title: 'Poesía completa y cartas inéditas',
    author: 'César Vallejo',
    series: 'Colección César Vallejo (CCV)',
    year: '2026',
    format: 'Edición crítica de lujo',
  },
  {
    id: 'prox_4',
    title: 'Etnografía y memoria andina',
    author: 'Ralph Bolton',
    series: 'Colección Ralph Bolton (CRB)',
    year: '2026',
    format: 'Estudios etnográficos en el Altiplano',
  },
];

export function HomeRows({ novedades }: HomeRowsProps) {
  return (
    <div className="w-full space-y-20 py-12 sm:py-16">
      {/* ─── FILA 1: NOVEDADES EDITORIALES ─── */}
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

        {/* Novedades Grid — Portadas físicas limpias sin degradados */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {novedades.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* ─── FILA 2: PRÓXIMAMENTE ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="size-3.5" />
              En Edición e Imprenta
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Próximamente
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Obras emblemáticas y títulos en proceso de publicación
            </p>
          </div>
        </div>

        {/* Próximamente Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {proximamente.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="group relative flex flex-col justify-between rounded-2xl border border-dashed border-border/80 bg-card/60 p-5 hover:border-primary/50 hover:bg-card transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    Próximo
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {item.year}
                  </span>
                </div>

                {/* Minimal preview book placeholder */}
                <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-muted/60 via-muted/30 to-muted/50 border border-border/40 flex flex-col items-center justify-center p-4 text-center">
                  <BookOpen className="size-8 text-primary/40 mb-2 stroke-1" />
                  <span className="font-serif font-bold text-sm text-foreground line-clamp-2">
                    {item.title}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                    {item.series}
                  </p>
                  <h3 className="font-serif font-bold text-base text-foreground mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {item.author}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-[11px]">{item.format}</span>
                <span className="font-semibold text-primary text-[11px]">En preparación</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
