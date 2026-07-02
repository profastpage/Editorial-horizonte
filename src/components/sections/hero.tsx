// ============================================================================
//  HERO — Editorial Horizonte (DELUXE con imagen de fondo)
//  - Imagen full-bleed inmersiva WebP (desktop + mobile)
//  - Textura papel + luz cálida + círculos desenfocados
//  - Tipografía Playfair Display + Inter
//  - "vuelven" en terracota #C05A42
//  - Métricas horizontales con números enormes
//  - Botones píldora (radio 50px)
//  - Libro destacado flotante con animación
// ============================================================================
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookCover } from '@/components/book-cover'
import { formatPrice } from '@/lib/utils'
import type { BookWithRelations } from '@/lib/types'

interface HeroProps {
  featuredBook?: BookWithRelations
}

const STATS = [
  { num: '12', label: 'Títulos publicados' },
  { num: '4',  label: 'Librerías aliadas' },
  { num: '10', label: 'Autores en catálogo' },
]

export function Hero({ featuredBook }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 180])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center overflow-hidden pt-24 pb-16"
    >
      {/* === FONDO FULL-BLEED INMERSIVO === */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/hero/hero-mobile.webp"
            type="image/webp"
          />
          <source
            media="(min-width: 769px)"
            srcSet="/hero/hero-desktop.webp"
            type="image/webp"
          />
          <img
            src="/hero/hero-desktop.webp"
            alt="Editorial Horizonte — atelier literario cálido"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </picture>

        {/* Overlay sutil para legibilidad */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(248,245,240,0.96) 0%, rgba(248,245,240,0.78) 38%, rgba(248,245,240,0.25) 70%, rgba(248,245,240,0.05) 100%)',
          }}
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(248,245,240,0.92) 0%, rgba(248,245,240,0.7) 35%, rgba(248,245,240,0.45) 65%, rgba(248,245,240,0.85) 100%)',
          }}
        />

        {/* Círculos desenfocados decorativos */}
        <motion.div
          className="blur-circle absolute top-32 -left-20 w-[28rem] h-[28rem]"
          style={{ background: 'radial-gradient(circle, rgba(192, 90, 66, 0.35), transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.55, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="blur-circle absolute bottom-20 -right-20 w-[32rem] h-[32rem]"
          style={{ background: 'radial-gradient(circle, rgba(191, 160, 118, 0.45), transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* === CONTENIDO === */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-10 lg:px-16 xl:px-20"
      >
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* --- IZQUIERDA: Texto + métricas --- */}
          <div className="lg:col-span-7 text-center lg:text-left">

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
              className="mt-6 text-base sm:text-lg text-foreground/75 max-w-xl mx-auto lg:mx-0 leading-[1.7]"
            >
              Publicamos el fondo editorial propio de Horizonte y distribuimos obras de
              terceras editoriales con consignación en librerías aliadas. Cada libro es
              una apuesta por la literatura latinoamericana viva.
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
                  <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                </Button>
              </Link>
            </motion.div>

            {/* Métricas horizontales */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 flex items-stretch justify-center lg:justify-start gap-0"
            >
              {STATS.map((s, idx) => (
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

          {/* --- DERECHA: Libro destacado flotante --- */}
          {featuredBook && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateZ: -3 }}
              animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
              transition={{ duration: 1, delay: 0.4, type: 'spring' }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <Link href={`/libro/${featuredBook.slug}`} className="relative block">
                <div className="absolute inset-0 -m-12 bg-primary/5 blur-3xl rounded-full" />

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35), 0 10px 20px -8px rgba(192, 90, 66, 0.2)',
                  }}
                >
                  <BookCover
                    title={featuredBook.title}
                    authorName={featuredBook.authors?.[0]?.fullName}
                    coverColor={featuredBook.metaTitle || '#7c2d12'}
                    size="xl"
                  />
                </motion.div>

                {/* Etiqueta flotante */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="absolute -bottom-6 -left-6 sm:-left-12 bg-white border border-primary/15 shadow-lg rounded-2xl px-4 py-3 max-w-[220px]"
                >
                  <div className="text-[10px] uppercase tracking-editorial text-muted-foreground mb-1">
                    Novedad destacada
                  </div>
                  <div className="font-serif font-semibold text-sm leading-tight line-clamp-2">
                    {featuredBook.title}
                  </div>
                  <div className="text-sm text-primary mt-1.5 font-semibold">
                    {formatPrice(featuredBook.pricePen, 'PEN')}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Indicador scroll */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground z-10"
      >
        <span className="text-[10px] uppercase tracking-editorial">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-6 bg-gradient-to-b from-primary/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}
