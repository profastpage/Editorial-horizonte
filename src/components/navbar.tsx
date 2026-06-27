// ============================================================================
//  NAVBAR — Editorial Horizonte
//  - Transparente sobre hero, sólida al hacer scroll
//  - Scroll-spy con deep-linking (History API)
//  - Currency toggle (PEN/USD)
//  - Botón carrito con contador
//  - Botón admin discreto
// ============================================================================
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, Settings, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useCart, useUI } from '@/lib/store'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'aliados', label: 'Aliados' },
  { id: 'contacto', label: 'Contacto' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { activeSection, scrollTo } = useScrollSpy(SECTIONS)
  const { items, openCart } = useCart()
  const { currency, setCurrency, setAdminOpen } = useUI()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => scrollTo('inicio')}
            className="flex items-center gap-2 group"
            aria-label="Editorial Horizonte — Inicio"
          >
            <div className="w-9 h-9 rounded-sm bg-primary flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="font-serif text-lg font-semibold tracking-tight">
                Editorial Horizonte
              </span>
              <span className="text-[10px] uppercase tracking-editorial text-muted-foreground mt-0.5">
                Libros que vuelven a casa
              </span>
            </div>
          </button>

          {/* Nav links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors rounded-sm',
                  activeSection === section.id
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground'
                )}
              >
                {section.label}
                {activeSection === section.id && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Currency toggle */}
            <div className="hidden sm:flex items-center bg-muted/60 rounded-sm p-0.5 text-xs font-medium">
              {(['PEN', 'USD'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={cn(
                    'px-2 py-1 rounded-sm transition-colors',
                    currency === c
                      ? 'bg-background text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {c === 'PEN' ? 'S/' : '$'}
                </button>
              ))}
            </div>

            {/* Admin button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAdminOpen(true)}
              className="text-muted-foreground hover:text-primary"
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
              className="relative"
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

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menú">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="font-serif text-xl">Editorial Horizonte</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 mt-6">
                  {SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        scrollTo(section.id)
                        setMobileOpen(false)
                      }}
                      className={cn(
                        'text-left px-4 py-3 rounded-sm font-medium transition-colors',
                        activeSection === section.id
                          ? 'bg-muted text-primary'
                          : 'text-foreground/80 hover:bg-muted/50'
                      )}
                    >
                      {section.label}
                    </button>
                  ))}
                  <div className="border-t border-border mt-4 pt-4 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Moneda:</span>
                    {(['PEN', 'USD'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={cn(
                          'px-3 py-1 rounded-sm text-xs font-medium',
                          currency === c ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}
                      >
                        {c === 'PEN' ? 'Soles (S/)' : 'Dólares ($)'}
                      </button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
