'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchModal } from '@/components/search-modal';
import { cn } from '@/lib/utils';
import {
  ShoppingCart,
  Menu,
  Sun,
  Moon,
  User,
  BookOpen,
  Truck,
  Layers,
  Search,
} from 'lucide-react';

export function Navbar() {
  const { setCartOpen, cartCount, setSearchOpen } = useAppStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = cartCount();

  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/catalogo', label: 'Catálogo', icon: <Layers className="size-4" />, highlight: true },
    { href: '/distribucion', label: 'Distribución', icon: <Truck className="size-4" /> },
    { href: '/#nosotros', label: 'Nosotros' },
    { href: '/#contacto', label: 'Contacto' },
    { href: '/mi-cuenta', label: 'Mi cuenta', icon: <User className="size-4" /> },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-40 w-full transition-all duration-300',
          isTransparent
            ? 'bg-transparent border-b border-transparent text-white'
            : 'bg-background/95 backdrop-blur-md border-b border-border/80 shadow-xs text-foreground'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Official Monogram Logo + Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group transition-transform active:scale-98 shrink-0"
          >
            <img
              src="/logo.png"
              alt="Horizonte Libros"
              className={cn(
                'size-7 sm:size-8 object-contain transition-all duration-300 group-hover:scale-105',
                isTransparent ? 'brightness-0 invert drop-shadow-sm' : 'dark:invert'
              )}
            />
            <div className="flex flex-col">
              <span
                className={cn(
                  'font-serif font-bold text-base sm:text-xl tracking-tight leading-none transition-colors',
                  isTransparent ? 'text-white drop-shadow-sm' : 'text-foreground'
                )}
              >
                Horizonte Libros
              </span>
              <span
                className={cn(
                  'text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold transition-colors',
                  isTransparent ? 'text-white/80' : 'text-muted-foreground'
                )}
              >
                Página oficial
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1.5" role="navigation" aria-label="Navegación principal">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? (isTransparent ? 'secondary' : 'default') : 'ghost'}
                  size="sm"
                  asChild
                  className={cn(
                    'gap-1.5 text-xs rounded-lg transition-colors',
                    item.highlight ? 'font-bold' : 'font-medium',
                    isTransparent && !isActive && 'text-white/90 hover:text-white hover:bg-white/15'
                  )}
                >
                  <Link href={item.href}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Direct Mobile "Catálogo" Button */}
            <Button
              size="sm"
              variant={isTransparent ? 'outline' : 'default'}
              asChild
              className={cn(
                'md:hidden h-8 px-2 sm:px-2.5 rounded-lg text-xs font-bold gap-1 transition-colors shadow-2xs',
                isTransparent
                  ? 'border-white/30 bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              <Link href="/catalogo">
                <Layers className="size-3.5" />
                <span>Catálogo</span>
              </Link>
            </Button>

            {/* Desktop Search Button (Lupita) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-colors',
                isTransparent
                  ? 'border-white/25 bg-white/15 hover:bg-white/25 text-white placeholder:text-white/70 backdrop-blur-xs'
                  : 'border-border/70 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
              aria-label="Buscar libros en el catálogo"
            >
              <Search className={cn('size-3.5', isTransparent ? 'text-white' : 'text-primary')} />
              <span>Buscar libros...</span>
              <kbd
                className={cn(
                  'hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[9px] font-mono rounded',
                  isTransparent
                    ? 'bg-white/20 border border-white/30 text-white'
                    : 'bg-background border border-border/60 text-muted-foreground'
                )}
              >
                Ctrl+K
              </kbd>
            </button>

            {/* Mobile Search Button (Lupita para móviles) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar libros"
              className={cn(
                'sm:hidden size-8 sm:size-9 rounded-lg transition-colors',
                isTransparent ? 'text-white hover:bg-white/15' : 'text-foreground'
              )}
            >
              <Search className="size-4" />
            </Button>

            {/* Dark/Light toggle (desktop) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Cambiar tema"
              className={cn(
                'hidden sm:inline-flex size-9 rounded-lg transition-colors',
                isTransparent ? 'text-white hover:bg-white/15' : 'text-foreground'
              )}
            >
              <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </Button>

            {/* Cart Drawer Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCartOpen(true)}
              className={cn(
                'relative gap-1.5 font-semibold text-xs px-2 sm:px-3 h-8 sm:h-9 rounded-lg shadow-2xs transition-colors',
                isTransparent
                  ? 'border-white/30 bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs'
                  : 'border-border/80 text-foreground'
              )}
              aria-label="Abrir carrito"
            >
              <ShoppingCart className={cn('size-3.5 sm:size-4', isTransparent ? 'text-white' : 'text-primary')} />
              <span className="hidden sm:inline">Carrito</span>
              {count > 0 && (
                <span
                  className={cn(
                    'ml-0.5 sm:ml-1 inline-flex items-center justify-center size-4 sm:size-5 rounded-full text-[9px] sm:text-[10px] font-bold',
                    isTransparent ? 'bg-white text-emerald-950' : 'bg-primary text-primary-foreground'
                  )}
                >
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
                  className={cn(
                    'md:hidden size-8 sm:size-9 rounded-lg transition-colors',
                    isTransparent ? 'text-white hover:bg-white/15' : 'text-foreground'
                  )}
                  aria-label="Abrir menú"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-6 flex flex-col justify-between">
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-2.5">
                      <img src="/logo.png" alt="Logo" className="size-7 object-contain dark:invert" />
                      <span className="font-serif font-bold text-lg">Horizonte Libros</span>
                    </div>

                    {/* Dark/light toggle in mobile sheet */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      aria-label="Cambiar tema"
                      className="size-8 rounded-lg"
                    >
                      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                      <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    </Button>
                  </div>

                  {/* Acceso a búsqueda en móvil */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setSearchOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/70 bg-muted/40 text-muted-foreground text-xs font-medium"
                  >
                    <Search className="size-4 text-primary" />
                    <span>Buscar libros por título o autor...</span>
                  </button>

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

      {/* Global Live Search Spotlight Modal */}
      <SearchModal />
    </>
  );
}
