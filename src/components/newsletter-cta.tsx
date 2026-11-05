'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <section className="w-full py-16 sm:py-20 border-t border-b border-border/40 bg-muted/15">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="space-y-3">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
            Boletín Literario & Novedades
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Recibe novedades editoriales en tu correo
          </h2>

          <p className="mx-auto max-w-lg text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Lanzamientos oficiales de José María Arguedas, reediciones críticas, eventos culturales y nuevos títulos antes que nadie.
          </p>

          <div className="pt-4">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-6 py-3.5 text-primary text-sm font-semibold"
              >
                <CheckCircle2 className="size-4" />
                <span>¡Gracias por suscribirte! Te avisaremos de cada nuevo lanzamiento.</span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto items-stretch"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="h-11 flex-1 rounded-xl border border-border/80 bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-2xs"
                  aria-label="Correo electrónico"
                />
                <Button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shrink-0"
                >
                  Suscribirme
                </Button>
              </form>
            )}
            <p className="text-[11px] text-muted-foreground/70 mt-2.5">
              Sin spam. Puedes cancelar tu suscripción en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
