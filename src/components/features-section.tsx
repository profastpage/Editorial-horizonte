'use client';

import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    number: '01',
    title: 'Sello editorial consolidado',
    description: 'Más de 40 años en el sector editorial difundiendo el pensamiento crítico, la memoria histórica y la cultura viva del Perú.',
  },
  {
    number: '02',
    title: 'Catálogo único y riguroso',
    description: 'Títulos seleccionados que preservan la diversidad de nuestras regiones y la complejidad del pensamiento latinoamericano.',
  },
  {
    number: '03',
    title: 'Equipo editorial profesional',
    description: 'Artistas, diseñadores, correctores y editores dedicados al cuidado minucioso de cada página y edición física.',
  },
  {
    number: '04',
    title: 'Atención y asesoría directa',
    description: 'Acompañamiento personalizado para lectores, investigadores, bibliotecas e instituciones educativas de todo el país.',
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-16 sm:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera Editorial Limpia — Sin cajas */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-2">
            Principios y Compromiso
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
            Más que una librería, un espacio para la creación y la difusión del libro peruano.
          </p>
        </div>

        {/* Pilares Editoriales Seamless — Sin fondos pesados ni bloques estilo WordPress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-border/40">
          {features.map((feature, i) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col justify-between lg:px-8 first:lg:pl-0 last:lg:pr-0 group"
            >
              <div>
                {/* Numerador tipográfico editorial */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl sm:text-3xl font-light text-muted-foreground/40 group-hover:text-primary transition-colors">
                    {feature.number}
                  </span>
                  <div className="w-8 h-[1px] bg-border/60 group-hover:bg-primary/60 transition-colors" />
                </div>

                {/* Título */}
                <h3 className="font-serif text-base sm:text-lg font-bold text-foreground leading-snug">
                  {feature.title}
                </h3>

                {/* Descripción */}
                <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
