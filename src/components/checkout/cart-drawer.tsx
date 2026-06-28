// ============================================================================
//  CART DRAWER — Carrito lateral con animación
// ============================================================================
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCart, useUI } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { CheckoutDialog } from '@/components/checkout/checkout-dialog'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart()
  const { currency } = useUI()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const shipping = subtotal >= 150 ? 0 : 12
  const total = subtotal + shipping

  function handleCheckout() {
    closeCart()
    setCheckoutOpen(true)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(v) => (v ? null : closeCart())}>
        <SheetContent side="right" className="w-full sm:w-[480px] p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-serif text-2xl flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" strokeWidth={1.5} />
                Carrito
              </SheetTitle>
              <Button variant="ghost" size="icon" onClick={closeCart} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
            </p>
          </SheetHeader>

          {/* Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" strokeWidth={1.2} />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Tu carrito está vacío</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Explora el catálogo y agrega los libros que quieras leer.
              </p>
              <Button onClick={closeCart} variant="outline">
                Continuar explorando
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto scrollbar-editorial p-6 space-y-5">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.bookId}-${item.warehouseId}`}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="flex gap-4"
                    >
                      {/* Mini portada */}
                      <div
                        className="w-16 h-24 rounded-sm flex-shrink-0 flex items-center justify-center font-serif text-2xl font-bold text-white/90 shadow-md"
                        style={{ background: `linear-gradient(135deg, ${item.coverColor}, ${item.coverColor}cc)` }}
                      >
                        {item.title.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-semibold text-sm leading-snug line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-[10px] uppercase tracking-editorial text-muted-foreground mt-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-primary/60" />
                          {item.warehouseName}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-border rounded-sm">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() => updateQuantity(item.bookId, item.warehouseId, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-xs font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() => updateQuantity(item.bookId, item.warehouseId, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-serif text-sm font-semibold">
                              {formatPrice(item.unitPrice * item.quantity, currency)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.bookId, item.warehouseId)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-6 space-y-4 bg-card/30">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground tabular-nums">
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    {shipping === 0 ? (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        Gratis
                      </Badge>
                    ) : (
                      <span className="font-medium text-foreground tabular-nums">
                        {formatPrice(shipping, currency)}
                      </span>
                    )}
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      Te faltan {formatPrice(150 - subtotal, currency)} para envío gratis.
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-lg font-semibold">Total</span>
                  <span className="font-serif text-2xl font-semibold text-primary tabular-nums">
                    {formatPrice(total, currency)}
                  </span>
                </div>

                <Button size="lg" className="w-full h-12" onClick={handleCheckout}>
                  Finalizar compra
                  <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  )
}

