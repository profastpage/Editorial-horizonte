'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  ShoppingCart,
  Menu,
  Sun,
  Moon,
  User,
  BookOpen,
  Truck,
  Layers,
} from 'lucide-react';

export function Navbar() {
  const { setCartOpen, cartCount } = useAppStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = cartCount();

  const isHomePage = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/catalogo', label: 'Catálogo', icon: <Layers className="size-4" /> },
    { href: '/distribucion', label: 'Distribución', icon: <Truck className="size-4" /> },
    { href: '/#nosotros', label: 'Nosotros' },
    { href: '/#contacto', label: 'Contacto' },
    { href: '/mi-cuenta', label: 'Mi cuenta', icon: <User className="size-4" /> },
  ];

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 border-b ${
        scrolled || !isHomePage
          ? 'border-border/80 bg-background/90 backdrop-blur-md shadow-xs'
          : 'border-border/40 bg-background/70 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Official Monogram Logo + Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-98"
        >
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center p-1 border border-primary/20">
            <img
              src="/logo.png"
              alt="Horizonte Libros"
              className="size-6 object-contain dark:invert transition-transform group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-foreground leading-none">
              Horizonte Libros
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              Página oficial
            </span>
          </div>
        </Link>

        {/* Desktop nav — official requested items */}
        <nav className="hidden md:flex items-center gap-1.5" role="navigation" aria-label="Navegación principal">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                asChild
                className="gap-1.5 font-medium text-xs rounded-lg transition-colors"
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Right actions: Theme + Cart + Mobile Drawer */}
        <div className="flex items-center gap-2">
          {/* Dark/Light toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Cambiar tema"
            className="size-9 rounded-lg"
          >
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-foreground" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-foreground" />
          </Button>

          {/* Cart Drawer Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCartOpen(true)}
            className="relative gap-1.5 font-semibold text-xs px-3 h-9 rounded-lg border-border/80 shadow-2xs"
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="size-4 text-primary" />
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && (
              <span className="ml-1 inline-flex items-center justify-center size-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>

          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden size-9 rounded-lg"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6 flex flex-col justify-between">
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2.5 pb-4 border-b">
                  <img src="/logo.png" alt="Logo" className="size-7 dark:invert" />
                  <span className="font-serif font-bold text-lg">Horizonte Libros</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 px-2">
                    Menú Principal
                  </p>
                  {navLinks.map((item) => (
                    <Button
                      key={item.href}
                      variant={pathname === item.href ? 'default' : 'ghost'}
                      className="justify-start gap-2.5 font-medium text-sm rounded-xl h-11"
                      asChild
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href={item.href}>
                        {item.icon || <BookOpen className="size-4" />}
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Editorial Horizonte</p>
                <p>Jirón Sucre 470, San Miguel, Lima</p>
                <p>+51 955637859</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
