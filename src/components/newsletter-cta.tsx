'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export function NewsletterCta() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-primary py-20">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, oklch(0.97 0.005 80) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Floating book icons */}
        <motion.div
          className="absolute top-8 left-[10%] text-primary-foreground/10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BookOpen className="h-16 w-16" />
        </motion.div>
        <motion.div
          className="absolute bottom-8 right-[12%] text-primary-foreground/10"
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        >
          <BookOpen className="h-12 w-12" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-[5%] text-primary-foreground/[0.06]"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        >
          <Sparkles className="h-20 w-20" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="mb-2 text-sm font-medium tracking-widest text-primary-foreground/70 uppercase"
          >
            Newsletter
          </motion.p>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="font-serif text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
          >
            Recibe novedades editoriales en tu correo
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mt-4 max-w-lg text-base text-primary-foreground/80"
          >
            Suscríbete a nuestro boletín y entérate de nuevas reimpresiones,
            lanzamientos y eventos de Editorial Horizonte.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="mt-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary-foreground/10 px-6 py-4 text-primary-foreground"
              >
                <Mail className="h-5 w-5" />
                <span className="font-medium">
                  ¡Gracias por suscribirte! Pronto recibiras nuestras novedades.
                </span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="h-11 w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40 sm:max-w-xs"
                  aria-label="Correo electrónico"
                />
                <Button
                  type="submit"
                  className="h-11 bg-primary-foreground text-primary hover:bg-primary-foreground/90 focus-visible:ring-primary-foreground/40"
                >
                  Suscribirme
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}