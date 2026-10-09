'use client';

import { BookOpen, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-primary">
              <BookOpen className="size-5" />
              Editorial Horizonte
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Desde 1970, difundiendo las obras fundamentales de José María Arguedas,
              César Vallejo, literatura y ciencias sociales peruanas.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Contacto
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="size-3.5 shrink-0" />
                Jr. Camaná 868, Lima Centro, Perú
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0" />
                +51 1 428-2838
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0" />
                contacto@editorialhorizonte.com
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Navegación
            </h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>
                <a href="#inicio" className="hover:text-foreground transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-foreground transition-colors">
                  Catálogo
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-foreground transition-colors">
                  Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Síguenos
            </h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-full border hover:bg-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="mailto:info@editorialhorizonte.com"
                className="flex size-9 items-center justify-center rounded-full border hover:bg-accent transition-colors"
                aria-label="Email"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Editorial Horizonte. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Diseño y desarrollo por{' '}
            <a
              href="https://fastpagepro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              fastpagepro.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}