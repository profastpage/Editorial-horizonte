// ============================================================================
//  UTILIDADES — Editorial Horizonte
// ============================================================================
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formateadores de moneda
const penFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
})

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatPrice(amount: number, currency: 'PEN' | 'USD' = 'PEN') {
  return currency === 'PEN' ? penFormatter.format(amount) : usdFormatter.format(amount)
}

export function formatDate(date: string | Date | null, opts?: Intl.DateTimeFormatOptions) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-PE', opts ?? {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatRelative(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (minutes < 1) return 'hace un momento'
  if (minutes < 60) return `hace ${minutes} min`
  if (hours < 24) return `hace ${hours}h`
  if (days < 7) return `hace ${days}d`
  return formatDate(d, { day: 'numeric', month: 'short' })
}

// Genera iniciales para portadas simuladas
export function getBookInitials(title: string) {
  const clean = title.replace(/^(el|la|los|las|un|una|unos|unas)\s+/i, '')
  return clean.charAt(0).toUpperCase()
}

// Convierte hex a rgba con alpha
export function hexToRgba(hex: string, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Determina si un color es oscuro (para elegir texto blanco o negro)
export function isDarkColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.55
}

// Trunca texto
export function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

// Slugify
export function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
