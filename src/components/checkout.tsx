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
import { Loader2, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import type { Warehouse } from '@/lib/types';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'El nombre es requerido'),
  customerEmail: z.string().email('Email inválido'),
  customerPhone: z.string().min(6, 'El teléfono es requerido'),
  customerAddress: z.string().min(5, 'La dirección es requerida'),
  customerCity: z.string().min(2, 'La ciudad es requerida'),
  warehouseId: z.string().min(1, 'Selecciona un punto de retiro'),
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
  const { checkoutOpen, setCheckoutOpen, cartItems, clearCart } = useAppStore();
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
    setSuccess(false);
    setOrderNumber('');
    reset();
  };

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Dialog open={checkoutOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle className="size-16 text-primary" />
            <h3 className="font-serif text-xl font-bold">
              ¡Pedido confirmado!
            </h3>
            <p className="text-sm text-muted-foreground">
              Tu orden <strong>{orderNumber}</strong> ha sido creada
              exitosamente. Recibirás un email de confirmación.
            </p>
            <Button onClick={handleClose} className="mt-2">
              Continuar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                Finalizar compra
              </DialogTitle>
              <DialogDescription>
                {cartItems.length} artículo{cartItems.length !== 1 ? 's' : ''} ·{' '}
                Total: <strong>S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre y apellido"
                  {...register('customerName')}
                />
                {errors.customerName && (
                  <p className="text-xs text-destructive">{errors.customerName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    {...register('customerEmail')}
                  />
                  {errors.customerEmail && (
                    <p className="text-xs text-destructive">{errors.customerEmail.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    placeholder="+51 987 654 321"
                    {...register('customerPhone')}
                  />
                  {errors.customerPhone && (
                    <p className="text-xs text-destructive">{errors.customerPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  placeholder="Av. / Jr. / Calle y número"
                  {...register('customerAddress')}
                />
                {errors.customerAddress && (
                  <p className="text-xs text-destructive">{errors.customerAddress.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad / Distrito *</Label>
                <Input
                  id="city"
                  placeholder="Lima"
                  {...register('customerCity')}
                />
                {errors.customerCity && (
                  <p className="text-xs text-destructive">{errors.customerCity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Punto de retiro *</Label>
                <Select onValueChange={(val) => setValue('warehouseId', val, { shouldValidate: true })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar punto de retiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.name} — {wh.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.warehouseId && (
                  <p className="text-xs text-destructive">{errors.warehouseId.message}</p>
                )}
              </div>

              <div className="rounded-lg bg-muted p-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Envío</span>
                  <span className="text-primary font-medium">Gratis</span>
                </div>
                <div className="mt-2 flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Procesando...
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