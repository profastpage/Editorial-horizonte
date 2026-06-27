// ============================================================================
//  NOSOTROS — Historia, misión, valores
// ============================================================================
'use client'

import { motion } from 'framer-motion'
import { Feather, Layers, MapPin, Sprout } from 'lucide-react'

const VALUES = [
  {
    icon: Feather,
    title: 'Cuidado editorial',
    text: 'Cada libro pasa por un proceso artesanal: corrección de estilo, diseño tipográfico y encuadernación pensada para durar.',
  },
  {
    icon: Sprout,
    title: 'Voces emergentes',
    text: 'Apostamos por autores latinoamericanos en formación, junto a voces consagradas que merecen reediciones cuidadas.',
  },
  {
    icon: Layers,
    title: 'Catálogo curado',
    text: 'Distribuimos obras de terceras editoriales con las que compartimos sensibilidad. La selección importa tanto como la publicación.',
  },
  {
    icon: MapPin,
    title: 'Red de librerías',
    text: 'Trabajamos con librerías independientes de Lima vía consignación, fortaleciendo el ecosistema literario local.',
  },
]

export function About() {
  return (
    <section
      data-section="nosotros"
      className="relative py-24 md:py-32 paper-texture"
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
              Sobre nosotros
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-balance"
          >
            Una editorial que <span className="italic text-primary">escucha</span> a la
            literatura latinoamericana
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed text-pretty"
          >
            Editorial Horizonte nació en 2019 con una convicción simple: en Perú y en
            Latinoamérica se está escribiendo una literatura que merece ser leída con
            atención. Publicamos nuestro fondo editorial propio —ensayos, narrativa y
            poesía— y a la vez distribuimos obras de editoriales independientes que
            admiramos, llevándolas a las librerías aliadas de Lima mediante consignación.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-4 text-base text-muted-foreground/90 leading-relaxed"
          >
            Trabajamos con un sistema logístico multi-almacén que nos permite rastrear en
            tiempo real el stock de cada título en cada punto de venta. Cada compra
            realizada en cualquier librería aliada descuenta automáticamente las unidades
            del almacén correspondiente, sincronizando nuestro catálogo digital con la
            realidad física de los libros.
          </motion.p>
        </div>

        {/* Grid de valores */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative p-6 rounded-sm border border-border bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-sm bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <value.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Cita destacada */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mt-24 max-w-3xl mx-auto text-center"
        >
          <p className="font-serif text-2xl md:text-3xl font-medium italic leading-relaxed text-foreground/90">
            «Un libro no se publica: se acompaña. Desde el manuscrito hasta la librería,
            nuestro oficio es sostener la obra para que llegue entera a quien la espera.»
          </p>
          <footer className="mt-6 text-sm text-muted-foreground">
            — Juan Damonte, fundador de Editorial Horizonte
          </footer>
        </motion.blockquote>
      </div>
    </section>
  )
}
