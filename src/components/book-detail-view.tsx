'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CartPanel } from '@/components/cart';
import { CheckoutDialog } from '@/components/checkout';
import { BookCard } from '@/components/book-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Zap,
  BookOpen,
  Calendar,
  Hash,
  Globe,
  Copy,
  Check,
  Plus,
  Minus,
  Truck,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Layers,
  ArrowLeft,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import type { BookWithDetails } from '@/lib/types';

interface BookDetailViewProps {
  book: BookWithDetails;
  relatedBooks: BookWithDetails[];
}

export function BookDetailView({ book, relatedBooks }: BookDetailViewProps) {
  const { addToCart, setCheckoutOpen } = useAppStore();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [copiedIsbn, setCopiedIsbn] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'sinopsis' | 'ficha'>('sinopsis');

  const authors = book.authors.map((a) => a.author.name).join(', ') || 'Editorial Horizonte';
  const outOfStock = book.totalStock === 0;
  const isLowStock = book.totalStock > 0 && book.totalStock <= 10;
  const collectionName = book.series || book.categories[0]?.category?.name || 'Colección Horizonte';

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

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast({
      title: 'Enlace copiado al portapapeles',
      description: 'Ya puedes compartir este libro por WhatsApp o redes.',
    });
    setTimeout(() => setCopiedLink(false), 2000);
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
    setCheckoutOpen(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Editorial Horizonte, deseo consultar por el libro "${book.title}" (S/ ${book.price.toFixed(2)}). ¿Tienen disponibilidad para envío o retiro?`
  );
  const whatsappUrl = `https://wa.me/51989017684?text=${whatsappMessage}`;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ─── Breadcrumbs & Volver ─── */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Link
                href="/#catalogo"
                className="inline-flex items-center gap-1.5 font-medium hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                <span>Volver al catálogo</span>
              </Link>
              <span>/</span>
              <span className="text-foreground/70">{collectionName}</span>
              <span>/</span>
              <span className="text-foreground font-semibold line-clamp-1">{book.title}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-xs rounded-lg"
            >
              {copiedLink ? <Check className="size-3.5 text-emerald-500" /> : <Share2 className="size-3.5" />}
              {copiedLink ? '¡Enlace copiado!' : 'Compartir libro'}
            </Button>
          </div>

          {/* ─── Contenedor Principal (2 Columnas) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 lg:gap-14 items-start">
            {/* ─── COLUMNA IZQUIERDA: Portada 3D Limpia (Sin Recortes) ─── */}
            <div className="relative flex flex-col items-center">
              <div className="relative w-full rounded-2xl border border-border/70 bg-gradient-to-b from-muted/60 via-muted/30 to-muted/50 p-6 sm:p-10 overflow-hidden shadow-sm">
                {/* Resplandor ambiental de la portada */}
                {book.coverUrl && (
                  <div
                    className="absolute inset-0 opacity-20 blur-3xl scale-125 pointer-events-none"
                    style={{
                      backgroundImage: `url(${book.coverUrl})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  />
                )}

                {/* Badges superiores */}
                <div className="relative z-10 w-full flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-background/90 backdrop-blur-sm border border-border/60 text-foreground">
                    {book.originType === 'PROPIO' ? 'Fondo Propio' : 'Terceros'}
                  </span>
                  {book.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 backdrop-blur-sm shadow-sm">
                      <Star className="size-3 fill-current" />
                      Destacado
                    </span>
                  )}
                </div>

                {/* Portada física 3D Editorial */}
                <div className="relative z-10 my-4 flex items-center justify-center">
                  <div className="relative group max-w-[280px] sm:max-w-[320px] transition-transform duration-500 hover:scale-[1.03]">
                    <div className="relative overflow-hidden rounded-r-md rounded-l-xs shadow-[0_20px_45px_-10px_rgba(0,0,0,0.35)] dark:shadow-[0_22px_55px_-10px_rgba(0,0,0,0.7)] border border-black/10 bg-card">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={`Portada de ${book.title}`}
                          className="w-full h-auto max-h-[440px] object-contain block select-none"
                        />
                      ) : (
                        <div className="w-64 h-92 flex flex-col items-center justify-center p-6 text-center bg-muted text-muted-foreground">
                          <BookOpen className="size-16 mb-4 opacity-40" />
                          <span className="font-serif text-xl font-bold line-clamp-3">{book.title}</span>
                          <span className="text-xs mt-2 opacity-80">{authors}</span>
                        </div>
                      )}

                      {/* Lomo y textura de libro real */}
                      <div className="absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none rounded-l-xs" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-40" />
                    </div>
                  </div>
                </div>

                {/* Formato y Medidas badge */}
                <div className="relative z-10 w-full mt-6 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-background/85 backdrop-blur-sm border border-border/60 text-muted-foreground">
                    <BookOpen className="size-3.5 text-primary" />
                    {book.formatDescription || `${book.pages || 160} páginas · Tapa blanda`}
                  </span>
                </div>
              </div>

              {/* Garantía y Logística micro-cards */}
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card/60">
                  <Truck className="size-5 text-primary shrink-0" />
                  <div className="text-xs">
                    <strong className="block text-foreground font-semibold">Envíos a todo el Perú</strong>
                    <span className="text-muted-foreground">Lima Metropolitana (24-48h) y Provincias por Shalom / Olva.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card/60">
                  <MapPin className="size-5 text-primary shrink-0" />
                  <div className="text-xs">
                    <strong className="block text-foreground font-semibold">Retiro en librería de Lima Centro</strong>
                    <span className="text-muted-foreground">Jr. Camaná 868, Lima. De lunes a sábado de 10:00 a 19:00 hrs.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card/60">
                  <ShieldCheck className="size-5 text-primary shrink-0" />
                  <div className="text-xs">
                    <strong className="block text-foreground font-semibold">Edición Oficial Garantizada</strong>
                    <span className="text-muted-foreground">Fondo editorial fundado en 1970. Ejemplar nuevo y sellado.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── COLUMNA DERECHA: Datos Editoriales y Caja de Compra ─── */}
            <div className="space-y-8">
              <div className="space-y-4">
                {/* Colección / Serie */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-semibold uppercase tracking-wider py-1 px-3">
                    {collectionName}
                  </Badge>
                  {book.thematic && (
                    <span className="text-xs text-muted-foreground font-medium">
                      · {book.thematic.split(',')[0]}
                    </span>
                  )}
                </div>

                {/* Título en gran formato */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                  {book.title}
                </h1>

                {/* Autor */}
                <div className="flex items-center gap-2.5 text-base sm:text-lg text-muted-foreground font-medium pt-1">
                  <span>Por <strong className="text-foreground font-bold">{authors}</strong></span>
                  {book.authors[0]?.author?.nationality && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted font-normal text-foreground">
                      {book.authors[0].author.nationality}
                    </span>
                  )}
                </div>
              </div>

              {/* ─── CAJA DE COMPRA (BUY BOX) ─── */}
              <div className="rounded-2xl border-2 border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-6">
                <div className="flex items-baseline justify-between flex-wrap gap-4 pb-4 border-b border-border/60">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                      Precio Oficial
                    </span>
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                      S/ {book.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Stock pill */}
                  <div>
                    {outOfStock ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-3 py-1.5 rounded-full">
                        <span className="size-2 rounded-full bg-destructive" />
                        Agotado
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
                        <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                        ¡Últimas {book.totalStock} unidades!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        En stock ({book.totalStock} disponibles)
                      </span>
                    )}
                  </div>
                </div>

                {/* Stepper + Botones de Compra */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Stepper de Cantidad */}
                    <div className="flex items-center justify-between border rounded-xl px-3 py-1.5 bg-background shrink-0 w-full sm:w-36">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        disabled={quantity <= 1 || outOfStock}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="font-bold text-base px-2 tabular-nums">
                        {quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        disabled={quantity >= book.totalStock || outOfStock}
                        onClick={() => setQuantity((q) => Math.min(book.totalStock, q + 1))}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>

                    {/* Botón Agregar al carrito */}
                    <Button
                      size="lg"
                      className="flex-1 gap-2 font-bold text-sm sm:text-base py-6 shadow-sm rounded-xl transition-all"
                      disabled={outOfStock}
                      onClick={handleAddToCart}
                    >
                      {isAdded ? (
                        <>
                          <Check className="size-5 text-emerald-300" />
                          ¡Agregado al pedido!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="size-5" />
                          Agregar al carrito
                        </>
                      )}
                    </Button>

                    {/* Botón Comprar ahora */}
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 font-bold text-sm sm:text-base py-6 rounded-xl border-primary text-primary hover:bg-primary/10 shrink-0"
                      disabled={outOfStock}
                      onClick={handleBuyNow}
                    >
                      <Zap className="size-5" />
                      Comprar ahora
                    </Button>
                  </div>

                  {/* Botón WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                  >
                    <MessageCircle className="size-4" />
                    <span>¿Tienes dudas? Consultar disponibilidad por WhatsApp al 989 017 684</span>
                  </a>
                </div>
              </div>

              {/* ─── PESTAÑAS: Reseña y Sinopsis / Ficha Técnica ─── */}
              <div className="space-y-6">
                <div className="flex gap-6 border-b border-border/80 text-base font-semibold">
                  <button
                    onClick={() => setActiveTab('sinopsis')}
                    className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
                      activeTab === 'sinopsis'
                        ? 'border-primary text-primary font-bold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <BookOpen className="size-4" />
                    Reseña y Sinopsis
                  </button>

                  <button
                    onClick={() => setActiveTab('ficha')}
                    className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
                      activeTab === 'ficha'
                        ? 'border-primary text-primary font-bold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Layers className="size-4" />
                    Ficha Técnica Completa
                  </button>
                </div>

                {/* Contenido Pestaña 1: Sinopsis */}
                {activeTab === 'sinopsis' && (
                  <div className="space-y-6">
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                      <p className="text-base sm:text-lg leading-relaxed text-foreground/90 font-sans whitespace-pre-line">
                        {book.synopsis || 'Obra destacada del catálogo oficial de Editorial Horizonte.'}
                      </p>
                    </div>

                    {book.thematic && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                          Clasificación Temática:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {book.thematic.split(',').map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1 rounded-lg bg-muted text-foreground font-medium border border-border/50"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Contenido Pestaña 2: Ficha Técnica */}
                {activeTab === 'ficha' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* ISBN */}
                    {book.isbn && (
                      <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/20">
                        <div className="flex items-center gap-3">
                          <Hash className="size-5 text-primary shrink-0" />
                          <div>
                            <span className="text-xs text-muted-foreground block font-medium">ISBN</span>
                            <span className="font-mono text-sm font-bold text-foreground select-all">
                              {book.isbn}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={handleCopyIsbn}
                          title="Copiar ISBN"
                        >
                          {copiedIsbn ? (
                            <Check className="size-4 text-emerald-500" />
                          ) : (
                            <Copy className="size-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Formato y páginas */}
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-muted/20">
                      <BookOpen className="size-5 text-primary shrink-0" />
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium">Formato y Páginas</span>
                        <span className="text-sm font-bold text-foreground">
                          {book.formatDescription || `${book.pages || 160} páginas · Tapa blanda`}
                        </span>
                      </div>
                    </div>

                    {/* Año de Edición */}
                    {book.publicationYear && (
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-muted/20">
                        <Calendar className="size-5 text-primary shrink-0" />
                        <div>
                          <span className="text-xs text-muted-foreground block font-medium">Año de Edición</span>
                          <span className="text-sm font-bold text-foreground">
                            {book.publicationYear}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Idioma */}
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-muted/20">
                      <Globe className="size-5 text-primary shrink-0" />
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium">Idioma</span>
                        <span className="text-sm font-bold text-foreground capitalize">
                          {book.language}
                        </span>
                      </div>
                    </div>

                    {/* Público Objetivo */}
                    {book.audience && (
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-muted/20">
                        <Users className="size-5 text-primary shrink-0" />
                        <div>
                          <span className="text-xs text-muted-foreground block font-medium">Público Objetivo</span>
                          <span className="text-sm font-bold text-foreground capitalize">
                            {book.audience}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Editorial */}
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-muted/20">
                      <ShieldCheck className="size-5 text-primary shrink-0" />
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium">Editorial</span>
                        <span className="text-sm font-bold text-foreground">
                          Editorial Horizonte (Lima, Perú)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── SECCIÓN INFERIOR: Obras Relacionadas ─── */}
          {relatedBooks.length > 0 && (
            <div className="mt-24 pt-12 border-t border-border/60">
              <div className="mb-8 flex items-baseline justify-between">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                    También te puede interesar
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Obras recomendadas de la misma colección o temáticas afines
                  </p>
                </div>

                <Link
                  href="/#catalogo"
                  className="text-sm font-medium text-primary hover:underline hidden sm:inline"
                >
                  Ver todo el catálogo →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                {relatedBooks.map((relBook) => (
                  <BookCard key={relBook.id} book={relBook} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartPanel />
      <CheckoutDialog />
    </div>
  );
}
