'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  BookOpen,
  Calendar,
  Hash,
  Globe,
  Copy,
  Check,
  Zap,
  Plus,
  Minus,
  Truck,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Layers,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import type { BookWithDetails } from '@/lib/types';

interface BookDetailProps {
  book: BookWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRelatedTitle?: (title: string) => void;
}

export function BookDetail({ book, open, onOpenChange, onSelectRelatedTitle }: BookDetailProps) {
  const { addToCart, setCheckoutOpen } = useAppStore();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'sinopsis' | 'ficha' | 'relacionados'>('sinopsis');
  const [copiedIsbn, setCopiedIsbn] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Reset local state when book changes
  React.useEffect(() => {
    if (book) {
      setQuantity(1);
      setActiveTab('sinopsis');
      setCopiedIsbn(false);
      setIsAdded(false);
    }
  }, [book?.id]);

  if (!book) return null;

  const authors = book.authors.map((a) => a.author.name).join(', ') || 'Editorial Horizonte';
  const outOfStock = book.totalStock === 0;
  const isLowStock = book.totalStock > 0 && book.totalStock <= 10;
  const initial = book.title.charAt(0).toUpperCase();

  const handleCopyIsbn = () => {
    if (!book.isbn) return;
    navigator.clipboard.writeText(book.isbn);
    setCopiedIsbn(true);
    toast({
      title: 'ISBN copiado al portapapeles',
      description: book.isbn,
    });
    setTimeout(() => setCopiedIsbn(false), 2000);
  };

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(
      {
        bookId: book.id,
        title: book.title,
        price: book.price,
        originType: book.originType,
      },
      quantity
    );
    setIsAdded(true);
    toast({
      title: '¡Agregado al carrito!',
      description: `${quantity} × "${book.title}"`,
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addToCart(
      {
        bookId: book.id,
        title: book.title,
        price: book.price,
        originType: book.originType,
      },
      quantity
    );
    onOpenChange(false);
    setCheckoutOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[92vw] lg:max-w-4xl p-0 overflow-hidden rounded-2xl border border-border/80 shadow-2xl bg-background/98 backdrop-blur-xl">
        {/* Invisible header for screen-reader accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>{book.title}</DialogTitle>
          <DialogDescription>{authors}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[330px_1fr] max-h-[88vh] overflow-y-auto md:overflow-hidden">
          {/* ─── LEFT COLUMN: Atmospheric Book Showcase ─── */}
          <div className="relative flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-muted/80 via-muted/40 to-muted/80 border-b md:border-b-0 md:border-r border-border/60 overflow-hidden">
            {/* Ambient blurred glow from cover */}
            {book.coverUrl && (
              <div
                className="absolute inset-0 opacity-15 blur-3xl scale-125 pointer-events-none"
                style={{
                  backgroundImage: `url(${book.coverUrl})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              />
            )}

            {/* Top Badges over showcase */}
            <div className="w-full flex items-center justify-between z-10 mb-4">
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-background/80 backdrop-blur-sm border border-border/60 text-foreground">
                {book.originType === 'PROPIO' ? 'Fondo Propio' : 'Tercero'}
              </span>
              {book.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2.5 py-0.5 text-[10px] font-bold text-amber-950 backdrop-blur-sm shadow-sm">
                  <Star className="size-3 fill-current" />
                  Destacado
                </span>
              )}
            </div>

            {/* 3D Editorial Book Mockup (Never Cropped) */}
            <div className="relative my-auto py-2 z-10 flex items-center justify-center w-full">
              <div className="relative group max-w-[240px] sm:max-w-[270px] transition-transform duration-500 hover:scale-[1.03]">
                {/* Book shadow & perspective */}
                <div className="relative overflow-hidden rounded-r-md rounded-l-xs shadow-[0_18px_45px_-10px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.65)] border border-black/10 bg-card">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={`Portada de ${book.title}`}
                      className="w-full h-auto max-h-[380px] object-contain block select-none"
                    />
                  ) : (
                    <div className="w-64 h-88 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
                      <BookOpen className="size-12 mb-3 opacity-60" />
                      <span className="font-serif text-lg font-bold line-clamp-3">{book.title}</span>
                      <span className="text-xs mt-2 opacity-80">{authors}</span>
                    </div>
                  )}

                  {/* Spine lighting & crease simulation */}
                  <div className="absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none rounded-l-xs" />
                  {/* Subtle glossy sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-40" />
                </div>
              </div>
            </div>

            {/* Bottom Format Badge */}
            <div className="w-full mt-4 z-10 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-background/70 backdrop-blur-sm border border-border/50 text-muted-foreground">
                <BookOpen className="size-3.5 text-primary" />
                {book.formatDescription || `${book.pages || 160} páginas · Tapa blanda`}
              </span>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Editorial Dossier & Purchase ─── */}
          <div className="flex flex-col justify-between p-6 sm:p-8 md:max-h-[88vh] md:overflow-y-auto space-y-6">
            <div className="space-y-5">
              {/* Collection & Series breadcrumb */}
              <div className="flex flex-wrap items-center gap-2">
                {book.series ? (
                  <Badge variant="secondary" className="font-medium text-xs tracking-wide">
                    {book.series}
                  </Badge>
                ) : (
                  book.categories.map((c) => (
                    <Badge key={c.categoryId} variant="secondary" className="font-medium text-xs">
                      {c.category.name}
                    </Badge>
                  ))
                )}
                {book.thematic && (
                  <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                    · {book.thematic.split(',')[0]}
                  </span>
                )}
              </div>

              {/* Title & Author Header */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                  {book.title}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-sm sm:text-base text-muted-foreground font-medium">
                  <span>Por <strong className="text-foreground font-semibold">{authors}</strong></span>
                  {book.authors[0]?.author?.nationality && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-normal">
                      {book.authors[0].author.nationality}
                    </span>
                  )}
                </div>
              </div>

              {/* ─── Purchase Action Card ─── */}
              <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                      Precio
                    </span>
                    <span className="font-serif text-3xl font-bold text-primary tracking-tight">
                      S/ {book.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Stock pill with pulse indicator */}
                  <div className="flex items-center gap-2">
                    {outOfStock ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
                        <span className="size-2 rounded-full bg-destructive" />
                        Agotado
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                        <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                        ¡Últimas {book.totalStock} unidades!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        En stock ({book.totalStock} disponibles)
                      </span>
                    )}
                  </div>
                </div>

                {/* Stepper + Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between border rounded-lg px-2 py-1 bg-background shrink-0 w-full sm:w-32">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      disabled={quantity <= 1 || outOfStock}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="font-semibold text-sm px-2 tabular-nums">
                      {quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      disabled={quantity >= book.totalStock || outOfStock}
                      onClick={() => setQuantity((q) => Math.min(book.totalStock, q + 1))}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>

                  {/* Add to Cart button */}
                  <Button
                    size="lg"
                    className="flex-1 gap-2 font-semibold shadow-sm transition-all"
                    disabled={outOfStock}
                    onClick={handleAddToCart}
                  >
                    {isAdded ? (
                      <>
                        <Check className="size-4 text-emerald-300" />
                        ¡Agregado al carrito!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="size-4" />
                        Agregar al carrito
                      </>
                    )}
                  </Button>

                  {/* Buy Now button */}
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-1.5 font-semibold shrink-0"
                    disabled={outOfStock}
                    onClick={handleBuyNow}
                  >
                    <Zap className="size-4 text-primary" />
                    Comprar ahora
                  </Button>
                </div>
              </div>

              {/* ─── Navigation Tabs: Sinopsis / Ficha Técnica / Relacionados ─── */}
              <div className="border-b border-border/80">
                <div className="flex gap-6 -mb-px text-sm font-medium">
                  <button
                    onClick={() => setActiveTab('sinopsis')}
                    className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                      activeTab === 'sinopsis'
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <BookOpen className="size-3.5" />
                    Reseña y Sinopsis
                  </button>

                  <button
                    onClick={() => setActiveTab('ficha')}
                    className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                      activeTab === 'ficha'
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Layers className="size-3.5" />
                    Ficha Técnica
                  </button>

                  {book.relatedTitles && (
                    <button
                      onClick={() => setActiveTab('relacionados')}
                      className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                        activeTab === 'relacionados'
                          ? 'border-primary text-primary font-semibold'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Sparkles className="size-3.5" />
                      También te puede interesar
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Contents with Animated Transitions */}
              <div className="pt-1 min-h-[160px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'sinopsis' && (
                    <motion.div
                      key="sinopsis"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground font-sans whitespace-pre-line">
                        {book.synopsis || 'Obra destacada del catálogo oficial de Editorial Horizonte.'}
                      </p>

                      {book.thematic && (
                        <div className="pt-2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                            Temáticas:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {book.thematic.split(',').map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2.5 py-0.5 rounded-md bg-muted text-foreground/80 font-medium"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'ficha' && (
                    <motion.div
                      key="ficha"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {/* ISBN */}
                      {book.isbn && (
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                          <div className="flex items-center gap-2">
                            <Hash className="size-4 text-primary shrink-0" />
                            <div>
                              <span className="text-[11px] text-muted-foreground block font-medium">ISBN</span>
                              <span className="font-mono text-xs font-semibold text-foreground select-all">
                                {book.isbn}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            onClick={handleCopyIsbn}
                            title="Copiar ISBN"
                          >
                            {copiedIsbn ? (
                              <Check className="size-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="size-3.5 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Formato y páginas */}
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/20">
                        <BookOpen className="size-4 text-primary shrink-0" />
                        <div>
                          <span className="text-[11px] text-muted-foreground block font-medium">Formato y Páginas</span>
                          <span className="text-xs font-semibold text-foreground">
                            {book.formatDescription || `${book.pages || 160} páginas`}
                          </span>
                        </div>
                      </div>

                      {/* Año / Edición */}
                      {book.publicationYear && (
                        <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/20">
                          <Calendar className="size-4 text-primary shrink-0" />
                          <div>
                            <span className="text-[11px] text-muted-foreground block font-medium">Año de Edición</span>
                            <span className="text-xs font-semibold text-foreground">
                              {book.publicationYear}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Idioma */}
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/20">
                        <Globe className="size-4 text-primary shrink-0" />
                        <div>
                          <span className="text-[11px] text-muted-foreground block font-medium">Idioma</span>
                          <span className="text-xs font-semibold text-foreground capitalize">
                            {book.language}
                          </span>
                        </div>
                      </div>

                      {/* Público objetivo */}
                      {book.audience && (
                        <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/20">
                          <Users className="size-4 text-primary shrink-0" />
                          <div>
                            <span className="text-[11px] text-muted-foreground block font-medium">Público Objetivo</span>
                            <span className="text-xs font-semibold text-foreground capitalize">
                              {book.audience}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Editorial */}
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/20">
                        <ShieldCheck className="size-4 text-primary shrink-0" />
                        <div>
                          <span className="text-[11px] text-muted-foreground block font-medium">Editorial</span>
                          <span className="text-xs font-semibold text-foreground">
                            Editorial Horizonte (Lima, Perú)
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'relacionados' && book.relatedTitles && (
                    <motion.div
                      key="relacionados"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-3"
                    >
                      <p className="text-xs text-muted-foreground">
                        Títulos recomendados en el catálogo. Haz clic para explorarlos directamente:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {book.relatedTitles.split(/–|—|;/).map((rec, i) => {
                          const title = rec.trim();
                          if (!title) return null;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => onSelectRelatedTitle?.(title)}
                              className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary border border-primary/20 hover:border-primary text-xs font-medium text-foreground hover:text-primary-foreground transition-all cursor-pointer shadow-2xs text-left"
                            >
                              <BookOpen className="size-3.5 text-primary group-hover:text-primary-foreground shrink-0 transition-colors" />
                              <span>{title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ─── Trust and Logistics micro-bar ─── */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Truck className="size-3.5 text-primary shrink-0" />
                  <span>Envíos a todo el Perú</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span>Retiro en Jr. Camaná 868</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-primary shrink-0" />
                  <span>Garantía Editorial Oficial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}