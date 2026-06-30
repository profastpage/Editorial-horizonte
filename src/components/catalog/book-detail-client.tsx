// ============================================================================
//  BOOK DETAIL CLIENT — Selector de almacén + add to cart
//  Componente cliente para la página /libro/[slug]
// ============================================================================
'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Minus, Package, Plus, ShoppingCart, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart, useUI } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import type { BookWithRelations } from '@/lib/types'

interface BookDetailClientProps {
  book: BookWithRelations
}

export function BookDetailClient({ book }: BookDetailClientProps) {
  const { addItem } = useCart()
  const { currency } = useUI()
  const [quantity, setQuantity] = useState(1)
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null)

  const defaultWarehouse = useMemo(() => {
    const withStock = book.inventory?.filter((i) => i.stockAvailable > 0)
    return withStock?.[0]?.warehouseId ?? book.inventory?.[0]?.warehouseId ?? null
  }, [book])

  const effectiveWarehouseId = selectedWarehouseId ?? defaultWarehouse
  const selectedInventory = book.inventory?.find((i) => i.warehouseId === effectiveWarehouseId)

  const price = currency === 'PEN' ? book.pricePen : book.priceUsd
  const totalStock = (book.inventory ?? []).reduce((s, i) => s + i.stockAvailable, 0)
  const canAdd = totalStock > 0 && selectedInventory && selectedInventory.stockAvailable > 0

  function handleAdd() {
    if (!book || !selectedInventory) return
    addItem({
      bookId: book.id,
      title: book.title,
      slug: book.slug,
      coverColor: book.metaTitle || '#7c2d12',
      unitPrice: price,
      warehouseId: selectedInventory.warehouseId,
      warehouseName: selectedInventory.warehouse.name,
      originType: book.originType,
    }, quantity)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8 rounded-sm border border-border bg-card">
      {/* Selector de almacén */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <h3 className="font-serif text-lg font-semibold">Disponibilidad por almacén</h3>
        </div>
        <div className="space-y-2">
          {book.inventory?.map((inv) => {
            const isSelected = inv.warehouseId === effectiveWarehouseId
            const hasStock = inv.stockAvailable > 0
            return (
              <button
                key={inv.id}
                onClick={() => hasStock && setSelectedWarehouseId(inv.warehouseId)}
                disabled={!hasStock}
                className={`w-full p-3 rounded-sm border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : hasStock
                    ? 'border-border hover:border-primary/40'
                    : 'border-border opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
                    {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{inv.warehouse.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {inv.warehouse.code === 'CENTRAL' ? 'Envío a domicilio' : 'Retiro en tienda'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${hasStock ? 'text-emerald-700 dark:text-emerald-500' : 'text-destructive'}`}>
                    {inv.stockAvailable} disp.
                  </div>
                  {inv.stockConsigned > 0 && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {inv.stockConsigned} consignados
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Compra */}
      <div className="flex flex-col">
        <div className="text-xs uppercase tracking-editorial text-muted-foreground">Precio</div>
        <div className="font-serif text-3xl font-semibold text-primary mb-4">
          {formatPrice(price, currency)}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs uppercase tracking-editorial text-muted-foreground">Cantidad</span>
          <div className="flex items-center border border-border rounded-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <span className="w-10 text-center text-sm font-medium tabular-nums">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none"
              onClick={() => setQuantity((q) => Math.min(selectedInventory?.stockAvailable ?? 1, q + 1))}
              disabled={!selectedInventory || quantity >= selectedInventory.stockAvailable}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <Button size="lg" className="h-12" onClick={handleAdd} disabled={!canAdd}>
          <ShoppingCart className="w-4 h-4 mr-2" strokeWidth={1.5} />
          {canAdd ? 'Agregar al carrito' : 'Sin stock disponible'}
        </Button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
          <Package className="w-3.5 h-3.5" strokeWidth={1.5} />
          {totalStock > 0 ? (
            <span>
              Stock total: <strong className="text-foreground">{totalStock} unidades</strong> en {book.inventory?.filter(i => i.stockAvailable > 0).length} almacén(es)
            </span>
          ) : (
            <span className="text-destructive">Libro temporalmente agotado</span>
          )}
        </div>
      </div>
    </div>
  )
}
