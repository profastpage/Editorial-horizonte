// ============================================================================
//  CHECKOUT DIALOG — Multi-paso: datos → envío → pago → confirmación
// ============================================================================
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CreditCard, Loader2, Lock, Package, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCart, useUI } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { checkoutAction } from '@/lib/actions'
import { toast } from 'sonner'
import type { PaymentProvider } from '@/lib/types'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 'customer' | 'shipping' | 'payment' | 'processing' | 'success' | 'error'

const STEPS: Array<{ id: Step; label: string }> = [
  { id: 'customer', label: 'Datos' },
  { id: 'shipping', label: 'Envío' },
  { id: 'payment', label: 'Pago' },
]

const PAYMENT_PROVIDERS: Array<{
  id: PaymentProvider
  name: string
  description: string
  currencies: Array<'PEN' | 'USD'>
  badge: string
}> = [
  { id: 'mercadopago', name: 'Mercado Pago', description: 'Tarjeta, Yape, Plin, efectivo', currencies: ['PEN', 'USD'], badge: 'Recomendado' },
  { id: 'izipay', name: 'IZIPay', description: 'Visa, Mastercard, Amex — Perú', currencies: ['PEN'], badge: 'Local' },
  { id: 'paypal', name: 'PayPal', description: 'Pago internacional seguro', currencies: ['USD'], badge: 'Internacional' },
]

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { items, clear } = useCart()
  const { currency } = useUI()
  const [step, setStep] = useState<Step>('customer')
  const [provider, setProvider] = useState<PaymentProvider>('mercadopago')
  const [error, setError] = useState<string>('')
  const [orderNumber, setOrderNumber] = useState<string>('')

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    line1: '',
    line2: '',
    city: 'Lima',
    state: 'Lima',
    postalCode: '',
    country: 'Perú',
    notes: '',
  })

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const shipping = subtotal >= 150 ? 0 : 12
  const total = subtotal + shipping

  const availableProviders = PAYMENT_PROVIDERS.filter((p) => p.currencies.includes(currency))

  function updateField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validateCustomer() {
    if (!form.customerName || form.customerName.length < 2) {
      setError('Ingresa tu nombre completo.')
      return false
    }
    if (!form.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      setError('Ingresa un email válido.')
      return false
    }
    if (!form.customerPhone || form.customerPhone.length < 6) {
      setError('Ingresa un teléfono válido.')
      return false
    }
    setError('')
    return true
  }

  function validateShipping() {
    if (!form.line1 || form.line1.length < 5) {
      setError('Ingresa una dirección válida.')
      return false
    }
    if (!form.city) {
      setError('Ingresa la ciudad.')
      return false
    }
    setError('')
    return true
  }

  async function handlePay() {
    setStep('processing')
    setError('')

    const result = await checkoutAction({
      customerEmail: form.customerEmail,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      shippingAddress: {
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode || undefined,
        country: form.country,
      },
      paymentProvider: provider,
      notes: form.notes || undefined,
      items: items.map((i) => ({
        bookId: i.bookId,
        warehouseId: i.warehouseId,
        quantity: i.quantity,
      })),
      currency,
    })

    if (result.success && result.orderNumber) {
      setOrderNumber(result.orderNumber)
      clear()
      setStep('success')
      toast.success('¡Compra completada!', {
        description: `Orden ${result.orderNumber} confirmada.`,
      })
    } else {
      setStep('error')
      setError(result.error || 'Error desconocido.')
      if (result.errorCode === 'STOCK_INSUFFICIENT') {
        toast.error('Stock insuficiente', {
          description: 'Algunos libros ya no están disponibles. Revisa tu carrito.',
        })
      }
    }
  }

  function reset() {
    setStep('customer')
    setError('')
    setOrderNumber('')
    setForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      line1: '',
      line2: '',
      city: 'Lima',
      state: 'Lima',
      postalCode: '',
      country: 'Perú',
      notes: '',
    })
  }

  function handleClose(open: boolean) {
    if (!open && (step === 'success' || step === 'error')) {
      reset()
    }
    onOpenChange(open)
  }

  const currentStepIndex = STEPS.findIndex((s) => s.id === step)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto scrollbar-editorial p-0">
        <DialogHeader className="p-6 border-b border-border">
          <DialogTitle className="font-serif text-2xl">
            {step === 'success' ? '¡Compra completada!' :
             step === 'error' ? 'Error en la compra' :
             step === 'processing' ? 'Procesando pago...' :
             'Finalizar compra'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulario de checkout multi-paso para completar tu compra en Editorial Horizonte.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        {step !== 'success' && step !== 'error' && step !== 'processing' && (
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between">
              {STEPS.map((s, idx) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                      idx < currentStepIndex
                        ? 'bg-primary border-primary text-primary-foreground'
                        : idx === currentStepIndex
                        ? 'border-primary text-primary'
                        : 'border-border text-muted-foreground'
                    }`}>
                      {idx < currentStepIndex ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-xs uppercase tracking-editorial ${
                      idx === currentStepIndex ? 'text-primary font-semibold' : 'text-muted-foreground'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-4 ${idx < currentStepIndex ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Datos del cliente */}
            {step === 'customer' && (
              <motion.div
                key="customer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="co-name">Nombre completo</Label>
                    <Input
                      id="co-name"
                      value={form.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                      placeholder="Tu nombre y apellido"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="co-email">Email</Label>
                    <Input
                      id="co-email"
                      type="email"
                      value={form.customerEmail}
                      onChange={(e) => updateField('customerEmail', e.target.value)}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-phone">Teléfono</Label>
                  <Input
                    id="co-phone"
                    value={form.customerPhone}
                    onChange={(e) => updateField('customerPhone', e.target.value)}
                    placeholder="+51 999 888 777"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex justify-end pt-4">
                  <Button
                    size="lg"
                    onClick={() => validateCustomer() && setStep('shipping')}
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Envío */}
            {step === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="co-line1">Dirección</Label>
                  <Input
                    id="co-line1"
                    value={form.line1}
                    onChange={(e) => updateField('line1', e.target.value)}
                    placeholder="Av. / calle / número / dpto."
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="co-city">Ciudad</Label>
                    <Input
                      id="co-city"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="co-state">Departamento</Label>
                    <Input
                      id="co-state"
                      value={form.state}
                      onChange={(e) => updateField('state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="co-postal">Código postal</Label>
                    <Input
                      id="co-postal"
                      value={form.postalCode}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-notes">Notas para la entrega (opcional)</Label>
                  <Textarea
                    id="co-notes"
                    rows={2}
                    value={form.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Referencias, horario preferido, etc."
                    className="resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-sm bg-secondary/50 text-xs text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  {shipping === 0
                    ? '¡Tienes envío gratis! Entrega estimada: 2-3 días hábiles.'
                    : `Envío: ${formatPrice(shipping, currency)}. Gratis a partir de ${formatPrice(150, currency)}.`}
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" size="lg" onClick={() => setStep('customer')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => validateShipping() && setStep('payment')}
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Pago */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <Label className="text-xs uppercase tracking-editorial mb-3 block">
                    Método de pago
                  </Label>
                  <RadioGroup
                    value={provider}
                    onValueChange={(v) => setProvider(v as PaymentProvider)}
                    className="space-y-2"
                  >
                    {availableProviders.map((p) => (
                      <label
                        key={p.id}
                        htmlFor={`pay-${p.id}`}
                        className={`flex items-start gap-3 p-4 rounded-sm border cursor-pointer transition-all ${
                          provider === p.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <RadioGroupItem value={p.id} id={`pay-${p.id}`} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{p.name}</span>
                            <span className="text-[10px] uppercase tracking-editorial px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                        </div>
                        <CreditCard className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                {/* Resumen */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-medium tabular-nums">{formatPrice(subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="font-medium tabular-nums">
                      {shipping === 0 ? 'Gratis' : formatPrice(shipping, currency)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-serif text-lg font-semibold">Total</span>
                    <span className="font-serif text-2xl font-semibold text-primary tabular-nums">
                      {formatPrice(total, currency)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" strokeWidth={1.5} />
                  Pago cifrado SSL. No almacenamos datos de tarjeta.
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" size="lg" onClick={() => setStep('shipping')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                  </Button>
                  <Button size="lg" onClick={handlePay}>
                    <Lock className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Pagar {formatPrice(total, currency)}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* PROCESSING */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 flex flex-col items-center text-center"
              >
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" strokeWidth={1.2} />
                <h3 className="font-serif text-xl font-semibold mb-2">Procesando tu pago</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Estamos confirmando la transacción y reservando tus libros. Esto puede
                  tardar unos segundos. No cierres esta ventana.
                </p>
              </motion.div>
            )}

            {/* SUCCESS */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-6"
                >
                  <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                </motion.div>

                <h3 className="font-serif text-3xl font-semibold mb-2">¡Gracias por tu compra!</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  Hemos enviado la confirmación a <strong>{form.customerEmail}</strong>.
                  Tus libros están reservados y el stock se descontó automáticamente.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-secondary text-sm mb-8">
                  <Package className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  <span className="text-muted-foreground">Orden:</span>
                  <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => handleClose(false)}>
                    Cerrar
                  </Button>
                  <Button onClick={() => handleClose(false)}>
                    Seguir explorando
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ERROR */}
            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                  <Package className="w-10 h-10 text-destructive" strokeWidth={1.5} />
                </div>

                <h3 className="font-serif text-2xl font-semibold mb-2">No se pudo completar</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">{error}</p>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => handleClose(false)}>
                    Cerrar
                  </Button>
                  <Button onClick={() => setStep('payment')}>
                    Reintentar pago
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
