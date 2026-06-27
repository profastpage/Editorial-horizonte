// ============================================================================
//  ADMIN PANEL — Dashboard ERP protegido
//  - Login simple (valida contra settings.admin_password)
//  - Métricas globales + gráficos (recharts)
//  - Inventario multi-almacén
//  - Consignaciones activas
//  - Movimientos de stock (auditoría)
//  - Edición de libros (precio, sinopsis, portada, destacar)
//  - Ajuste manual de inventario
// ============================================================================
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, BarChart3, Boxes, Building2, Lock, LogOut, Package,
  Settings as SettingsIcon, ShoppingBag, TrendingUp, Upload, X,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUI } from '@/lib/store'
import { adminLoginAction, updateBookAction, adjustInventoryAction } from '@/lib/actions'
import { toast } from 'sonner'
import { formatPrice, formatDate, formatRelative, cn } from '@/lib/utils'

interface AdminMetrics {
  totals: {
    books: number
    orders: number
    customers: number
    lowStock: number
    activeConsignments: number
    revenue: number
  }
  salesByDay: Array<{ date: string; total: number; count: number }>
  stockByWarehouse: Array<{ name: string; code: string; available: number; consigned: number; reserved: number; books: number }>
  salesByOrigin: { own: number; third_party: number }
  topBooks: Array<{ title: string; quantity: number; revenue: number }>
  recentOrders: Array<{
    id: string; orderNumber: string; customerName: string; customerEmail: string;
    status: string; totalAmount: number; currency: string; createdAt: string;
    warehouse: { name: string; code: string } | null; itemsCount: number;
  }>
  recentMovements: Array<{
    id: string; bookTitle: string; warehouseCode: string; movementType: string;
    quantity: number; balanceBefore: number; balanceAfter: number; notes: string | null;
    createdAt: string;
  }>
  inventory: Array<{
    id: string; stockAvailable: number; stockConsigned: number; stockReserved: number; minThreshold: number;
    book: { id: string; title: string; originType: string; publisher: { name: string } | null }
    warehouse: { id: string; name: string; code: string }
  }>
}

interface AdminSheetProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  metrics: AdminMetrics | null
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

const MOVEMENT_LABELS: Record<string, { label: string; sign: '+' | '-' | '·' }> = {
  sale: { label: 'Venta', sign: '-' },
  return: { label: 'Devolución', sign: '+' },
  consignment_in: { label: 'Consignación', sign: '·' },
  consignment_out: { label: 'Consign. salida', sign: '·' },
  adjustment: { label: 'Ajuste', sign: '·' },
  transfer_in: { label: 'Transferencia entrada', sign: '+' },
  transfer_out: { label: 'Transferencia salida', sign: '-' },
  manual_in: { label: 'Entrada manual', sign: '+' },
  manual_out: { label: 'Salida manual', sign: '-' },
  initial_stock: { label: 'Stock inicial', sign: '+' },
  reservation: { label: 'Reserva', sign: '-' },
  reservation_release: { label: 'Liberación', sign: '+' },
}

const CHART_COLORS = ['#7c2d12', '#0f766e', '#4d7c0f', '#155e75', '#831843']

