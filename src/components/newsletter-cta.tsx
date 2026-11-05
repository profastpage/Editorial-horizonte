'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
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
    <section className="relative w-full overflow-hidden bg-primary py-16 sm:py-20 text-primary-foreground">
      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-4"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-xs font-semibold tracking-widest text-primary-foreground/75 uppercase"
          >
            Boletín Oficial
          </motion.p>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="font-serif text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl lg:text-4xl"
          >
            Recibe novedades editoriales en tu correo
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto max-w-lg text-sm sm:text-base text-primary-foreground/85 leading-relaxed"
          >
            Suscríbete a nuestro boletín y entérate de todas las novedades (lanzamientos, eventos y más).
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="pt-4">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground/15 px-6 py-3.5 text-primary-foreground text-sm font-semibold"
              >
                <Mail className="h-4 w-4" />
                <span>¡Gracias por suscribirte! Recibirás nuestras novedades.</span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-center max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="h-11 w-full rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40"
                  aria-label="Correo electrónico"
                />
                <Button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90 shrink-0"
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
