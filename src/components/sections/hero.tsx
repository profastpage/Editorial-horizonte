// ============================================================================
//  HERO — Editorial Horizonte
//  Hero cinematográfico con tipografía serif gigante, libro destacado flotante
//  y scroll-driven micro-animations (framer-motion).
//  Botones CTA link a /catalogo y /nosotros (subpáginas).
// ============================================================================
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowDown, BookOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookCover } from '@/components/book-cover'
import type { BookWithRelations } from '@/lib/types'

interface HeroProps {
  featuredBook?: BookWithRelations
}

export function Hero({ featuredBook }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden gradient-hero pt-20"
    >
      {/* Background ornamental */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-[0.04] blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-[0.04] blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.04, 0.06, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Texto */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/60 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-3 h-3 text-primary" strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-editorial text-muted-foreground">
                Editorial independiente · Lima, Perú
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[0.95] tracking-tight text-balance"
            >
              Libros que
              <br />
              <span className="italic text-primary">vuelven</span> a casa
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed text-pretty"
            >
              Publicamos el fondo editorial propio de Horizonte y distribuimos obras de
              terceras editoriales con consignación en librerías aliadas. Cada libro que
              cruzas estas páginas es una apuesta por la literatura latinoamericana viva.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link href="/catalogo">
                <Button size="lg" className="h-12 px-8 text-base font-medium">
                  <BookOpen className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Explorar catálogo
                </Button>
              </Link>
              <Link href="/nosotros">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium">
                  Conocer la editorial
                </Button>
              </Link>
            </motion.div>

            {/* Stats rápidas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-14 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0"
            >
              {[
                { num: '12', label: 'Títulos publicados' },
                { num: '4', label: 'Librerías aliadas' },
                { num: '10', label: 'Autores en catálogo' },
              ].map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="font-serif text-3xl font-semibold text-primary">{s.num}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Libro destacado */}
          {featuredBook && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateZ: -3 }}
              animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
              transition={{ duration: 1, delay: 0.4, type: 'spring' }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <Link href={`/libro/${featuredBook.slug}`} className="relative block">
                {/* Halo decorativo */}
                <div className="absolute inset-0 -m-12 bg-primary/5 blur-3xl rounded-full" />

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
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
                  className="absolute -bottom-6 -left-6 sm:-left-12 bg-background border border-border shadow-lg rounded-sm px-4 py-3 max-w-[200px]"
                >
                  <div className="text-[10px] uppercase tracking-editorial text-muted-foreground mb-1">
                    Novedad destacada
                  </div>
                  <div className="font-serif font-semibold text-sm leading-tight line-clamp-2">
                    {featuredBook.title}
                  </div>
                  <div className="text-xs text-primary mt-1 font-medium">
                    S/ {featuredBook.pricePen.toFixed(2)}
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-[10px] uppercase tracking-editorial">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
