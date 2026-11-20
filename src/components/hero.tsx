'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="inicio" className="relative flex flex-col w-full overflow-hidden">
      {/* ─── 1. BANNER VISUAL CON ILUSTRACIÓN HISTÓRICA OFICIAL ─── */}
      <div className="relative w-full aspect-[4/4.8] sm:aspect-[16/9] lg:h-[72vh] lg:max-h-[740px] flex items-end justify-center overflow-hidden pt-16 sm:pt-20">
        <picture className="absolute inset-0 w-full h-full">
          <source media="(max-width: 768px)" srcSet="/hero-mobile.webp" />
          <img
            src="/hero-desktop.webp"
            alt="Editorial Horizonte - Comprometidos con la difusión del pensamiento y el arte peruano y latinoamericano"
            className="w-full h-full object-cover object-top sm:object-center brightness-[0.96] dark:brightness-[0.78] contrast-[1.02]"
            loading="eager"
          />
        </picture>

        {/* Sutil viñeta superior para legibilidad de la barra de navegación */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Degradado inferior suave hacia el fondo */}
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />

        {/* CTA en Desktop: ubicado en la zona inferior libre entre Vallejo y Arguedas, sin tocar texto ni rostros */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="hidden sm:block relative z-10 pb-8 sm:pb-12 text-center"
        >
          <Button
            size="lg"
            asChild
            className="gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-6 rounded-2xl shadow-[0_8px_25px_-5px_rgba(4,120,87,0.5)] text-base transition-all hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-xs"
          >
            <Link href="/catalogo">
              <span>Explorar Catálogo</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* ─── 2. CTA EN MOBILE: DEBAJO DE LA ILUSTRACIÓN (CERO SOLAPAMIENTOS DE ROSTROS) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="sm:hidden px-4 pt-3 pb-6 text-center bg-background border-b border-border/40"
      >
        <Button
          size="lg"
          asChild
          className="w-full max-w-xs mx-auto gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-5 rounded-xl shadow-md text-sm transition-all active:scale-95"
        >
          <Link href="/catalogo">
            <span>Explorar Catálogo</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
