'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/section-wrapper';
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContactSection() {
  const whatsappUrl = 'https://wa.me/51955637859?text=' + encodeURIComponent('Hola Editorial Horizonte, deseo realizar una consulta sobre sus libros.');

  return (
    <SectionWrapper id="contacto" className="py-20 sm:py-24 bg-background border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-14"
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contacto
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            Estamos a tu disposición para pedidos, consultas bibliográficas, visitas coordinadas y distribución.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Dirección y Horario */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="size-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-foreground">Punto de Venta y Retiro</h3>
              <p className="text-sm text-foreground/80 font-medium mt-1">
                Jirón Sucre 470, San Miguel
              </p>
              <p className="text-xs text-muted-foreground">
                Lima Metropolitana, Perú
              </p>
            </div>
            <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground flex items-start gap-2">
              <Clock className="size-4 text-primary shrink-0 mt-0.5" />
              <span>Lunes a viernes de 10:00 a 14:00 hrs o visita coordinada previa.</span>
            </div>
          </div>

          {/* Card 2: Teléfono y WhatsApp */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Phone className="size-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-foreground">Teléfono y WhatsApp</h3>
                <p className="text-sm font-semibold text-foreground mt-1">
                  +51 955 637 859
                </p>
                <p className="text-xs text-muted-foreground">
                  Atención rápida para compras y consultas.
                </p>
              </div>
            </div>
            <Button
              asChild
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                Abrir WhatsApp Oficial
              </a>
            </Button>
          </div>

          {/* Card 3: Correos y Redes Sociales */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Mail className="size-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-foreground">Correo Electrónico</h3>
                <div className="space-y-1.5 mt-2">
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
            </div>

            <div className="pt-3 border-t border-border/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Síguenos
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/editorialhorizonte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  <Instagram className="size-4 text-pink-600" />
                  <span>@editorialhorizonte</span>
                </a>
                <a
                  href="https://facebook.com/editorial.horizonte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  <Facebook className="size-4 text-blue-600" />
                  <span>editorial.horizonte</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
