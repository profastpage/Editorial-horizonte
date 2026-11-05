'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex h-[42vh] sm:h-[48vh] min-h-[340px] max-h-[460px] items-center justify-center overflow-hidden pt-16"
    >
      {/* Background WebP Image */}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(max-width: 768px)" srcSet="/hero-mobile.webp" />
        <img
          src="/hero-desktop.webp"
          alt="Editorial Horizonte Fondo"
          className="w-full h-full object-cover object-center brightness-[0.82] dark:brightness-[0.65]"
        />
      </picture>

      {/* Gentle gradient overlay for contrast */}
      <div className="absolute inset-0 bg-black/35 dark:bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/30" />

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
            className="gap-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-6 rounded-2xl shadow-xl text-sm sm:text-base transition-all hover:scale-102 active:scale-98"
          >
            <Link href="/catalogo">
              <span>Explorar Catálogo</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Clean bottom line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-border/60" />
    </section>
  );
}
