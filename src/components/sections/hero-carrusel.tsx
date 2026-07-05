// ============================================================================
//  HERO CARRUSEL — Editorial Horizonte (DELUXE VITRINA LITERARIA)
//  - Carrusel horizontal de portadas con efecto "estante" (rotación + sombra)
//  - 60% del ancho en desktop, full-bleed en mobile
//  - Flechas circulares minimalistas + dots sutiles
//  - Fondo: papel envejecido + lomo de biblioteca
//  - Texto a la izquierda, carrusel a la derecha
// ============================================================================
'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookCover } from '@/components/book-cover'
import { formatPrice } from '@/lib/utils'
import type { BookWithRelations } from '@/lib/types'

interface HeroCarruselProps {
  books: BookWithRelations[]
}

// Genera rotación aleatoria estable por bookId (entre -2deg y 4deg)
function getRotation(id: string): number {
  const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
  return ((seed % 60) / 10) - 2 // -2 a 4 deg
}

export function HeroCarrusel({ books }: HeroCarruselProps) {
  const featured = books.slice(0, Math.min(8, books.length))
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
  })
  const [selected, setSelected] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    // setScrollSnaps es necesario cuando emblaApi se inicializa
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi])

  // Auto-play cada 5s
  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(() => emblaApi.scrollNext(), 5000)
    return () => clearInterval(interval)
  }, [emblaApi])

  const currentBook = featured[selected]

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-24 pb-16">
      {/* === FONDO PAPEL ENVEJECIDO + LOMO BIBLIOTECA === */}
      <div className="absolute inset-0 z-0">
        {/* Base papel algodón */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #f8f5f0 0%, #faf8f4 40%, #f5f0eb 70%, #f8f5f0 100%)',
          }}
        />
        {/* Textura lomo biblioteca — líneas verticales sutiles */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0px, transparent 60px, #5A5A5A 60px, #5A5A5A 61px, transparent 61px, transparent 120px)',
          }}
        />
        {/* Luz cálida esquina superior derecha */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 85% 15%, rgba(255, 220, 180, 0.4) 0%, transparent 60%)',
          }}
        />
        {/* Halo terracota inferior izquierdo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 10% 90%, rgba(192, 90, 66, 0.1) 0%, transparent 60%)',
          }}
        />

        {/* Círculos desenfocados decorativos */}
        <motion.div
          className="blur-circle absolute top-20 -left-20 w-[28rem] h-[28rem]"
          style={{ background: 'radial-gradient(circle, rgba(192, 90, 66, 0.25), transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.55, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="blur-circle absolute bottom-20 -right-20 w-[32rem] h-[32rem]"
          style={{ background: 'radial-gradient(circle, rgba(191, 160, 118, 0.35), transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* === CONTENIDO === */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* --- IZQUIERDA: Texto + métricas --- */}
          <div className="lg:col-span-5 text-center lg:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/25 bg-card/70 backdrop-blur-md mb-8 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              <span className="text-[11px] uppercase tracking-editorial text-muted-foreground font-medium">
                Editorial independiente · Lima, Perú
              </span>
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-serif font-bold leading-[1.02] tracking-tight text-balance"
              style={{
                fontFamily: 'var(--font-fraunces), Georgia, serif',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                letterSpacing: '-0.02em',
              }}
            >
              Libros que
              <br />
              <span className="italic" style={{ color: '#C05A42' }}>
                vuelven
              </span>{' '}
              a casa
            </motion.h1>

            {/* Línea decorativa dorada */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden lg:block h-px w-24 mt-6 mx-auto lg:mx-0"
              style={{ background: 'linear-gradient(90deg, #BFA076, transparent)' }}
            />

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-base sm:text-lg text-foreground/70 max-w-lg mx-auto lg:mx-0 leading-[1.7]"
            >
              Publicamos el fondo editorial propio de Horizonte y distribuimos obras de
              terceras editoriales con consignación en librerías aliadas.
            </motion.p>

            {/* Botones píldora */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/catalogo">
                <Button
                  size="lg"
                  className="btn-pill h-14 px-9 text-base font-medium shadow-md"
                >
                  <BookOpen className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Explorar catálogo
                </Button>
              </Link>
              <Link href="/nosotros">
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-pill h-14 px-9 text-base font-medium border-primary/30 bg-card/60 backdrop-blur-md hover:bg-card/90"
                >
                  Conocer la editorial
                </Button>
              </Link>
            </motion.div>

            {/* === MÉTRICAS HORIZONTALES === */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 flex items-stretch justify-center lg:justify-start gap-0"
            >
              {[
                { num: '12', label: 'Títulos publicados' },
                { num: '4',  label: 'Librerías aliadas' },
                { num: '10', label: 'Autores en catálogo' },
              ].map((s, idx) => (
                <div key={s.label} className="flex items-center">
                  <div
                    className="card-deluxe group px-5 py-4 bg-white/80 backdrop-blur-md border border-primary/10 text-center"
                    style={{ borderRadius: '20px' }}
                  >
                    <div
                      className="font-serif font-bold leading-none"
                      style={{
                        color: '#C05A42',
                        fontFamily: 'var(--font-fraunces), Georgia, serif',
                        fontSize: '3rem',
                      }}
                    >
                      {s.num}
                    </div>
                    <div className="text-[0.7rem] uppercase tracking-[0.08em] text-muted-foreground mt-2 leading-tight font-medium">
                      {s.label}
                    </div>
                  </div>
                  {idx < 2 && (
                    <div className="w-px h-16 mx-3 bg-gradient-to-b from-transparent via-[#BFA076]/40 to-transparent" />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* --- DERECHA: Carrusel de portadas --- */}
          <div className="lg:col-span-7 mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
              className="relative"
            >
              {/* Contenedor del carrusel */}
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex items-center" style={{ minHeight: '420px' }}>
                  {featured.map((book, idx) => (
                    <div
                      key={book.id}
                      className="flex-[0_0_70%] min-w-0 sm:flex-[0_0_55%] lg:flex-[0_0_50%] pl-4"
                    >
                      <Link href={`/libro/${book.slug}`} className="block group">
                        <motion.div
                          className="relative"
                          whileHover={{
                            y: -12,
                            scale: 1.03,
                            rotate: 0,
                            transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] },
                          }}
                          style={{
                            rotate: `${getRotation(book.id)}deg`,
                            boxShadow: '0 20px 40px -12px rgba(0,0,0,0.3), 0 10px 20px -8px rgba(192, 90, 66, 0.15)',
                            borderRadius: '8px',
                          }}
                        >
                          <BookCover
                            title={book.title}
                            authorName={book.authors?.[0]?.fullName}
                            coverColor={book.metaTitle || '#7c2d12'}
                            size="xl"
                            className="w-full h-auto"
                          />

                          {/* Overlay hover con género/año */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-6">
                            <div className="text-center text-white">
                              <div className="text-[10px] uppercase tracking-[0.15em] opacity-90">
                                {book.categories?.[0]?.name ?? 'Literatura'}
                              </div>
                              <div className="text-xs opacity-80 mt-1">
                                {book.publicationDate
                                  ? new Date(book.publicationDate).getFullYear()
                                  : ''}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flechas de navegación circulares */}
              <button
                onClick={scrollPrev}
                aria-label="Anterior"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-primary/30 bg-white/70 backdrop-blur-md flex items-center justify-center hover:bg-white hover:border-primary/60 transition-all duration-300 hover:scale-110 shadow-md z-10"
              >
                <ArrowLeft className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Siguiente"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-primary/30 bg-white/70 backdrop-blur-md flex items-center justify-center hover:bg-white hover:border-primary/60 transition-all duration-300 hover:scale-110 shadow-md z-10"
              >
                <ArrowRight className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </button>

              {/* Dots indicadores */}
              <div className="flex justify-center gap-2 mt-8">
                {scrollSnaps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollTo(idx)}
                    aria-label={`Ir a slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      selected === idx
                        ? 'w-8 h-2 bg-primary'
                        : 'w-2 h-2 bg-primary/25 hover:bg-primary/50'
                    }`}
                  />
                ))}
              </div>

              {/* Info del libro actual */}
              <AnimatePresence mode="wait">
                {currentBook && (
                  <motion.div
                    key={currentBook.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mt-6"
                  >
                    <Link href={`/libro/${currentBook.slug}`} className="group">
                      <h3
                        className="font-serif font-semibold text-lg group-hover:text-primary transition-colors"
                        style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
                      >
                        {currentBook.title}
                      </h3>
                      {currentBook.authors?.[0]?.fullName && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentBook.authors[0].fullName}
                        </p>
                      )}
                      <p className="text-sm font-medium text-primary mt-2">
                        {formatPrice(currentBook.pricePen, 'PEN')}
                      </p>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
