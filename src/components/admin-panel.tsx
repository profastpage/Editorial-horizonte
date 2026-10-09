'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionWrapper } from '@/components/section-wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  DollarSign,
  Package,
  Clock,
  BookOpen,
  Minus,
  Plus,
  Edit,
  PlusCircle,
  Eye,
} from 'lucide-react';
// ─── API helpers (replaces server actions for proxy compatibility) ───
const apiGet = (resource: string, params?: Record<string, string>) => {
  const url = params
    ? `/api?resource=${resource}&${new URLSearchParams(params).toString()}`
    : `/api?resource=${resource}`;
  return fetch(url).then((r) => { if (!r.ok) throw new Error('API error'); return r.json(); });
};
const apiPost = (action: string, body: unknown) =>
  fetch(`/api?action=${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then((r) => r.json());
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  DashboardStats,
  OrderData,
  InventoryRecord,
  Warehouse,
} from '@/lib/types';

// ─── Admin Login ───

function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await import('@/lib/actions').then((m) =>
        apiPost('loginAdmin', { password })
      );
      if (result) {
        onAuth();
      } else {
        setError('Contraseña incorrecta');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-12">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Edit className="size-6 text-primary" />
        </div>
        <h3 className="font-serif text-xl font-bold">Panel de Administración</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Ingresá la contraseña para acceder
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="admin-pass">Contraseña</Label>
          <Input
            id="admin-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          Ingresar
        </Button>
      </form>
    </div>
  );
}

// ─── Dashboard Tab ───

function DashboardTab() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: () => apiGet('dashboard'),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (!stats) return null;

  const kpis = [
    {
      label: 'Ventas totales',
      value: `S/ ${stats.totalSales.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="size-4" />,
    },
    {
      label: 'Stock total',
      value: stats.totalStock.toLocaleString(),
      icon: <Package className="size-4" />,
    },
    {
      label: 'Órdenes pendientes',
      value: String(stats.pendingOrders),
      icon: <Clock className="size-4" />,
    },
    {
      label: 'Libros activos',
      value: String(stats.totalBooks),
      icon: <BookOpen className="size-4" />,
    },
  ];

  const barConfig = {
    sales: { label: 'Ventas', color: 'var(--color-primary)' },
  };

  const pieConfig = {
    'Fondo Propio': { label: 'Fondo Propio', color: 'var(--color-primary)' },
    Terceros: { label: 'Terceros', color: 'hsl(38, 92%, 50%)' },
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {kpi.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-lg font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Ventas por punto de venta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="h-64 w-full">
              <BarChart data={stats.salesByWarehouse} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Origen de libros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieConfig} className="h-64 w-full">
              <PieChart>
                <Pie
                  data={stats.booksByOrigin}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                >
                  {stats.booksByOrigin.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Inventario Tab ───

function InventarioTab() {
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');

  const { data: warehouses = [] } = useQuery<Warehouse[]>({
    queryKey: ['warehouses-inv'],
    queryFn: () => apiGet('warehouses') as Promise<Warehouse[]>,
  });

  const { data: inventory = [], isLoading } = useQuery<InventoryRecord[]>({
    queryKey: ['inventory', warehouseFilter],
    queryFn: () =>
      apiGet('inventory', warehouseFilter === 'all' ? undefined : { warehouseId: warehouseFilter }) as Promise<InventoryRecord[]>,
  });

  const queryClient = useQueryClient();

  const adjustMutation = useMutation({
    mutationFn: ({
      bookId,
      warehouseId,
      delta,
      type,
    }: {
      bookId: string;
      warehouseId: string;
      delta: number;
      type: string;
    }) => apiPost('updateInventory', { bookId, warehouseId, delta, movementType: type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Stock actualizado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function stockLevel(stock: number, min: number) {
    if (stock <= 0) return { color: 'text-red-500', bg: 'bg-red-50', label: 'Sin stock' };
    if (stock < min) return { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Bajo' };
    return { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'OK' };
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Inventario por almacén</h3>
        <Select
          value={warehouseFilter}
          onValueChange={setWarehouseFilter}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los almacenes</SelectItem>
            {warehouses.map((wh) => (
              <SelectItem key={wh.id} value={wh.id}>
                {wh.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libro</TableHead>
                  <TableHead>Almacén</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Consignado</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Ajuste</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((inv) => {
                  const level = stockLevel(inv.stockDisponible, inv.stockMinimo);
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="max-w-[200px] truncate font-medium text-xs">
                        {inv.book.title}
                      </TableCell>
                      <TableCell className="text-xs">
                        {inv.warehouse.name}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        {inv.stockDisponible}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm text-muted-foreground">
                        {inv.stockConsignado}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={`${level.color} ${level.bg} text-[10px]`}
                        >
                          {level.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            onClick={() =>
                              adjustMutation.mutate({
                                bookId: inv.bookId,
                                warehouseId: inv.warehouseId,
                                delta: -1,
                                type: 'ADJUSTMENT',
                              })
                            }
                          >
                            <Minus className="size-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            onClick={() =>
                              adjustMutation.mutate({
                                bookId: inv.bookId,
                                warehouseId: inv.warehouseId,
                                delta: 1,
                                type: 'RECEIPT',
                              })
                            }
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

// ─── Órdenes Tab ───

function OrdersTab() {
  const { data: orders = [], isLoading } = useQuery<OrderData[]>({
    queryKey: ['orders'],
    queryFn: () => apiGet('orders') as Promise<OrderData[]>,
  });

  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    DELIVERED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Órdenes de venta</h3>

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Orden</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Almacén</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Ver</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-xs">{order.customerName}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${statusColors[order.status] || ''}`}
                      >
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {order.warehouse?.name || '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      S/ {order.totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}

      {/* Order detail dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">
              {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p>{selectedOrder.customerEmail || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Teléfono</p>
                  <p>{selectedOrder.customerPhone || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ciudad</p>
                  <p>{selectedOrder.customerCity || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Almacén</p>
                  <p>{selectedOrder.warehouse?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pago</p>
                  <p>{selectedOrder.paymentMethod || 'Pendiente'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-sm font-medium">Items</p>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="font-mono">
                        S/ {item.subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>S/ {selectedOrder.subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>Descuento</span>
                    <span>-S/ {selectedOrder.discountAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total</span>
                  <span className="text-primary">
                    S/ {selectedOrder.totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Creada:{' '}
                {new Date(selectedOrder.createdAt).toLocaleString('es-PE')}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Libros Tab (Admin CRUD) ───

const bookFormSchema = z.object({
  title: z.string().min(2, 'El título es requerido'),
  price: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  costPrice: z.coerce.number().optional(),
  pages: z.coerce.number().optional(),
  publicationYear: z.coerce.number().optional(),
  synopsis: z.string().optional(),
  originType: z.string(),
  publisherId: z.string().optional(),
  language: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

function LibrosTab() {
  const queryClient = useQueryClient();
  const [editBook, setEditBook] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['all-books'],
    queryFn: () => apiGet('allbooks'),
  });

  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: () => apiGet('authors'),
  });

  const { data: publishers = [] } = useQuery({
    queryKey: ['publishers'],
    queryFn: () => apiGet('publishers'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiPost('updateBook', { id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-books'] });
      toast.success('Libro actualizado');
      setEditBook(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiPost('createBook', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-books'] });
      toast.success('Libro creado');
      setShowCreate(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Gestión de libros</h3>
        <Button size="sm" className="gap-1.5" onClick={() => setShowCreate(true)}>
          <PlusCircle className="size-3.5" />
          Nuevo libro
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Autores</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Editar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book: any) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium text-xs max-w-[180px] truncate">
                      {book.title}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                      {book.authors?.map((a: any) => a.author.name).join(', ') || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={book.originType === 'PROPIO' ? 'default' : 'outline'}
                        className="text-[10px]"
                      >
                        {book.originType === 'PROPIO' ? 'Propio' : 'Tercero'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      S/ {book.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Badge
                          variant={book.isActive ? 'outline' : 'destructive'}
                          className="text-[10px]"
                        >
                          {book.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        {book.isFeatured && (
                          <Badge className="bg-amber-500 text-white text-[10px]">
                            ★
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        onClick={() => setEditBook(book)}
                      >
                        <Edit className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editBook} onOpenChange={(open) => !open && setEditBook(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar libro</DialogTitle>
          </DialogHeader>
          {editBook && (
            <EditBookForm
              book={editBook}
              onSubmit={(data) =>
                updateMutation.mutate({ id: editBook.id, data })
              }
              onCancel={() => setEditBook(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo libro</DialogTitle>
          </DialogHeader>
          <CreateBookForm
            authors={authors}
            publishers={publishers}
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowCreate(false)}
            loading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditBookForm({
  book,
  onSubmit,
  onCancel,
}: {
  book: any;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(book.title);
  const [price, setPrice] = useState(String(book.price));
  const [costPrice, setCostPrice] = useState(String(book.costPrice || ''));
  const [isActive, setIsActive] = useState(book.isActive);
  const [isFeatured, setIsFeatured] = useState(book.isFeatured);
  const [synopsis, setSynopsis] = useState(book.synopsis || '');
  const [pages, setPages] = useState(String(book.pages || ''));
  const [year, setYear] = useState(String(book.publicationYear || ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      price: Number(price),
      costPrice: costPrice ? Number(costPrice) : undefined,
      isActive,
      isFeatured,
      synopsis: synopsis || undefined,
      pages: pages ? Number(pages) : undefined,
      publicationYear: year ? Number(year) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs">Título</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Precio</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Costo</Label>
          <Input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Páginas</Label>
          <Input
            type="number"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Año</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Sinopsis</Label>
        <Input value={synopsis} onChange={(e) => setSynopsis(e.target.value)} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <Label className="text-xs">Activo</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
          <Label className="text-xs">Destacado</Label>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1" disabled={false}>
          Guardar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function CreateBookForm({
  authors,
  publishers,
  onSubmit,
  onCancel,
  loading,
}: {
  authors: any[];
  publishers: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [originType, setOriginType] = useState('PROPIO');
  const [publisherId, setPublisherId] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [pages, setPages] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      price: Number(price),
      costPrice: costPrice ? Number(costPrice) : undefined,
      originType,
      publisherId: originType === 'TERCERO' ? publisherId : undefined,
      synopsis: synopsis || undefined,
      pages: pages ? Number(pages) : undefined,
      publicationYear: year ? Number(year) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs">Título *</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Precio *</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Costo</Label>
          <Input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Tipo de fondo *</Label>
        <Select value={originType} onValueChange={setOriginType}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PROPIO">Fondo Propio</SelectItem>
            <SelectItem value="TERCERO">Tercero</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {originType === 'TERCERO' && (
        <div className="space-y-1">
          <Label className="text-xs">Editorial</Label>
          <Select value={publisherId} onValueChange={setPublisherId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar editorial" />
            </SelectTrigger>
            <SelectContent>
              {publishers.map((p: any) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Páginas</Label>
          <Input
            type="number"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Año publicación</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Sinopsis</Label>
        <Input value={synopsis} onChange={(e) => setSynopsis(e.target.value)} />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1" disabled={loading}>
          Crear libro
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

// ─── Main Admin Panel ───

export function AdminPanel() {
  const { isAdminAuth, setAdminAuth } = useAppStore();

  if (!isAdminAuth) {
    return (
      <SectionWrapper id="admin" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">
              Administración
            </h2>
          </div>
          <AdminLogin onAuth={() => setAdminAuth(true)} />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="admin" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            Panel de Administración
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestión integral del catálogo, inventario y ventas
          </p>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
            <TabsTrigger value="libros">Libros</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>
          <TabsContent value="inventario">
            <InventarioTab />
          </TabsContent>
          <TabsContent value="ordenes">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="libros">
            <LibrosTab />
          </TabsContent>
        </Tabs>
      </div>
    </SectionWrapper>
  );
}

