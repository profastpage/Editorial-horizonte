// ============================================================================
//  BOOK DETAIL DIALOG — Ficha del libro + multi-warehouse stock + add to cart
// ============================================================================
'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, MapPin, Minus, Package, Plus, ShoppingCart, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookCover } from '@/components/book-cover'
import { useCart, useUI } from '@/lib/store'
import { formatPrice, formatDate } from '@/lib/utils'
import type { BookWithRelations } from '@/lib/types'

interface BookDetailDialogProps {
  book: BookWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookDetailDialog({ book, open, onOpenChange }: BookDetailDialogProps) {
  const { addItem } = useCart()
  const { currency } = useUI()
  const [quantity, setQuantity] = useState(1)
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null)

  // Selección automática del primer almacén con stock
  const defaultWarehouse = useMemo(() => {
    if (!book) return null
    const withStock = book.inventory?.filter((i) => i.stockAvailable > 0)
    return withStock?.[0]?.warehouseId ?? book.inventory?.[0]?.warehouseId ?? null
  }, [book])

  const effectiveWarehouseId = selectedWarehouseId ?? defaultWarehouse
  const selectedInventory = book?.inventory?.find((i) => i.warehouseId === effectiveWarehouseId)

  if (!book) return null

  const price = currency === 'PEN' ? book.pricePen : book.priceUsd
  const totalStock = (book.inventory ?? []).reduce((s, i) => s + i.stockAvailable, 0)
  const authorName = book.authors?.[0]?.fullName
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
    onOpenChange(false)
    setQuantity(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-hidden p-0">
        <div className="grid lg:grid-cols-5 max-h-[92vh] overflow-y-auto scrollbar-editorial">
          {/* Portada */}
          <div className="lg:col-span-2 p-8 lg:p-12 bg-secondary/30 flex items-center justify-center">
            <motion.div
              initial={{ rotateZ: -2, scale: 0.95 }}
              animate={{ rotateZ: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <BookCover
                title={book.title}
                authorName={authorName}
                coverColor={book.metaTitle || '#7c2d12'}
                size="xl"
              />
            </motion.div>
          </div>

          {/* Detalle */}
          <div className="lg:col-span-3 p-6 lg:p-10 flex flex-col">
            <DialogHeader className="p-0 text-left">
              {authorName && (
                <div className="text-xs uppercase tracking-editorial text-muted-foreground mb-2">
                  {authorName}
                </div>
              )}
              <DialogTitle className="font-serif text-3xl lg:text-4xl font-semibold leading-tight text-balance">
                {book.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-2 flex flex-wrap items-center gap-2">
                {book.publisher && <span>{book.publisher.name}</span>}
                {book.publicationDate && (
                  <>
                    <span className="text-border">·</span>
                    <span>{formatDate(book.publicationDate, { year: 'numeric', month: 'long' })}</span>
                  </>
                )}
                {book.pages && (
                  <>
                    <span className="text-border">·</span>
                    <span>{book.pages} págs.</span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            {/* Tabs */}
            <Tabs defaultValue="sinopsis" className="mt-6 flex-1 flex flex-col">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="sinopsis">Sinopsis</TabsTrigger>
                <TabsTrigger value="ficha">Ficha técnica</TabsTrigger>
                <TabsTrigger value="disponibilidad">Disponibilidad</TabsTrigger>
              </TabsList>

              <TabsContent value="sinopsis" className="mt-4 flex-1">
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {book.synopsis || 'Sin sinopsis disponible.'}
                </p>

                {book.categories && book.categories.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {book.categories.map((c) => (
                      <Badge key={c.id} variant="secondary" className="text-xs">
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ficha" className="mt-4 flex-1">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {book.isbn && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">ISBN</dt>
                      <dd className="font-mono text-xs mt-1">{book.isbn}</dd>
                    </div>
                  )}
                  {book.edition && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">Edición</dt>
                      <dd className="mt-1">{book.edition}</dd>
                    </div>
                  )}
                  {book.language && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">Idioma</dt>
                      <dd className="mt-1">{book.language}</dd>
                    </div>
                  )}
                  {book.format && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">Formato</dt>
                      <dd className="mt-1 capitalize">{book.format === 'physical' ? 'Físico' : book.format}</dd>
                    </div>
                  )}
                  {book.dimensions && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">Dimensiones</dt>
                      <dd className="mt-1">{book.dimensions}</dd>
                    </div>
                  )}
                  {book.weightGrams && (
                    <div>
                      <dt className="text-xs uppercase tracking-editorial text-muted-foreground">Peso</dt>
                      <dd className="mt-1">{book.weightGrams} g</dd>
                    </div>
                  )}
                </dl>
              </TabsContent>

              <TabsContent value="disponibilidad" className="mt-4 flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Store className="w-4 h-4 text-primary" strokeWidth={1.5} />
                    <span className="text-sm font-medium">Disponibilidad por almacén</span>
                  </div>
                  {book.inventory?.map((inv) => {
                    const isSelected = inv.warehouseId === effectiveWarehouseId
                    const hasStock = inv.stockAvailable > 0
                    return (
                      <button
                        key={inv.id}
                        onClick={() => hasStock && setSelectedWarehouseId(inv.warehouseId)}
                        disabled={!hasStock}
                        className={`w-full p-4 rounded-sm border text-left transition-all flex items-center justify-between ${
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
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            {/* Footer de compra */}
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs uppercase tracking-editorial text-muted-foreground">
                    Precio
                  </div>
                  <div className="font-serif text-3xl font-semibold text-primary">
                    {formatPrice(price, currency)}
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-editorial text-muted-foreground">
                    Cantidad
                  </span>
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
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  className="flex-1 h-12"
                  onClick={handleAdd}
                  disabled={!canAdd}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  {canAdd ? 'Agregar al carrito' : 'Sin stock disponible'}
                </Button>
              </div>

              {/* Stock info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Package className="w-3.5 h-3.5" strokeWidth={1.5} />
                {totalStock > 0 ? (
                  <span>
                    Stock total: <strong className="text-foreground">{totalStock} unidades</strong> en {book.inventory?.filter(i => i.stockAvailable > 0).length} almacén(es)
                  </span>
                ) : (
                  <span className="text-destructive">Libro temporalmente agotado en todos los almacenes</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
