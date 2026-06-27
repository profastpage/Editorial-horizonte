// ============================================================================
//  STORE GLOBAL — Editorial Horizonte
// ============================================================================
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, OriginType } from '@/lib/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (bookId: string, warehouseId: string) => void
  updateQuantity: (bookId: string, warehouseId: string, quantity: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  totalItems: () => number
  subtotal: (currency: 'PEN' | 'USD') => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item, quantity = 1) => {
        const existing = get().items.find(
          (i) => i.bookId === item.bookId && i.warehouseId === item.warehouseId
        )
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.bookId === item.bookId && i.warehouseId === item.warehouseId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
            isOpen: true,
          })
        } else {
          set({ items: [...get().items, { ...item, quantity }], isOpen: true })
        }
      },
      removeItem: (bookId, warehouseId) =>
        set({
          items: get().items.filter(
            (i) => !(i.bookId === bookId && i.warehouseId === warehouseId)
          ),
        }),
      updateQuantity: (bookId, warehouseId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId, warehouseId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.bookId === bookId && i.warehouseId === warehouseId
              ? { ...i, quantity }
              : i
          ),
        })
      },
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: (currency) =>
        get().items.reduce((sum, i) => {
          const price = currency === 'PEN' ? i.unitPrice : i.unitPrice / 3.6 // aprox PEN→USD
          return sum + price * i.quantity
        }, 0),
    }),
    {
      name: 'eh-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// ---------------------------------------------------------------------------
// UI store (no persistido)
// ---------------------------------------------------------------------------
interface UIState {
  currency: 'PEN' | 'USD'
  adminMode: boolean
  adminOpen: boolean
  activeSection: string
  selectedBookId: string | null
  searchOpen: boolean
  setCurrency: (c: 'PEN' | 'USD') => void
  setAdminMode: (v: boolean) => void
  setAdminOpen: (v: boolean) => void
  setActiveSection: (s: string) => void
  setSelectedBookId: (id: string | null) => void
  setSearchOpen: (v: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  currency: 'PEN',
  adminMode: false,
  adminOpen: false,
  activeSection: 'inicio',
  selectedBookId: null,
  searchOpen: false,
  setCurrency: (currency) => set({ currency }),
  setAdminMode: (adminMode) => set({ adminMode }),
  setAdminOpen: (adminOpen) => set({ adminOpen }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setSelectedBookId: (selectedBookId) => set({ selectedBookId }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}))

// ---------------------------------------------------------------------------
// Filtros del catálogo
// ---------------------------------------------------------------------------
interface CatalogFilters {
  search: string
  originType: OriginType | 'all'
  categorySlug: string | 'all'
  format: string | 'all'
  sortBy: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'title'
}

interface CatalogState extends CatalogFilters {
  setSearch: (s: string) => void
  setOriginType: (o: OriginType | 'all') => void
  setCategorySlug: (c: string | 'all') => void
  setFormat: (f: string | 'all') => void
  setSortBy: (s: CatalogFilters['sortBy']) => void
  reset: () => void
}

const defaultFilters: CatalogFilters = {
  search: '',
  originType: 'all',
  categorySlug: 'all',
  format: 'all',
  sortBy: 'featured',
}

export const useCatalog = create<CatalogState>((set) => ({
  ...defaultFilters,
  setSearch: (search) => set({ search }),
  setOriginType: (originType) => set({ originType }),
  setCategorySlug: (categorySlug) => set({ categorySlug }),
  setFormat: (format) => set({ format }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () => set(defaultFilters),
}))
