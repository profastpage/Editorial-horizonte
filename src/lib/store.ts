import { create } from 'zustand';
import type { CartItem, SectionType, BookFilters } from '@/lib/types';

interface AppState {
  // Navigation
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;

  // Cart
  cartItems: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Catalog filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: BookFilters;
  setFilters: (f: Partial<BookFilters>) => void;
  resetFilters: () => void;

  // Admin
  isAdminAuth: boolean;
  setAdminAuth: (auth: boolean) => void;

  // Book detail
  selectedBookId: string | null;
  setSelectedBookId: (id: string | null) => void;

  // Checkout
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
}

const defaultFilters: BookFilters = {
  search: '',
  categoryId: undefined,
  originType: undefined,
  minPrice: undefined,
  maxPrice: undefined,
};

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  activeSection: 'inicio',
  setActiveSection: (section) => set({ activeSection: section }),

  // Cart
  cartItems: [],
  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
  addToCart: (item, quantity = 1) => {
    const qty = Math.max(1, quantity);
    const items = get().cartItems;
    const existing = items.find((i) => i.bookId === item.bookId);
    if (existing) {
      set({
        cartItems: items.map((i) =>
          i.bookId === item.bookId ? { ...i, quantity: i.quantity + qty } : i
        ),
      });
    } else {
      set({ cartItems: [...items, { ...item, quantity: qty }] });
    }
  },
  removeFromCart: (bookId) =>
    set({ cartItems: get().cartItems.filter((i) => i.bookId !== bookId) }),
  updateCartQuantity: (bookId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(bookId);
      return;
    }
    set({
      cartItems: get().cartItems.map((i) =>
        i.bookId === bookId ? { ...i, quantity } : i
      ),
    });
  },
  clearCart: () => set({ cartItems: [] }),
  cartTotal: () =>
    get().cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
  cartCount: () => get().cartItems.reduce((sum, i) => sum + i.quantity, 0),

  // Catalog filters
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  filters: { ...defaultFilters },
  setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
  resetFilters: () => set({ filters: { ...defaultFilters }, searchQuery: '' }),

  // Admin
  isAdminAuth: false,
  setAdminAuth: (auth) => set({ isAdminAuth: auth }),

  // Book detail
  selectedBookId: null,
  setSelectedBookId: (id) => set({ selectedBookId: id }),

  // Checkout
  checkoutOpen: false,
  setCheckoutOpen: (open) => set({ checkoutOpen: open }),
}));