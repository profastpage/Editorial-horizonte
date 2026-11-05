'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowUpRight, Clock } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-floating';

export function ContactSection() {
  const whatsappUrl =
    'https://wa.me/51955637859?text=' +
    encodeURIComponent('Hola Editorial Horizonte, deseo realizar una consulta sobre sus libros.');

  return (
    <section id="contacto" className="w-full py-16 sm:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera Editorial */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-2">
            Canales de Atención
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Contacto & Distribución
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
            Estamos a tu disposición para pedidos personales, consultas bibliográficas, visitas coordinadas y distribución a librerías.
          </p>
        </div>

        {/* Directorio Seamless en 3 Columnas — Sin cajas ni tarjetas estilo WordPress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-border/40 border-t border-b border-border/40 py-10">
          {/* 01. Sede y Retiro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="flex flex-col justify-between md:px-8 first:md:pl-0 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="size-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Sede Editorial & Retiro
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                San Miguel, Lima
              </h3>
              <p className="text-sm text-foreground/90 font-medium">
                Jirón Sucre 470
              </p>
              <p className="text-xs text-muted-foreground">
                Lima Metropolitana, Perú
              </p>
            </div>

            <div className="pt-3 border-t border-border/40 flex items-start gap-2 text-xs text-muted-foreground">
              <Clock className="size-3.5 text-primary shrink-0 mt-0.5" />
              <span>Lunes a viernes de 10:00 a 14:00 hrs o previa coordinación.</span>
            </div>
          </motion.div>

          {/* 02. Teléfono y WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="flex flex-col justify-between md:px-8 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Phone className="size-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Línea Telefónica & WhatsApp
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                +51 955 637 859
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Atención ágil para cotizaciones, disponibilidad en almacén y compras institucionales.
              </p>
            </div>

            <div className="pt-3 border-t border-border/40">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors group"
              >
                <WhatsAppIcon className="size-3.5" />
                <span>Conversar por WhatsApp</span>
                <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* 03. Correos Institucionales */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.16 }}
            className="flex flex-col justify-between md:px-8 last:md:pr-0 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Mail className="size-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Mesa de Partes & Ventas
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                Correos Oficiales
              </h3>
              <div className="space-y-1.5 pt-1">
                <a
                  href="mailto:contacto@horizontelibros.com"
                  className="text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors block"
                >
                  contacto@horizontelibros.com
                </a>
                <a
                  href="mailto:ventas@horizontelibros.com"
                  className="text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors block"
                >
                  ventas@horizontelibros.com
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 text-xs text-muted-foreground">
              Envíos garantizados a todo Lima Metropolitana y provincias.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
