// ============================================================================
//  NAVBAR PREMIUM — Editorial Horizonte
//  Header inteligente global para TODA la web:
//  - Transparente sobre hero, sólido al hacer scroll
//  - Logo circular terracota + nombre + tagline (a la izquierda)
//  - Menú centrado con dot indicador en enlace activo
//  - Utilidades a la derecha (admin, carrito con badge)
//  - Mobile: sidebar derecha con overlay + selector moneda al pie
// ============================================================================
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, ShoppingBag, Settings, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCart, useUI } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/aliados', label: 'Aliados' },
  { href: '/contacto', label: 'Contacto' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { items, openCart } = useCart()
  const { currency, setCurrency, setAdminOpen } = useUI()

  // Detecta scroll para cambiar el estilo del header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const isHome = pathname === '/'

  // Estilo inteligente: transparente sobre hero en home, sólido en el resto
  const transparent = isHome && !scrolled

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          transparent
            ? 'bg-transparent'
            : 'bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">

            {/* === LOGO + NOMBRE + TAGLINE === */}
            <Link
              href="/"
              prefetch={true}
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="Editorial Horizonte — Inicio"
            >
              {/* Círculo terracota con icono libro */}
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                <BookOpen className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
              </div>
              {/* Nombre + tagline */}
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="font-serif text-base font-semibold tracking-tight">
                  Editorial Horizonte
                </span>
                <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-1 font-medium">
                  Libros que vuelven a casa
                </span>
              </div>
            </Link>

            {/* === MENÚ CENTRADO (desktop) === */}
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors rounded-full',
                      active
                        ? 'text-primary'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/40'
                    )}
                  >
                    {link.label}
                    {/* Dot indicador en activo */}
                    {active && (
                      <motion.div
                        layoutId="nav-active-dot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* === UTILIDADES DERECHA === */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Currency toggle (desktop) */}
              <div className="hidden lg:flex items-center bg-muted/50 rounded-full p-0.5 text-xs font-medium">
                {(['PEN', 'USD'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={cn(
                      'px-2.5 py-1 rounded-full transition-colors',
                      currency === c
                        ? 'bg-background text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    aria-label={`Cambiar a ${c === 'PEN' ? 'soles' : 'dólares'}`}
                  >
                    {c === 'PEN' ? 'S/' : '$'}
                  </button>
                ))}
              </div>

              {/* Admin */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAdminOpen(true)}
                className="text-muted-foreground hover:text-primary rounded-full"
                aria-label="Acceso administrador"
                title="Acceso administrador"
              >
                <Settings className="w-4 h-4" strokeWidth={1.5} />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={openCart}
                className="relative rounded-full"
                aria-label={`Carrito de compras (${totalItems} items)`}
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Button>

              {/* Mobile menu trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* === MOBILE SIDEBAR (premium) === */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
          {/* Header del sidebar — sin X duplicada (el SheetContent ya incluye su botón cerrar) */}
          <SheetHeader className="p-6 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <SheetTitle className="font-serif text-lg">Editorial Horizonte</SheetTitle>
            </div>
          </SheetHeader>

          {/* Links de navegación */}
          <div className="flex-1 p-6">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link, idx) => {
                const active = isActive(pathname, link.href)
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      prefetch={true}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-medium transition-colors',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/80 hover:bg-muted/60'
                      )}
                    >
                      <span>{link.label}</span>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
          </div>

          {/* Selector de moneda al pie */}
          <div className="p-6 border-t border-border bg-muted/30">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3 font-medium">
              Moneda
            </div>
            <div className="flex items-center gap-2">
              {(['PEN', 'USD'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={cn(
                    'flex-1 py-2.5 rounded-full text-sm font-medium transition-colors',
                    currency === c
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground/70 border border-border'
                  )}
                >
                  {c === 'PEN' ? 'Soles (S/)' : 'Dólares ($)'}
                </button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
