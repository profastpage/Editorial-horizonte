'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[420px] h-[50vh] sm:h-[55vh] max-h-[580px] items-center justify-center overflow-hidden pt-16 sm:pt-20"
    >
      {/* Background WebP Image — Full Bleed from the top edge */}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(max-width: 768px)" srcSet="/hero-mobile.webp" />
        <img
          src="/hero-desktop.webp"
          alt="Editorial Horizonte Fondo"
          className="w-full h-full object-cover object-center brightness-[0.72] dark:brightness-[0.55]"
        />
      </picture>

      {/* Top subtle vignette for transparent navbar readability */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 via-black/30 to-transparent pointer-events-none" />

      {/* Soft dark overlay */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 pointer-events-none" />

      {/* Bottom smooth bleed into page background (warm cream/canvas) */}
      <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />

      {/* Central CTA button to subpage catalog */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-sm"
        >
          <BookOpen className="size-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Fondo Editorial Oficial
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center pt-2"
        >
          <Button
            size="lg"
            asChild
            className="gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-6 rounded-2xl shadow-xl text-sm sm:text-base transition-all hover:scale-102 active:scale-98 border border-white/10"
          >
            <Link href="/catalogo">
              <span>Explorar Catálogo</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
