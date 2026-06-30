// ============================================================================
//  HERO — Editorial Horizonte (DELUXE REDESIGN)
//  - Imagen full-bleed inmersiva (desktop + mobile WebP)
//  - Textura papel de algodón + luz cálida
//  - Círculos desenfocados decorativos
//  - Tipografía Playfair Display + Inter
//  - Palabra "vuelven" en terracota #C05A42
//  - Stats en tarjetas circulares con hover lift
//  - Botones píldora (radio 50px)
//  - Padding +40% para sensación de lujo
// ============================================================================
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      className="relative min-h-[100svh] flex items-center overflow-hidden pt-20 pb-12"
    >
      {/* === FONDO FULL-BLEED INMERSIVO === */}
      <div className="absolute inset-0 z-0">
        {/* Desktop: hero-desktop.webp (1920x1080 landscape) */}
        {/* Mobile: hero-mobile.webp (900x1599 portrait) */}
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

        {/* Overlay sutil para legibilidad del texto encima */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(248,245,240,0.96) 0%, rgba(248,245,240,0.78) 38%, rgba(248,245,240,0.25) 70%, rgba(248,245,240,0.05) 100%)',
          }}
        />
        {/* Overlay mobile (gradient vertical para portrait) */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(248,245,240,0.92) 0%, rgba(248,245,240,0.7) 35%, rgba(248,245,240,0.45) 65%, rgba(248,245,240,0.85) 100%)',
          }}
        />

        {/* Círculos desenfocados decorativos — calidez */}
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
        <div className="max-w-3xl">

          {/* Badge superior */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/25 bg-card/70 backdrop-blur-md mb-10 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <span className="text-[11px] uppercase tracking-editorial text-muted-foreground font-medium">
              Editorial independiente · Lima, Perú
            </span>
          </motion.div>

          {/* Título principal — Playfair Display */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-semibold leading-[1.02] tracking-tight text-balance"
            style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
          >
            Libros que
            <br />
            <span
              className="italic"
              style={{ color: '#C05A42' }}
            >
              vuelven
            </span>{' '}
            a casa
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-lg sm:text-xl text-foreground/75 max-w-xl leading-relaxed text-pretty"
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
            className="mt-12 flex flex-col sm:flex-row gap-4"
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

          {/* Stats — tarjetas circulares con hover lift */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 grid grid-cols-3 gap-5 max-w-xl"
          >
            {STATS.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + idx * 0.1 }}
                className="card-deluxe group flex flex-col items-center text-center p-6 bg-card/65 backdrop-blur-md border border-primary/15"
                style={{ borderRadius: '24px' }}
                whileHover={{ y: -6 }}
              >
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-full mb-3 font-serif text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(192, 90, 66, 0.15), rgba(191, 160, 118, 0.15))',
                    color: '#C05A42',
                    fontFamily: 'var(--font-fraunces), Georgia, serif',
                  }}
                >
                  {s.num}
                </div>
                <div className="text-[11px] uppercase tracking-editorial text-muted-foreground leading-tight">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Indicador scroll inferior */}
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
