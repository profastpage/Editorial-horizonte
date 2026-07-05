// ============================================================================
//  FOOTER — Editorial Horizonte
//  *** CRÉDITOS DEL DESARROLLADOR HARDCODEADOS E INAMOVIBLES ***
//  Texto exacto: "Diseño y desarrollo por fastpagepro.com"
//  Link a: https://fastpagepro.com
//  "fastpagepro.com" resaltado con color primary de énfasis.
//  Ningún panel admin puede editar o remover este enlace.
// ============================================================================
'use client'

import Link from 'next/link'
import { BookOpen, Instagram, Mail, MapPin, Phone } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/aliados', label: 'Aliados' },
  { href: '/contacto', label: 'Contacto' },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Marca */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-sm bg-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <span className="font-serif text-xl font-semibold">Editorial Horizonte</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Editorial independiente peruana dedicada a la literatura latinoamericana.
              Publicamos el fondo editorial propio y distribuimos obras de terceras editoriales
              con consignación en librerías aliadas. Cada libro que publicamos es una invitación
              a volver a casa.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="mailto:contacto@editorialhorizonte.com"
                aria-label="Email"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-editorial mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-editorial mb-4">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/70" strokeWidth={1.5} />
                <span>Av. La Mar 1234, Lima 15072, Perú</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/70" strokeWidth={1.5} />
                <span>+51 1 234 56Book</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/70" strokeWidth={1.5} />
                <span>contacto@editorialhorizonte.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior con créditos INAMOVIBLES */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground order-2 md:order-1">
            © {new Date().getFullYear()} Editorial Horizonte. Todos los derechos reservados.
          </p>

          {/* CRÉDITOS DEL DESARROLLADOR — NO MODIFICABLE, NO ELIMINABLE */}
          <a
            href="https://fastpagepro.com"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="order-1 md:order-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Diseño y desarrollo por fastpagepro.com"
            onClick={(e) => e.stopPropagation()}
          >
            Diseño y desarrollo por{' '}
            <span className="font-semibold text-primary hover:underline">
              fastpagepro.com
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
