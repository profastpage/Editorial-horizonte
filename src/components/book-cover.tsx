// ============================================================================
//  BOOK COVER — Portada de libro simulada con tipografía editorial
//  Genera una portada elegante con color + título + autor cuando no hay
//  imagen real. Inspirado en tapas de editorial independiente.
// ============================================================================
'use client'

import { motion } from 'framer-motion'
import { cn, getBookInitials, isDarkColor } from '@/lib/utils'

interface BookCoverProps {
  title: string
  authorName?: string
  coverColor?: string  // hex, ej: "#7c2d12"
  coverUrl?: string | null
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  sm: { w: 'w-24', h: 'h-36', title: 'text-[10px]', author: 'text-[8px]' },
  md: { w: 'w-36', h: 'h-52', title: 'text-xs', author: 'text-[10px]' },
  lg: { w: 'w-48', h: 'h-72', title: 'text-sm', author: 'text-xs' },
  xl: { w: 'w-64', h: 'h-96', title: 'text-base', author: 'text-sm' },
}

export function BookCover({
  title,
  authorName,
  coverColor = '#7c2d12',
  coverUrl,
  className,
  size = 'md',
}: BookCoverProps) {
  const s = sizeMap[size]
  const isDark = isDarkColor(coverColor)
  const textColor = isDark ? '#f5ecd9' : '#1a1410'
  const accentColor = isDark ? 'rgba(245, 236, 217, 0.4)' : 'rgba(26, 20, 16, 0.4)'

  // Limpiar título para mostrar (sin "El/La/Los/Las" inicial)
  const cleanTitle = title.replace(/^(el|la|los|las|un|una|unos|unas)\s+/i, (match) => match)
  const displayTitle = cleanTitle.length > 50 ? cleanTitle.slice(0, 50) + '…' : cleanTitle
  const initials = getBookInitials(title)

  if (coverUrl) {
    return (
      <div className={cn('relative overflow-hidden book-cover-shadow rounded-sm', s.w, s.h, className)}>
        <img src={coverUrl} alt={`Portada: ${title}`} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4, rotateZ: -0.5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative overflow-hidden book-cover-shadow rounded-sm flex flex-col justify-between p-3',
        s.w, s.h, className
      )}
      style={{
        background: `linear-gradient(135deg, ${coverColor} 0%, ${coverColor}dd 50%, ${coverColor}aa 100%)`,
        color: textColor,
      }}
    >
      {/* Línea superior decorativa */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: accentColor }} />
      <div className="absolute top-2 left-2 right-2 h-px" style={{ background: accentColor }} />

      {/* Inicial grande de fondo */}
      <div
        className="absolute -bottom-4 -right-4 font-serif font-bold leading-none opacity-20 select-none pointer-events-none"
        style={{ fontSize: '8rem' }}
      >
        {initials}
      </div>

      {/* Espacio superior (deja respirar) */}
      <div className="relative z-10" />

      {/* Título + autor */}
      <div className="relative z-10 flex flex-col gap-1">
        <div className={cn('font-serif font-semibold uppercase tracking-wide leading-tight line-clamp-4', s.title)}>
          {displayTitle}
        </div>
        {authorName && (
          <div className={cn('font-sans uppercase tracking-editorial mt-1', s.author)} style={{ opacity: 0.8 }}>
            {authorName}
          </div>
        )}
      </div>

      {/* Línea inferior decorativa */}
      <div className="absolute bottom-2 left-2 right-2 h-px" style={{ background: accentColor }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: accentColor }} />
    </motion.div>
  )
}
