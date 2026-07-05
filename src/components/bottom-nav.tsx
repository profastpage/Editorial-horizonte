// ============================================================================
//  BOTTOM NAV — Menú inferior ultra pro para mobile/tablet
//  - Botones a subpáginas reales: Catálogo, Nosotros, Aliados, Contacto
//  - Botón central WhatsApp con animación pulse
//  - Solo visible en mobile/tablet (hidden en desktop)
//  - Glass morphism + backdrop blur + safe area
//  - Active state con dot indicador + color terracota
//  - Microinteracciones spring al click
// ============================================================================
'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  BookOpen, Users, Store, Mail, MessageCircle, Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Número de WhatsApp del negocio (formato internacional sin + ni espacios)
const WHATSAPP_NUMBER = '51999888777' // Reemplazar con el número real de Editorial Horizonte
const WHATSAPP_MESSAGE = 'Hola Editorial Horizonte, me gustaría más información sobre sus libros.'

const NAV_ITEMS = [
  { href: '/',           label: 'Inicio',   icon: Home },
  { href: '/catalogo',   label: 'Catálogo', icon: BookOpen },
  { href: '/nosotros',   label: 'Nosotros', icon: Users },
  { href: '/aliados',    label: 'Aliados',  icon: Store },
  { href: '/contacto',   label: 'Contacto', icon: Mail },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function BottomNav() {
  const pathname = usePathname()

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <>
      {/* === MENÚ INFERIOR (mobile/tablet only) === */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30, delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: '1px solid rgba(192, 90, 66, 0.12)',
          boxShadow: '0 -4px 24px -8px rgba(0, 0, 0, 0.12)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        aria-label="Navegación inferior"
      >
        <div className="relative flex items-center justify-around px-2 py-2">
          {/* Items de navegación (4 items a la izquierda) */}
          {NAV_ITEMS.slice(0, 4).map((item) => {
            const active = isActive(pathname, item.href)
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 px-2 py-1.5 min-w-[60px] transition-colors"
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className={cn(
                    'relative w-9 h-9 rounded-2xl flex items-center justify-center transition-colors',
                    active
                      ? 'bg-primary/12'
                      : 'bg-transparent'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-[18px] h-[18px] transition-colors',
                      active ? 'text-primary' : 'text-foreground/55'
                    )}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {/* Dot indicador activo */}
                  {active && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span
                  className={cn(
                    'text-[9px] font-medium tracking-wide transition-colors',
                    active ? 'text-primary' : 'text-foreground/50'
                  )}
                >
                  {item.label}
                </span>
              </a>
            )
          })}

          {/* === BOTÓN CENTRAL WHATSAPP (ultra pro) === */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contáctanos por WhatsApp"
            className="relative flex flex-col items-center justify-center gap-1 min-w-[70px]"
          >
            {/* Halo pulse animado */}
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full"
              style={{ background: 'rgba(37, 211, 102, 0.25)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full"
              style={{ background: 'rgba(37, 211, 102, 0.15)' }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />

            {/* Botón principal */}
            <motion.div
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg -mt-4"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                boxShadow: '0 6px 20px -4px rgba(37, 211, 102, 0.5), 0 0 0 4px rgba(255, 255, 255, 0.9)',
              }}
            >
              <MessageCircle
                className="w-7 h-7 text-white"
                strokeWidth={2}
                fill="currentColor"
                fillOpacity={0.2}
              />
              {/* Badge "online" */}
              <div
                className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                style={{ background: '#22c55e' }}
              />
            </motion.div>
            <span
              className="text-[9px] font-semibold tracking-wide"
              style={{ color: '#128C7E' }}
            >
              WhatsApp
            </span>
          </a>

          {/* Item Contacto (a la derecha del WhatsApp) */}
          {NAV_ITEMS.slice(4).map((item) => {
            const active = isActive(pathname, item.href)
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 px-2 py-1.5 min-w-[60px] transition-colors"
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className={cn(
                    'relative w-9 h-9 rounded-2xl flex items-center justify-center transition-colors',
                    active ? 'bg-primary/12' : 'bg-transparent'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-[18px] h-[18px] transition-colors',
                      active ? 'text-primary' : 'text-foreground/55'
                    )}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {active && (
                    <motion.div
                      layoutId="bottom-nav-active-2"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span
                  className={cn(
                    'text-[9px] font-medium tracking-wide transition-colors',
                    active ? 'text-primary' : 'text-foreground/50'
                  )}
                >
                  {item.label}
                </span>
              </a>
            )
          })}
        </div>
      </motion.nav>

      {/* === BOTÓN WHATSAPP FLOTANTE (desktop) === */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contáctanos por WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 1 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 hidden lg:flex"
      >
        {/* Halo pulse */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'rgba(37, 211, 102, 0.3)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'rgba(37, 211, 102, 0.2)' }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Botón */}
        <div
          className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            boxShadow: '0 8px 24px -4px rgba(37, 211, 102, 0.5), 0 0 0 5px rgba(255, 255, 255, 0.9)',
          }}
        >
          <MessageCircle
            className="w-8 h-8 text-white"
            strokeWidth={2}
            fill="currentColor"
            fillOpacity={0.2}
          />
          {/* Badge online */}
          <div
            className="absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white"
            style={{ background: '#22c55e' }}
          />
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white px-4 py-2 rounded-2xl shadow-lg border border-border opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="text-xs font-semibold text-foreground">¿Conversamos?</div>
          <div className="text-[10px] text-muted-foreground">Escríbenos por WhatsApp</div>
          {/* Flecha */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-l-8 border-l-white border-y-8 border-y-transparent" />
        </div>
      </motion.a>
    </>
  )
}
