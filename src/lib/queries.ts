// ============================================================================
//  CONSULTAS DE DATOS — Editorial Horizonte (server-side)
//  Con fallback graceful: si la DB no está configurada o falla,
//  devuelve datos vacíos en lugar de crashear la página.
// ============================================================================
import { db } from '@/lib/db'
import type { BookWithRelations, Warehouse } from '@/lib/types'

// Helper: ejecuta una query Prisma con fallback si la DB no está disponible
async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.warn('[queries] DB no disponible, usando fallback:', error instanceof Error ? error.message : 'unknown')
    return fallback
  }
}

// ---------------------------------------------------------------------------
// Catálogo público: libros activos con relaciones
// ---------------------------------------------------------------------------
export async function getBooks(): Promise<BookWithRelations[]> {
  return safeQuery(async () => {
    const books = await db.book.findMany({
      where: { isActive: true },
      include: {
        publisher: { select: { id: true, name: true, slug: true, type: true, commissionRate: true } },
        authors: { include: { author: { select: { id: true, fullName: true, slug: true } } } },
        categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
        inventory: {
          include: {
            warehouse: { select: { id: true, name: true, code: true } },
          },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    return books.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      isbn: b.isbn,
      synopsis: b.synopsis,
      coverUrl: b.coverUrl,
      originType: b.originType as 'own' | 'third_party',
      publicationDate: b.publicationDate?.toISOString() ?? null,
      pages: b.pages,
      language: b.language,
      format: b.format as 'physical' | 'digital' | 'audiobook',
      dimensions: b.dimensions,
      weightGrams: b.weightGrams,
      edition: b.edition,
      pricePen: b.pricePen,
      priceUsd: b.priceUsd,
      cost: b.cost,
      isActive: b.isActive,
      isFeatured: b.isFeatured,
      isNew: b.isNew,
      metaTitle: b.metaTitle,
      publisher: b.publisher ? {
        id: b.publisher.id,
        name: b.publisher.name,
        slug: b.publisher.slug,
        type: b.publisher.type as 'own' | 'third_party',
        commissionRate: b.publisher.commissionRate,
      } : null,
      authors: b.authors.map((a) => ({
        id: a.author.id,
        fullName: a.author.fullName,
        slug: a.author.slug,
        role: a.role,
      })),
      categories: b.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug,
      })),
      inventory: b.inventory.map((i) => ({
        id: i.id,
        warehouseId: i.warehouseId,
        warehouse: i.warehouse,
        stockAvailable: i.stockAvailable,
        stockConsigned: i.stockConsigned,
        stockReserved: i.stockReserved,
      })),
    }))
  }, [])
}

// ---------------------------------------------------------------------------
// Categorías
// ---------------------------------------------------------------------------
export async function getCategories() {
  return safeQuery(
    () => db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    []
  )
}

// ---------------------------------------------------------------------------
// Almacenes / librerías aliadas
// ---------------------------------------------------------------------------
export async function getWarehouses(): Promise<Warehouse[]> {
  return safeQuery(async () => {
    const ws = await db.warehouse.findMany({
      where: { isActive: true },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    })
    return ws.map((w) => ({
      id: w.id,
      name: w.name,
      code: w.code,
      type: w.type as 'physical_store' | 'warehouse' | 'distribution_center',
      city: w.city,
      addressLine1: w.addressLine1,
      phone: w.phone,
      email: w.email,
      managerName: w.managerName,
      isActive: w.isActive,
    }))
  }, [])
}

