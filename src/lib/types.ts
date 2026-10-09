// ─── Book-related types ───

export interface BookAuthor {
  authorId: string;
  order: number;
  author: {
    id: string;
    name: string;
    nationality: string | null;
  };
}

export interface BookCategory {
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface BookWithDetails {
  id: string;
  title: string;
  slug: string;
  isbn: string | null;
  synopsis: string | null;
  pages: number | null;
  language: string;
  publicationYear: number | null;
  coverUrl?: string | null;
  price: number;
  costPrice: number | null;
  weightKg: number | null;
  isActive: boolean;
  isFeatured: boolean;
  originType: string;
  publisherId: string | null;
  publisher: { id: string; name: string; country: string | null } | null;
  authors: BookAuthor[];
  categories: BookCategory[];
  totalStock: number;
  formatDescription?: string | null;
  thematic?: string | null;
  audience?: string | null;
  relatedTitles?: string | null;
  series?: string | null;
}

// ─── Warehouse ───

export interface Warehouse {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  contactName: string | null;
  warehouseType: string;
  isActive: boolean;
}

// ─── Inventory ───

export interface InventoryRecord {
  id: string;
  bookId: string;
  warehouseId: string;
  stockDisponible: number;
  stockConsignado: number;
  stockMinimo: number;
  stockReposicion: number;
  book: {
    id: string;
    title: string;
    isbn: string | null;
    price: number;
    originType: string;
  };
  warehouse: {
    id: string;
    name: string;
    city: string | null;
  };
}

// ─── Orders ───

export interface OrderItemData {
  id: string;
  bookId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  commissionRate: number | null;
  commissionAmount: number | null;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  customerCity: string | null;
  status: string;
  source: string;
  warehouseId: string | null;
  warehouse: { id: string; name: string } | null;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string | null;
  paymentRef: string | null;
  notes: string | null;
  confirmedAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  items: OrderItemData[];
}

// ─── Category ───

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
}

// ─── Dashboard stats ───

export interface DashboardStats {
  totalSales: number;
  totalStock: number;
  pendingOrders: number;
  totalBooks: number;
  salesByWarehouse: { name: string; sales: number }[];
  booksByOrigin: { name: string; value: number; fill: string }[];
}

// ─── Filters ───

export interface BookFilters {
  search?: string;
  categoryId?: string;
  originType?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ─── Cart ───

export interface CartItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  originType: string;
}

// ─── Checkout ───

export interface CheckoutData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  warehouseId: string;
  items: CartItem[];
}

// ─── Sections for SPA navigation ───

export type SectionType = 'inicio' | 'catalogo' | 'nosotros' | 'admin';