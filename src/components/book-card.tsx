'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ShoppingCart, Star, Check, BookOpen, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import type { BookWithDetails } from '@/lib/types';

interface BookCardProps {
  book: BookWithDetails;
  featured?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BookCard = React.forwardRef<HTMLDivElement, BookCardProps>(
  ({ className, book, onClick, ...props }, ref) => {
    const { addToCart } = useAppStore();
    const { toast } = useToast();
    const [isAdded, setIsAdded] = useState(false);

    const imageUrl = book.coverUrl || null;
    const authors = book.authors.map((a) => a.author.name).join(', ') || 'Editorial Horizonte';
    const originLabel = book.originType === 'PROPIO' ? 'Sello propio' : 'Sello distribuido';
    const outOfStock = book.totalStock === 0;
    const lowStock = book.totalStock > 0 && book.totalStock <= 10;
    const collectionLabel = book.series || book.categories[0]?.category?.name || 'Editorial Horizonte';

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (outOfStock) return;

      addToCart({
        bookId: book.id,
        title: book.title,
        price: book.price,
        originType: book.originType,
      });

      setIsAdded(true);
      toast({
        title: '¡Agregado al carrito!',
        description: `"${book.title}" se añadió a tu pedido.`,
      });
      setTimeout(() => setIsAdded(false), 1800);
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn('group h-full flex flex-col', className)}
        {...props}
      >
        <Link
          href={`/libro/${book.slug}`}
          onClick={onClick}
          className={cn(
            'relative flex flex-col h-full rounded-xl border border-border/40 bg-card/40 overflow-hidden text-card-foreground',
            'transition-all duration-300 ease-out',
            'hover:border-primary/40 hover:bg-card hover:shadow-md dark:hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.5)]',
            'hover:-translate-y-1'
          )}
        >
          {/* ─── 1. ÁREA DE PORTADA LIMPIA (100% VISIBLE, SIN DEGRADADO VERDE) ─── */}
          <div className="relative w-full aspect-[3/4] sm:aspect-[3/4.1] bg-muted/20 p-2.5 sm:p-5 flex items-center justify-center overflow-hidden">
            {/* Badges superiores oficiales */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none gap-1">
              <span className="inline-flex items-center gap-1 rounded-full px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider bg-background/90 backdrop-blur-sm border border-border/60 text-foreground/80 shadow-2xs truncate max-w-[50%]">
                {originLabel}
              </span>
              {book.isNew ? (
                <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-emerald-600 text-white px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-bold backdrop-blur-sm shadow-2xs uppercase tracking-wider shrink-0">
                  <Sparkles className="size-2 sm:size-2.5" />
                  Novedad
                </span>
              ) : book.isFeatured ? (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-400 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-bold text-amber-950 backdrop-blur-sm shadow-2xs shrink-0">
                  <Star className="size-2 sm:size-2.5 fill-current" />
                  Destacado
                </span>
              ) : null}
            </div>

            {/* Portada física 3D intacta — nunca recortada */}
            <div className="relative max-h-full max-w-[90%] sm:max-w-[82%] flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.04]">
              {imageUrl ? (
                <div className="relative overflow-hidden rounded-r-sm rounded-l-2xs shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.65)] border border-black/10 bg-background">
                  <img
                    src={imageUrl}
                    alt={`Portada de ${book.title}`}
                    className="w-full h-auto max-h-[220px] sm:max-h-[260px] object-contain block select-none"
                    loading="lazy"
                  />
                  {/* Sutil lomo y textura de libro físico */}
                  <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none rounded-l-2xs" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-30" />
                </div>
              ) : (
                /* Mockup editorial físico neutro (Image 13 del cliente) */
                <div className="w-36 sm:w-40 h-52 sm:h-56 flex flex-col justify-between p-3.5 text-center bg-[#f7f4ee] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-r-md rounded-l-2xs shadow-[0_8px_22px_-5px_rgba(0,0,0,0.25)] relative overflow-hidden select-none">
                  <div className="flex justify-center pt-1 opacity-40">
                    <BookOpen className="size-6 text-foreground stroke-1" />
                  </div>
                  <div className="my-auto px-1 space-y-1">
                    <span className="font-serif text-xs font-bold text-foreground leading-snug line-clamp-3">
                      {book.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground block line-clamp-1 font-sans">
                      {authors}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5">
                    <span className="text-[9px] text-muted-foreground font-medium tracking-wide">
                      {book.formatDescription || `${book.pages || 160} págs.`}
                    </span>
                  </div>
                  {/* Lomo y curvatura de libro */}
                  <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none rounded-l-2xs" />
                </div>
              )}
            </div>
          </div>

          {/* ─── 2. INFORMACIÓN EDITORIAL DEBAJO DE LA PORTADA (FONDO LIMPIO) ─── */}
          <div className="flex flex-col flex-1 justify-between p-2.5 sm:p-4 gap-1.5 sm:gap-2.5 bg-card">
            <div className="space-y-1">
              {/* Colección o Serie */}
              <p className="text-[9px] sm:text-[11px] font-semibold text-primary uppercase tracking-wider line-clamp-1">
                {collectionLabel}
              </p>

              {/* Título */}
              <h3 className="font-serif font-bold text-xs sm:text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
                {book.title}
              </h3>

              {/* Autor */}
              <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 font-medium">
                {authors}
              </p>
            </div>

            {/* Fila de Precio y Compra */}
            <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-1 mt-auto">
              <div className="flex flex-col min-w-0 shrink-0">
                <span className="font-serif text-sm sm:text-lg font-bold text-foreground tracking-tight whitespace-nowrap">
                  S/ {book.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {lowStock && (
                  <span className="text-[9px] sm:text-[10px] font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    ¡Últimas {book.totalStock}!
                  </span>
                )}
                {outOfStock && (
                  <span className="text-[9px] sm:text-[10px] font-semibold text-destructive whitespace-nowrap">
                    Agotado
                  </span>
                )}
              </div>

              {/* Botón de Agregar Rápido */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
                aria-label={`Agregar ${book.title} al carrito`}
                className={cn(
                  'relative flex items-center justify-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold shrink-0',
                  'transition-all duration-200 shadow-2xs select-none',
                  outOfStock
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                    : isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                )}
              >
                {isAdded ? (
                  <>
                    <Check className="size-3 sm:size-3.5" />
                    <span>Listo</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-3 sm:size-3.5" />
                    <span>Agregar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }
);
BookCard.displayName = 'BookCard';
