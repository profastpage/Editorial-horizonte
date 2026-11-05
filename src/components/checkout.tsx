'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle, CreditCard, Banknote, QrCode } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import type { Warehouse } from '@/lib/types';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'El nombre es requerido'),
  customerEmail: z.string().email('Email inválido'),
  customerPhone: z.string().min(6, 'El teléfono es requerido'),
  customerAddress: z.string().min(5, 'La dirección es requerida'),
  customerCity: z.string().min(2, 'El distrito o ciudad es requerido'),
  warehouseId: z.string().min(1, 'Selecciona entrega o punto de retiro'),
  paymentMethod: z.string().min(1, 'Selecciona un medio de pago'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

async function fetchWarehouses(): Promise<Warehouse[]> {
  const res = await fetch('/api?resource=warehouses');
  if (!res.ok) throw new Error('Error al cargar puntos de retiro');
  return res.json();
}

async function submitOrder(data: CheckoutForm & { items: Array<{ bookId: string; title: string; price: number; quantity: number; originType: string }> }) {
  const res = await fetch('/api?action=createOrder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Error al crear el pedido');
  return result;
}

export function CheckoutDialog() {
  const { checkoutOpen, setCheckoutOpen, cartItems, clearCart, cartTotal } = useAppStore();
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const queryClient = useQueryClient();

  const { data: warehouses = [] } = useQuery<Warehouse[]>({
    queryKey: ['warehouses'],
    queryFn: fetchWarehouses,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      customerCity: '',
      warehouseId: '',
      paymentMethod: 'TARJETA',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CheckoutForm) => submitOrder({ ...data, items: cartItems }),
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber);
      setSuccess(true);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('¡Pedido creado con éxito!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear el pedido');
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    setCheckoutOpen(false);
    if (success) {
      setSuccess(false);
      reset();
    }
  };

  const total = cartTotal();

  return (
    <Dialog open={checkoutOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl">
        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="size-9" />
            </div>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-bold">¡Pedido Confirmado!</DialogTitle>
              <DialogDescription className="text-sm">
                Hemos registrado tu solicitud con el código:
              </DialogDescription>
            </DialogHeader>
            <p className="font-mono text-xl font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl">
              {orderNumber}
            </p>
            <div className="text-xs text-muted-foreground max-w-sm leading-relaxed p-3 rounded-xl bg-muted/30">
              Coordinaremos la entrega a tu domicilio o la preparación para retiro en Jirón Sucre 470, San Miguel.
              Te escribiremos al WhatsApp con los detalles.
            </div>
            <Button onClick={handleClose} className="rounded-xl font-semibold">
              Volver a la tienda
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl sm:text-2xl font-bold">
                Finalizar Compra
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Completa tus datos para coordinar el retiro en San Miguel o delivery en Lima.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">Nombre y Apellidos *</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre completo"
                  className="rounded-xl h-10"
                  {...register('customerName')}
                />
                {errors.customerName && (
                  <p className="text-xs text-destructive">{errors.customerName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">Correo electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="rounded-xl h-10"
                    {...register('customerEmail')}
                  />
                  {errors.customerEmail && (
                    <p className="text-xs text-destructive">{errors.customerEmail.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">Teléfono / WhatsApp *</Label>
                  <Input
                    id="phone"
                    placeholder="+51 987 654 321"
                    className="rounded-xl h-10"
                    {...register('customerPhone')}
                  />
                  {errors.customerPhone && (
                    <p className="text-xs text-destructive">{errors.customerPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-semibold">Dirección de entrega *</Label>
                  <Input
                    id="address"
                    placeholder="Av. / Jr. / Calle y número"
                    className="rounded-xl h-10"
                    {...register('customerAddress')}
                  />
                  {errors.customerAddress && (
                    <p className="text-xs text-destructive">{errors.customerAddress.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold">Distrito (Lima) *</Label>
                  <Input
                    id="city"
                    placeholder="Ej. San Miguel, Miraflores..."
                    className="rounded-xl h-10"
                    {...register('customerCity')}
                  />
                  {errors.customerCity && (
                    <p className="text-xs text-destructive">{errors.customerCity.message}</p>
                  )}
                </div>
              </div>

              {/* Punto de Retiro o Delivery */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Modalidad de Entrega / Retiro *</Label>
                <Select onValueChange={(val) => setValue('warehouseId', val, { shouldValidate: true })}>
                  <SelectTrigger className="w-full rounded-xl h-10">
                    <SelectValue placeholder="Seleccionar modalidad de entrega" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.warehouseId && (
                  <p className="text-xs text-destructive">{errors.warehouseId.message}</p>
                )}
              </div>

              {/* Medio de Pago */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Medio de Pago *</Label>
                <Select
                  defaultValue="TARJETA"
                  onValueChange={(val) => setValue('paymentMethod', val, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full rounded-xl h-10">
                    <SelectValue placeholder="Seleccionar medio de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TARJETA">
                      💳 Tarjeta de Crédito / Débito (Visa, Mastercard, Amex)
                    </SelectItem>
                    <SelectItem value="YAPE_PLIN">
                      📱 Yape / Plin (Comprobante al WhatsApp)
                    </SelectItem>
                    <SelectItem value="TRANSFERENCIA">
                      🏦 Transferencia Bancaria (BCP / BBVA / Interbank)
                    </SelectItem>
                    <SelectItem value="EFECTIVO">
                      💵 Pago en efectivo al retirar en San Miguel
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total resumen */}
              <div className="rounded-xl bg-muted/50 p-3.5 space-y-1.5 border border-border/60">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal ({cartItems.length} libros)</span>
                  <span>S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Envío en Lima Metropolitana</span>
                  <span className="text-primary font-medium">Coordinado (o retiro gratuito)</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-foreground border-t border-border/50 pt-2">
                  <span>Total a pagar</span>
                  <span className="text-primary text-base">
                    S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 rounded-xl font-bold h-11"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Procesando orden...
                  </>
                ) : (
                  `Confirmar pedido por S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
