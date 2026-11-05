'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BookMarked, Users, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: ShieldCheck,
    title: 'Sello editorial consolidado',
    description: 'Con más de 40 años en el sector editorial difundiendo el pensamiento crítico y la memoria histórica.',
    color: 'from-amber-500/10 to-orange-500/5',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: BookMarked,
    title: 'Catálogo único',
    description: 'Títulos seleccionados que reflejan la diversidad de nuestro país y la complejidad de nuestra región.',
    color: 'from-emerald-500/10 to-teal-500/5',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Users,
    title: 'Equipo editorial profesional',
    description: 'Formado por artistas, diseñadores, correctores y editores nacionales y extranjeros.',
    color: 'from-sky-500/10 to-blue-500/5',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon: HeartHandshake,
    title: 'Atención personalizada',
    description: 'Te asesoramos con la calidez y la cercanía que nos caracteriza para tu biblioteca o investigación.',
    color: 'from-rose-500/10 to-pink-500/5',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Por qué elegirnos?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-sm sm:text-base">
            Más que una librería, un espacio para la creación y la difusión del libro peruano.
          </p>
        </motion.div>

        {/* Feature cards — 2x2 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8',
                  'transition-all duration-300 ease-out',
                  'hover:shadow-md hover:-translate-y-0.5',
                  'hover:border-primary/30'
                )}
              >
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                  feature.color
                )} />

                <div className="relative z-10">
                  <div className={cn(
                    'mb-4 flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
                    'bg-muted',
                  )}>
                    <Icon className={cn('size-5', feature.iconColor)} />
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-foreground sm:text-xl">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