export function AdminSheet({ open, onOpenChange, metrics }: AdminSheetProps) {
  const { adminMode, setAdminMode } = useUI()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [editingBook, setEditingBook] = useState<null | {
    id: string; title: string; pricePen: number; priceUsd: number; synopsis: string; isFeatured: boolean; isActive: boolean
  }>(null)
  const [adjustingInv, setAdjustingInv] = useState<null | {
    id: string; bookId: string; warehouseId: string; bookTitle: string; warehouseName: string; currentStock: number
  }>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoggingIn(true)
    const result = await adminLoginAction({ email, password })
    setLoggingIn(false)
    if (result.success) {
      setAdminMode(true)
      toast.success(`Bienvenido, ${result.profile?.fullName}`, {
        description: `Rol: ${result.profile?.role}`,
      })
    } else {
      toast.error('Acceso denegado', { description: result.error })
    }
  }

  function handleLogout() {
    setAdminMode(false)
    setEmail('')
    setPassword('')
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-none sm:w-[90vw] max-w-[1400px] p-0 flex flex-col">
        {!adminMode ? (
          // LOGIN
          <div className="flex-1 flex items-center justify-center p-8 bg-secondary/30">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md p-8 bg-card border border-border rounded-sm shadow-sm"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 rounded-sm bg-primary flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-primary-foreground" strokeWidth={1.5} />
                </div>
                <h2 className="font-serif text-2xl font-semibold">Panel Administrador</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Acceso restringido al equipo de Editorial Horizonte.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@editorialhorizonte.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-pass">Contraseña</Label>
                  <Input
                    id="admin-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loggingIn}>
                  {loggingIn ? 'Verificando...' : 'Ingresar'}
                </Button>
              </form>

              <div className="mt-6 p-3 rounded-sm bg-muted/50 text-xs text-muted-foreground">
                <strong className="text-foreground">Demo:</strong> admin@editorialhorizonte.com / horizonte2024
              </div>
            </motion.div>
          </div>
        ) : (
          // DASHBOARD
          <>
            <SheetHeader className="p-6 border-b border-border bg-card/50">
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="font-serif text-2xl flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    Panel ERP — Editorial Horizonte
                  </SheetTitle>
                  <SheetDescription className="mt-1">
                    Sistema de control multi-almacén y consignaciones en tiempo real.
                  </SheetDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Salir
                </Button>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-6 h-auto">
                    <TabsTrigger value="overview" className="flex items-center gap-2 py-2">
                      <BarChart3 className="w-4 h-4" /> Resumen
                    </TabsTrigger>
                    <TabsTrigger value="inventory" className="flex items-center gap-2 py-2">
                      <Boxes className="w-4 h-4" /> Inventario
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex items-center gap-2 py-2">
                      <ShoppingBag className="w-4 h-4" /> Órdenes
                    </TabsTrigger>
                    <TabsTrigger value="movements" className="flex items-center gap-2 py-2">
                      <Activity className="w-4 h-4" /> Auditoría
                    </TabsTrigger>
                    <TabsTrigger value="books" className="flex items-center gap-2 py-2">
                      <Package className="w-4 h-4" /> Catálogo
                    </TabsTrigger>
                  </TabsList>

                  {/* OVERVIEW */}
                  <TabsContent value="overview" className="space-y-6">
                    {metrics && (
                      <>
                        {/* KPI cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                          <KpiCard label="Ingresos totales" value={formatPrice(metrics.totals.revenue)} icon={TrendingUp} accent />
                          <KpiCard label="Órdenes" value={String(metrics.totals.orders)} icon={ShoppingBag} />
                          <KpiCard label="Clientes" value={String(metrics.totals.customers)} icon={Building2} />
                          <KpiCard label="Títulos" value={String(metrics.totals.books)} icon={Package} />
                          <KpiCard label="Stock bajo" value={String(metrics.totals.lowStock)} icon={Boxes} warning />
                          <KpiCard label="Consignaciones" value={String(metrics.totals.activeConsignments)} icon={Activity} />
                        </div>

                        {/* Sales chart */}
                        <div className="grid lg:grid-cols-3 gap-4">
                          <div className="lg:col-span-2 p-5 rounded-sm border border-border bg-card">
                            <h3 className="font-serif text-lg font-semibold mb-1">Ventas (últimos 30 días)</h3>
                            <p className="text-xs text-muted-foreground mb-4">Ingresos diarios en soles</p>
                            <ResponsiveContainer width="100%" height={260}>
                              <AreaChart data={metrics.salesByDay}>
                                <defs>
                                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7c2d12" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#7c2d12" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                  dataKey="date"
                                  tickFormatter={(d) => d.slice(5)}
                                  tick={{ fontSize: 10 }}
                                  stroke="rgba(0,0,0,0.4)"
                                />
                                <YAxis tick={{ fontSize: 10 }} stroke="rgba(0,0,0,0.4)" />
                                <Tooltip
                                  formatter={(v: number) => [formatPrice(v), 'Ingresos']}
                                  labelFormatter={(l) => formatDate(l as string, { day: 'numeric', month: 'long' })}
                                  contentStyle={{ borderRadius: '4px', border: '1px solid #e5e5e5', fontSize: 12 }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="total"
                                  stroke="#7c2d12"
                                  strokeWidth={2}
                                  fill="url(#salesGrad)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Sales by origin */}
                          <div className="p-5 rounded-sm border border-border bg-card">
                            <h3 className="font-serif text-lg font-semibold mb-1">Ventas por origen</h3>
                            <p className="text-xs text-muted-foreground mb-4">Fondo propio vs terceras</p>
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Fondo editorial propio', value: metrics.salesByOrigin.own, color: CHART_COLORS[0] },
                                    { name: 'Terceras editoriales', value: metrics.salesByOrigin.third_party, color: CHART_COLORS[1] },
                                  ]}
                                  dataKey="value"
                                  nameKey="name"
                                  innerRadius={45}
                                  outerRadius={80}
                                  paddingAngle={2}
                                >
                                  {[CHART_COLORS[0], CHART_COLORS[1]].map((c, i) => (
                                    <Cell key={i} fill={c} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => formatPrice(v)} contentStyle={{ borderRadius: '4px', fontSize: 12 }} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-1.5 mt-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: CHART_COLORS[0] }} />
                                  Fondo editorial
                                </span>
                                <span className="font-semibold tabular-nums">{formatPrice(metrics.salesByOrigin.own)}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: CHART_COLORS[1] }} />
                                  Terceras editoriales
                                </span>
                                <span className="font-semibold tabular-nums">{formatPrice(metrics.salesByOrigin.third_party)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stock by warehouse + Top books */}
                        <div className="grid lg:grid-cols-2 gap-4">
                          <div className="p-5 rounded-sm border border-border bg-card">
                            <h3 className="font-serif text-lg font-semibold mb-1">Stock por almacén</h3>
                            <p className="text-xs text-muted-foreground mb-4">Unidades totales disponibles y consignadas</p>
                            <ResponsiveContainer width="100%" height={220}>
                              <BarChart data={metrics.stockByWarehouse} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                <XAxis type="number" tick={{ fontSize: 10 }} stroke="rgba(0,0,0,0.4)" />
                                <YAxis dataKey="code" type="category" tick={{ fontSize: 11 }} stroke="rgba(0,0,0,0.4)" width={50} />
                                <Tooltip contentStyle={{ borderRadius: '4px', fontSize: 12 }} />
                                <Legend wrapperStyle={{ fontSize: 11 }} />
                                <Bar dataKey="available" name="Disponible" stackId="a" fill={CHART_COLORS[0]} />
                                <Bar dataKey="consigned" name="Consignado" stackId="a" fill={CHART_COLORS[1]} />
                                <Bar dataKey="reserved" name="Reservado" stackId="a" fill={CHART_COLORS[2]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="p-5 rounded-sm border border-border bg-card">
                            <h3 className="font-serif text-lg font-semibold mb-1">Top 5 libros más vendidos</h3>
                            <p className="text-xs text-muted-foreground mb-4">Por ingresos totales</p>
                            <div className="space-y-3">
                              {metrics.topBooks.map((book, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                    {i + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{book.title}</div>
                                    <div className="text-xs text-muted-foreground">{book.quantity} unidades vendidas</div>
                                  </div>
                                  <div className="text-sm font-semibold tabular-nums text-primary">
                                    {formatPrice(book.revenue)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  {/* INVENTORY */}
                  <TabsContent value="inventory">
                    <div className="rounded-sm border border-border bg-card overflow-hidden">
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <div>
                          <h3 className="font-serif text-lg font-semibold">Inventario multi-almacén</h3>
                          <p className="text-xs text-muted-foreground">Stock por libro × almacén · click en una fila para ajustar</p>
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          {metrics?.inventory.length ?? 0} registros
                        </Badge>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Libro</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Editorial</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Origen</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Almacén</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Disp.</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Consig.</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Acción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {metrics?.inventory.slice(0, 50).map((inv) => (
                              <tr key={inv.id} className="border-t border-border hover:bg-muted/30">
                                <td className="p-3 font-medium max-w-[260px] truncate">{inv.book.title}</td>
                                <td className="p-3 text-muted-foreground text-xs">{inv.book.publisher?.name ?? '—'}</td>
                                <td className="p-3">
                                  <Badge variant={inv.book.originType === 'own' ? 'default' : 'secondary'} className="text-[10px]">
                                    {inv.book.originType === 'own' ? 'Fondo' : 'Tercera'}
                                  </Badge>
                                </td>
                                <td className="p-3 text-xs font-mono">{inv.warehouse.code}</td>
                                <td className={cn('p-3 text-right font-mono tabular-nums font-semibold', inv.stockAvailable <= inv.minThreshold ? 'text-destructive' : 'text-emerald-700 dark:text-emerald-500')}>
                                  {inv.stockAvailable}
                                </td>
                                <td className="p-3 text-right font-mono tabular-nums text-muted-foreground">
                                  {inv.stockConsigned}
                                </td>
                                <td className="p-3 text-right">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setAdjustingInv({
                                      id: inv.id,
                                      bookId: inv.book.id,
                                      warehouseId: inv.warehouse.id,
                                      bookTitle: inv.book.title,
                                      warehouseName: inv.warehouse.name,
                                      currentStock: inv.stockAvailable,
                                    })}
                                  >
                                    Ajustar
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* ORDERS */}
                  <TabsContent value="orders">
                    <div className="rounded-sm border border-border bg-card overflow-hidden">
                      <div className="p-4 border-b border-border">
                        <h3 className="font-serif text-lg font-semibold">Órdenes recientes</h3>
                        <p className="text-xs text-muted-foreground">Últimas 10 órdenes procesadas</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Orden</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Cliente</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Almacén</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Estado</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Total</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Fecha</th>
                            </tr>
                          </thead>
                          <tbody>
                            {metrics?.recentOrders.map((o) => (
                              <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                                <td className="p-3 font-mono text-xs">{o.orderNumber}</td>
                                <td className="p-3">
                                  <div className="font-medium">{o.customerName ?? '—'}</div>
                                  <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                                </td>
                                <td className="p-3 text-xs font-mono">{o.warehouse?.code ?? '—'}</td>
                                <td className="p-3">
                                  <span className={cn('inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-editorial', STATUS_COLORS[o.status])}>
                                    {o.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right font-semibold tabular-nums">
                                  {formatPrice(o.totalAmount, o.currency as any)}
                                </td>
                                <td className="p-3 text-right text-xs text-muted-foreground">
                                  {formatRelative(o.createdAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* MOVEMENTS */}
                  <TabsContent value="movements">
                    <div className="rounded-sm border border-border bg-card overflow-hidden">
                      <div className="p-4 border-b border-border">
                        <h3 className="font-serif text-lg font-semibold">Auditoría de movimientos</h3>
                        <p className="text-xs text-muted-foreground">Bitácora inmutable · últimos 50 registros</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Fecha</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Libro</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Almacén</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Tipo</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Cant.</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Antes</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Después</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Notas</th>
                            </tr>
                          </thead>
                          <tbody>
                            {metrics?.recentMovements.map((m) => {
                              const meta = MOVEMENT_LABELS[m.movementType] ?? { label: m.movementType, sign: '·' as const }
                              return (
                                <tr key={m.id} className="border-t border-border hover:bg-muted/30">
                                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{formatRelative(m.createdAt)}</td>
                                  <td className="p-3 font-medium max-w-[240px] truncate">{m.bookTitle}</td>
                                  <td className="p-3 text-xs font-mono">{m.warehouseCode}</td>
                                  <td className="p-3">
                                    <span className="text-xs">{meta.label}</span>
                                  </td>
                                  <td className={cn('p-3 text-right font-mono tabular-nums font-semibold',
                                    meta.sign === '+' ? 'text-emerald-700 dark:text-emerald-500' :
                                    meta.sign === '-' ? 'text-destructive' : 'text-muted-foreground'
                                  )}>
                                    {m.quantity > 0 ? '+' : ''}{m.quantity}
                                  </td>
                                  <td className="p-3 text-right font-mono tabular-nums text-muted-foreground">{m.balanceBefore}</td>
                                  <td className="p-3 text-right font-mono tabular-nums font-medium">{m.balanceAfter}</td>
                                  <td className="p-3 text-xs text-muted-foreground max-w-[240px] truncate">{m.notes ?? '—'}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* BOOKS (CMS) */}
                  <TabsContent value="books">
                    <div className="rounded-sm border border-border bg-card overflow-hidden">
                      <div className="p-4 border-b border-border">
                        <h3 className="font-serif text-lg font-semibold">Gestión del catálogo</h3>
                        <p className="text-xs text-muted-foreground">Edita precios, sinopsis y destacados sin tocar código</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Título</th>
                              <th className="text-left p-3 font-medium text-xs uppercase tracking-editorial">Origen</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Precio S/</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Precio $</th>
                              <th className="text-center p-3 font-medium text-xs uppercase tracking-editorial">Destacado</th>
                              <th className="text-center p-3 font-medium text-xs uppercase tracking-editorial">Activo</th>
                              <th className="text-right p-3 font-medium text-xs uppercase tracking-editorial">Acción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {metrics?.inventory
                              .filter((inv, idx, self) => self.findIndex(i => i.book.id === inv.book.id) === idx)
                              .map((inv) => {
                                const book = inv.book
                                return (
                                  <tr key={book.id} className="border-t border-border hover:bg-muted/30">
                                    <td className="p-3 font-medium max-w-[280px] truncate">{book.title}</td>
                                    <td className="p-3">
                                      <Badge variant={book.originType === 'own' ? 'default' : 'secondary'} className="text-[10px]">
                                        {book.originType === 'own' ? 'Fondo' : 'Tercera'}
                                      </Badge>
                                    </td>
                                    <td className="p-3 text-right font-mono tabular-nums">—</td>
                                    <td className="p-3 text-right font-mono tabular-nums">—</td>
                                    <td className="p-3 text-center">—</td>
                                    <td className="p-3 text-center">—</td>
                                    <td className="p-3 text-right">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingBook({
                                          id: book.id,
                                          title: book.title,
                                          pricePen: 0,
                                          priceUsd: 0,
                                          synopsis: '',
                                          isFeatured: false,
                                          isActive: true,
                                        })}
                                      >
                                        Editar
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </>
        )}

        {/* Edit book modal */}
        {editingBook && (
          <EditBookDialog
            key={editingBook.id}
            book={editingBook}
            onClose={() => setEditingBook(null)}
          />
        )}
        {adjustingInv && (
          <AdjustInventoryDialog
            key={adjustingInv.id}
            inventory={adjustingInv}
            onClose={() => setAdjustingInv(null)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function KpiCard({
  label, value, icon: Icon, accent, warning,
}: {
  label: string; value: string; icon: any; accent?: boolean; warning?: boolean
}) {
  return (
    <div className={cn(
      'p-4 rounded-sm border bg-card',
      accent ? 'border-primary/40 bg-primary/5' : warning ? 'border-amber-400/40 bg-amber-50 dark:bg-amber-950/20' : 'border-border'
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-editorial text-muted-foreground">{label}</span>
        <Icon className={cn('w-4 h-4', accent ? 'text-primary' : warning ? 'text-amber-600' : 'text-muted-foreground')} strokeWidth={1.5} />
      </div>
      <div className={cn('font-serif text-2xl font-semibold tabular-nums', accent && 'text-primary')}>
        {value}
      </div>
    </div>
  )
}

function EditBookDialog({
  book, onClose,
}: {
  book: { id: string; title: string; pricePen: number; priceUsd: number; synopsis: string; isFeatured: boolean; isActive: boolean }
  onClose: () => void
}) {
  const [form, setForm] = useState({
    pricePen: book.pricePen,
    priceUsd: book.priceUsd,
    synopsis: book.synopsis,
    isFeatured: book.isFeatured,
    isActive: book.isActive,
  })
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const result = await updateBookAction({
      id: book.id,
      pricePen: form.pricePen,
      priceUsd: form.priceUsd,
      synopsis: form.synopsis,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    })
    setSaving(false)
    if (result.success) {
      toast.success('Libro actualizado', { description: book.title })
      onClose()
    } else {
      toast.error('Error', { description: result.error })
    }
  }

  return (
    <div className="absolute inset-0 z-50 bg-background/95 flex items-center justify-center p-6">
      <div className="w-full max-w-lg p-6 bg-card border border-border rounded-sm shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-semibold">Editar libro</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4 truncate">{book.title}</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-editorial">Precio S/</Label>
              <Input
                type="number"
                step="0.01"
                value={form.pricePen}
                onChange={(e) => setForm({ ...form, pricePen: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-editorial">Precio $</Label>
              <Input
                type="number"
                step="0.01"
                value={form.priceUsd}
                onChange={(e) => setForm({ ...form, priceUsd: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-editorial">Sinopsis</Label>
            <Textarea
              rows={5}
              value={form.synopsis}
              onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
              className="resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="rounded"
              />
              Destacado
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded"
              />
              Activo en tienda
            </label>
          </div>

          <div className="pt-2 border-t border-border">
            <Label className="text-xs uppercase tracking-editorial mb-2 block">Portada</Label>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-3 py-2 border border-dashed border-border rounded-sm text-xs text-muted-foreground">
                Arrastra una imagen o haz click para subir
              </div>
              <Button size="sm" variant="outline">
                <Upload className="w-3.5 h-3.5 mr-1" /> Subir
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdjustInventoryDialog({
  inventory, onClose,
}: {
  inventory: { id: string; bookId: string; warehouseId: string; bookTitle: string; warehouseName: string; currentStock: number }
  onClose: () => void
}) {
  const [newStock, setNewStock] = useState(inventory.currentStock)
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const result = await adjustInventoryAction({
      bookId: inventory.bookId,
      warehouseId: inventory.warehouseId,
      newStock,
      reason,
    })
    setSaving(false)
    if (result.success) {
      toast.success('Inventario ajustado', {
        description: `${inventory.bookTitle} → ${newStock} unidades en ${inventory.warehouseName}`,
      })
      onClose()
    } else {
      toast.error('Error', { description: result.error })
    }
  }

  return (
    <div className="absolute inset-0 z-50 bg-background/95 flex items-center justify-center p-6">
      <div className="w-full max-w-md p-6 bg-card border border-border rounded-sm shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-semibold">Ajustar inventario</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-sm text-sm">
            <div className="font-medium">{inventory.bookTitle}</div>
            <div className="text-xs text-muted-foreground mt-1">{inventory.warehouseName}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Stock actual: <span className="font-mono font-semibold text-foreground">{inventory.currentStock}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-editorial">Nuevo stock disponible</Label>
            <Input
              type="number"
              min="0"
              value={newStock}
              onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Diferencia: <span className={cn('font-mono font-semibold', newStock - inventory.currentStock > 0 ? 'text-emerald-700 dark:text-emerald-500' : newStock - inventory.currentStock < 0 ? 'text-destructive' : '')}>
                {newStock - inventory.currentStock > 0 ? '+' : ''}{newStock - inventory.currentStock}
              </span> unidades
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-editorial">Motivo (opcional)</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Conteo físico, merma, devolución..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Aplicando...' : 'Aplicar ajuste'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