// ---------------------------------------------------------------------------
// DASHBOARD ADMIN — métricas agregadas
// ---------------------------------------------------------------------------
export async function getAdminMetrics() {
  return safeQuery(async () => {
    const [
      totalBooks,
      totalOrders,
      totalCustomers,
      lowStockCount,
      activeConsignments,
      orders,
      inventory,
      movements,
    ] = await Promise.all([
      db.book.count({ where: { isActive: true } }),
      db.order.count(),
      db.customer.count(),
      db.inventory.count({ where: { stockAvailable: { lte: 5 } } }),
      db.consignment.count({ where: { status: { in: ['active', 'partial_settled'] } } }),
      db.order.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: { items: true, warehouse: true },
      }),
      db.inventory.findMany({
        include: { book: { select: { id: true, title: true, originType: true, publisher: { select: { name: true } } } }, warehouse: { select: { id: true, name: true, code: true } } },
      }),
      db.stockMovement.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          book: { select: { title: true } },
          warehouse: { select: { name: true, code: true } },
        },
      }),
    ])

    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentOrders = orders.filter((o) => o.createdAt >= thirtyDaysAgo)

    const salesByDay = new Map<string, { date: string; total: number; count: number }>()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      salesByDay.set(key, { date: key, total: 0, count: 0 })
    }
    for (const o of recentOrders) {
      const key = o.createdAt.toISOString().slice(0, 10)
      const entry = salesByDay.get(key)
      if (entry) {
        entry.total += o.totalAmount
        entry.count += 1
      }
    }

    const stockByWarehouse = new Map<string, { name: string; code: string; available: number; consigned: number; reserved: number; books: number }>()
    for (const inv of inventory) {
      const key = inv.warehouse.code
      const entry = stockByWarehouse.get(key) ?? {
        name: inv.warehouse.name,
        code: inv.warehouse.code,
        available: 0,
        consigned: 0,
        reserved: 0,
        books: 0,
      }
      entry.available += inv.stockAvailable
      entry.consigned += inv.stockConsigned
      entry.reserved += inv.stockReserved
      if (inv.stockAvailable > 0 || inv.stockConsigned > 0) entry.books += 1
      stockByWarehouse.set(key, entry)
    }

    const salesByOrigin = { own: 0, third_party: 0 }
    for (const o of orders) {
      for (const item of o.items) {
        if (item.originTypeSnapshot === 'own') salesByOrigin.own += item.lineTotal
        else salesByOrigin.third_party += item.lineTotal
      }
    }

    const bookSales = new Map<string, { title: string; quantity: number; revenue: number }>()
    for (const o of orders) {
      for (const item of o.items) {
        const entry = bookSales.get(item.bookTitleSnapshot) ?? {
          title: item.bookTitleSnapshot,
          quantity: 0,
          revenue: 0,
        }
        entry.quantity += item.quantity
        entry.revenue += item.lineTotal
        bookSales.set(item.bookTitleSnapshot, entry)
      }
    }
    const topBooks = Array.from(bookSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return {
      totals: {
        books: totalBooks,
        orders: totalOrders,
        customers: totalCustomers,
        lowStock: lowStockCount,
        activeConsignments,
        revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      },
      salesByDay: Array.from(salesByDay.values()),
      stockByWarehouse: Array.from(stockByWarehouse.values()),
      salesByOrigin,
      topBooks,
      recentOrders: orders.slice(0, 10).map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        status: o.status,
        totalAmount: o.totalAmount,
        currency: o.currency,
        createdAt: o.createdAt.toISOString(),
        warehouse: o.warehouse ? { name: o.warehouse.name, code: o.warehouse.code } : null,
        itemsCount: o.items.length,
      })),
      recentMovements: movements.map((m) => ({
        id: m.id,
        bookTitle: m.book.title,
        warehouseCode: m.warehouse.code,
        movementType: m.movementType,
        quantity: m.quantity,
        balanceBefore: m.balanceBefore,
        balanceAfter: m.balanceAfter,
        notes: m.notes,
        createdAt: m.createdAt.toISOString(),
      })),
      inventory,
    }
  }, null)
}

// ---------------------------------------------------------------------------
// Consignaciones activas
// ---------------------------------------------------------------------------
export async function getConsignments() {
  return safeQuery(
    () => db.consignment.findMany({
      where: { status: { in: ['active', 'partial_settled'] } },
      include: {
        book: { select: { id: true, title: true, slug: true, metaTitle: true } },
        warehouse: { select: { id: true, name: true, code: true } },
        publisher: { select: { id: true, name: true, type: true, commissionRate: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    []
  )
}
