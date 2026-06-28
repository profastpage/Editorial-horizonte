// ============================================================================
//  TIPOS COMPARTIDOS — Editorial Horizonte
// ============================================================================

export type OriginType = 'own' | 'third_party'
export type PublisherType = 'own' | 'third_party'
export type BookFormat = 'physical' | 'digital' | 'audiobook'
export type WarehouseType = 'physical_store' | 'warehouse' | 'distribution_center'
export type OrderStatus =
  | 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentProvider = 'mercadopago' | 'paypal' | 'izipay' | 'manual'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partial_refund'
export type Currency = 'PEN' | 'USD'
export type MovementType =
  | 'initial_stock' | 'sale' | 'consignment_in' | 'consignment_out'
  | 'return' | 'adjustment' | 'transfer_in' | 'transfer_out'
  | 'manual_in' | 'manual_out'

export interface BookWithRelations {
  id: string
  title: string
  slug: string
  isbn: string | null
  synopsis: string | null
  coverUrl: string | null
  originType: OriginType
  publicationDate: string | null
  pages: number | null
  language: string
  format: BookFormat
  dimensions: string | null
  weightGrams: number | null
  edition: string | null
  pricePen: number
  priceUsd: number
  cost: number
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  metaTitle: string | null // guarda temporalmente el color de portada
  publisher?: {
    id: string
    name: string
    slug: string
    type: PublisherType
    commissionRate: number
  } | null
  authors?: Array<{
    id: string
    fullName: string
    slug: string
    role: string
  }>
  categories?: Array<{
    id: string
    name: string
    slug: string
  }>
  inventory?: Array<{
    id: string
    warehouseId: string
    warehouse: { id: string; name: string; code: string }
    stockAvailable: number
    stockConsigned: number
    stockReserved: number
  }>
}

export interface CartItem {
  bookId: string
  title: string
  slug: string
  coverColor: string
  quantity: number
  unitPrice: number
  warehouseId: string
  warehouseName: string
  originType: OriginType
}

export interface Warehouse {
  id: string
  name: string
  code: string
  type: WarehouseType
  city: string | null
  addressLine1: string | null
  phone: string | null
  email: string | null
  managerName: string | null
  isActive: boolean
}
