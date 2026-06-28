// ============================================================================
//  ALIADOS — Sección de librerías aliadas (warehouses públicos)
// ============================================================================
'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Store } from 'lucide-react'
import type { Warehouse } from '@/lib/types'

interface AlliesProps {
  warehouses: Warehouse[]
}

export function Allies({ warehouses }: AlliesProps) {
  // Filtrar solo las librerías físicas (no el almacén central)
  const stores = warehouses.filter((w) => w.type === 'physical_store')

  return (
    <section
      data-section="aliados"
      className="relative py-24 md:py-32 bg-secondary/30"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="editorial-rule" />
            <span className="text-xs uppercase tracking-editorial text-muted-foreground">
              Red de librerías aliadas
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-balance"
          >
            Encuéntranos en las <span className="italic text-primary">mejores</span> librerías
            de Lima
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed text-pretty"
          >
            Nuestros títulos están disponibles en consignación en las librerías independientes
            más respetadas del país. Cada una funciona como un almacén independiente:
            nuestro sistema ERP sincroniza el inventario en tiempo real, así sabes siempre
            dónde encontrar cada libro.
          </motion.p>
        </div>

        {/* Grid de librerías */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, idx) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative p-8 rounded-sm border border-border bg-card hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Número ornamental */}
              <div className="absolute top-4 right-5 font-serif text-5xl font-bold text-primary/10 select-none">
                {String(idx + 1).padStart(2, '0')}
              </div>

              <div className="relative">
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center mb-6">
                  <Store className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>

                <h3 className="font-serif text-2xl font-semibold mb-1">{store.name}</h3>
                <div className="text-xs uppercase tracking-editorial text-primary mb-5">
                  Aliado desde 2019 · {store.city}
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  {store.addressLine1 && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/70" strokeWidth={1.5} />
                      <span>{store.addressLine1}{store.city ? `, ${store.city}` : ''}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/70" strokeWidth={1.5} />
                      <span>{store.phone}</span>
                    </div>
                  )}
                </div>

                {store.managerName && (
                  <div className="mt-6 pt-5 border-t border-border/60">
                    <div className="text-[10px] uppercase tracking-editorial text-muted-foreground mb-1">
                      Encargado
                    </div>
                    <div className="text-sm font-medium">{store.managerName}</div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Card CTA para stock central */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: stores.length * 0.1 }}
            className="p-8 rounded-sm border border-dashed border-primary/40 bg-primary/5 flex flex-col justify-center items-center text-center"
          >
            <div className="font-serif text-3xl font-semibold text-primary mb-2">
              + Envío a domicilio
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Compra desde esta web y recibe en cualquier punto de Perú.
              Envío gratis a partir de S/150.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
