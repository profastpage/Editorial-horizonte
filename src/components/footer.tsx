'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
              <img src="/logo.png" alt="Logo" className="size-6 dark:invert" />
              <span>Horizonte Libros</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Desde 1968, casa editorial oficial de José María Arguedas, César Vallejo y destacados
              pensadores de las ciencias sociales y la literatura peruana.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
              Contacto y Punto de Venta
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
                <span>Jirón Sucre 470, San Miguel, Lima Metropolitana</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                <a href="https://wa.me/51955637859" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  +51 955 637 859
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                <a href="mailto:contacto@horizontelibros.com" className="hover:text-primary transition-colors">
                  contacto@horizontelibros.com
                </a>
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/catalogo" className="hover:text-primary transition-colors">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="/distribucion" className="hover:text-primary transition-colors">
                  Distribución y Edición
                </Link>
              </li>
              <li>
                <Link href="/#nosotros" className="hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:text-primary transition-colors">
                  Contacto y Pedidos
                </Link>
              </li>
              <li>
                <Link href="/mi-cuenta" className="hover:text-primary transition-colors">
                  Mi Cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
              Síguenos
            </h4>
            <div className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground">
              <a
                href="https://instagram.com/editorialhorizonte"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Instagram className="size-4 text-pink-600" />
                <span>@editorialhorizonte</span>
              </a>
              <a
                href="https://facebook.com/editorial.horizonte"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Facebook className="size-4 text-blue-600" />
                <span>editorial.horizonte</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row text-xs text-muted-foreground">
          <p>
            © 2026 Horizonte Libros. Todos los derechos reservados.
          </p>
          <p>
            Lima, Perú · Envíos a todo Lima Metropolitana y provincias.
          </p>
        </div>
      </div>
    </footer>
  );
}
