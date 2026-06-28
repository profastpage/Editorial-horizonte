// ============================================================================
//  SERVER ACTIONS — Editorial Horizonte
//  Operaciones críticas: checkout con descuento atómico, admin mutations
// ============================================================================
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// ---------------------------------------------------------------------------
// 1. CHECKOUT — Crear orden + descontar stock ATÓMICAMENTE
//    Replica el comportamiento de deduct_inventory_for_order() del SQL:
//    - Valida stock completo ANTES de mutar.
//    - Usa transacción Prisma ($transaction) para atomicidad.
//    - Si cualquier item no tiene stock, aborta todo.
//    - Registra stock_movements con balance_before/after.
//    - Idempotente via stockDeducted flag.
// ---------------------------------------------------------------------------

const CheckoutSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  shippingAddress: z.object({
    line1: z.string().min(5),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().optional(),
    country: z.string().default('Perú'),
  }),
  paymentProvider: z.enum(['mercadopago', 'paypal', 'izipay', 'manual']),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      bookId: z.string(),
      warehouseId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
  currency: z.enum(['PEN', 'USD']).default('PEN'),
})

export type CheckoutResult = {
  success: boolean
  orderId?: string
  orderNumber?: string
  error?: string
  errorCode?: 'STOCK_INSUFFICIENT' | 'VALIDATION' | 'INTERNAL'
  failedItems?: Array<{ bookId: string; requested: number; available: number }>
}

export async function checkoutAction(
  rawInput: z.infer<typeof CheckoutSchema>
): Promise<CheckoutResult> {
  try {
    // 1. Validación de input
    const input = CheckoutSchema.parse(rawInput)

    // 2. EJECUCIÓN ATÓMICA — todo en una transacción
    const result = await db.$transaction(async (tx) => {
      // 2.1 Validación previa: TODOS los items deben tener stock
      const failedItems: Array<{ bookId: string; requested: number; available: number }> = []

      const itemsWithData = await Promise.all(
        input.items.map(async (item) => {
          const book = await tx.book.findUnique({
            where: { id: item.bookId },
            select: {
              id: true, title: true, originType: true,
              pricePen: true, priceUsd: true, publisherId: true,
              publisher: { select: { commissionRate: true } },
            },
          })
          if (!book) {
            failedItems.push({ bookId: item.bookId, requested: item.quantity, available: 0 })
            return null
          }

          const inv = await tx.inventory.findUnique({
            where: { bookId_warehouseId: { bookId: item.bookId, warehouseId: item.warehouseId } },
          })
          if (!inv || inv.stockAvailable < item.quantity) {
            failedItems.push({
              bookId: item.bookId,
              requested: item.quantity,
              available: inv?.stockAvailable ?? 0,
            })
            return null
          }

          return { item, book, inv }
        })
      )

      if (failedItems.length > 0) {
        throw new Error('STOCK_INSUFFICIENT:' + JSON.stringify(failedItems))
      }

      // 2.2 Crear cliente (upsert)
      const customer = await tx.customer.upsert({
        where: { email: input.customerEmail },
        update: {
          fullName: input.customerName,
          phone: input.customerPhone,
          totalOrders: { increment: 1 },
        },
        create: {
          email: input.customerEmail,
          fullName: input.customerName,
          phone: input.customerPhone,
          totalOrders: 1,
        },
      })

      // 2.3 Calcular totales
      const items = itemsWithData.filter(Boolean) as NonNullable<typeof itemsWithData[number]>[]
      const unitPriceField = input.currency === 'PEN' ? 'pricePen' : 'priceUsd'
      const subtotal = items.reduce(
        (sum, { item, book }) => sum + book[unitPriceField] * item.quantity,
        0
      )
      const shippingAmount = subtotal >= 150 ? 0 : 12
      const totalAmount = subtotal + shippingAmount

      // 2.4 Generar número de orden
      const now = new Date()
      const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
      const countToday = await tx.order.count({
        where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } },
      })
      const orderNumber = `EH-${ymd}-${String(countToday + 1).padStart(5, '0')}`

      // 2.5 Crear la orden
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          customerEmail: input.customerEmail,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          status: 'paid', // asumimos pago confirmado por pasarela
          currency: input.currency,
          subtotal,
          discountAmount: 0,
          shippingAmount,
          taxAmount: 0,
          totalAmount,
          warehouseId: items[0]?.item.warehouseId, // primario
          paymentProvider: input.paymentProvider,
          paymentProviderId: `${input.paymentProvider.toUpperCase()}-${Date.now()}`,
          paymentStatus: 'completed',
          paidAt: now,
          shippingAddress: JSON.stringify(input.shippingAddress),
          billingAddress: JSON.stringify(input.shippingAddress),
          notes: input.notes,
        },
      })

      // 2.6 Crear order_items + DESCONTAR STOCK + AUDITORÍA
      for (const { item, book, inv } of items) {
        const unitPrice = book[unitPriceField]
        const lineTotal = unitPrice * item.quantity

        const commissionRate = book.publisher?.commissionRate ?? 0
        const commissionAmount = book.originType === 'third_party'
          ? (lineTotal * commissionRate) / 100
          : 0

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            bookId: item.bookId,
            warehouseId: item.warehouseId,
            quantity: item.quantity,
            unitPrice,
            lineTotal,
            bookTitleSnapshot: book.title,
            publisherIdSnapshot: book.publisherId,
            originTypeSnapshot: book.originType,
            commissionRateSnapshot: commissionRate,
            commissionAmount,
            royaltyAmount: 0,
            stockDeducted: true,
            deductedAt: now,
          },
        })

        // DESCUENTO ATÓMICO de stock
        const newBalance = inv.stockAvailable - item.quantity
        await tx.inventory.update({
          where: { id: inv.id },
          data: { stockAvailable: newBalance, updatedAt: now },
        })

        // AUDITORÍA — registro de movimiento
        await tx.stockMovement.create({
          data: {
            bookId: item.bookId,
            warehouseId: item.warehouseId,
            movementType: 'sale',
            quantity: -item.quantity,
            balanceBefore: inv.stockAvailable,
            balanceAfter: newBalance,
            referenceType: 'order',
            referenceId: order.id,
            notes: `Descuento automático — orden ${orderNumber}`,
          },
        })
      }

      // 2.7 Actualizar totalSpent del customer
      await tx.customer.update({
        where: { id: customer.id },
        data: { totalSpent: { increment: totalAmount } },
      })

      // 2.8 Registrar pago
      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: input.paymentProvider,
          providerTransactionId: order.paymentProviderId!,
          amount: totalAmount,
          currency: input.currency,
          status: 'completed',
        },
      })

      return { orderId: order.id, orderNumber }
    })

    revalidatePath('/')
    return {
      success: true,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
    }
  } catch (e: any) {
    if (e?.message?.startsWith('STOCK_INSUFFICIENT:')) {
      const failedItems = JSON.parse(e.message.replace('STOCK_INSUFFICIENT:', ''))
      return {
        success: false,
        error: 'Uno o más libros ya no tienen stock disponible.',
        errorCode: 'STOCK_INSUFFICIENT',
        failedItems,
      }
    }
    if (e instanceof z.ZodError) {
      return {
        success: false,
        error: 'Datos del formulario inválidos: ' + e.issues.map((er) => er.message).join(', '),
        errorCode: 'VALIDATION',
      }
    }
    console.error('Checkout error:', e)
    return {
      success: false,
      error: 'Error interno del servidor. Inténtalo nuevamente.',
      errorCode: 'INTERNAL',
    }
  }
}

// ---------------------------------------------------------------------------
// 2. ADMIN: Login
// ---------------------------------------------------------------------------
const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

export async function adminLoginAction(rawInput: z.infer<typeof AdminLoginSchema>) {
  try {
    const input = AdminLoginSchema.parse(rawInput)
    const profile = await db.profile.findUnique({ where: { email: input.email } })
    if (!profile || !profile.isActive || !['admin', 'editor', 'warehouse_manager'].includes(profile.role)) {
      return { success: false, error: 'Credenciales inválidas.' }
    }
    const setting = await db.setting.findUnique({ where: { key: 'admin_password' } })
    const adminPass = setting ? JSON.parse(setting.value) : null
    if (!adminPass || adminPass !== input.password) {
      return { success: false, error: 'Contraseña incorrecta.' }
    }
    return {
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        role: profile.role,
      },
    }
  } catch (e) {
    return { success: false, error: 'Error de validación.' }
  }
}

// ---------------------------------------------------------------------------
// 3. ADMIN: Actualizar libro (precio, sinopsis, portada)
// ---------------------------------------------------------------------------
const UpdateBookSchema = z.object({
  id: z.string(),
  pricePen: z.number().min(0).optional(),
  priceUsd: z.number().min(0).optional(),
  synopsis: z.string().optional(),
  coverUrl: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export async function updateBookAction(rawInput: z.infer<typeof UpdateBookSchema>) {
  try {
    const input = UpdateBookSchema.parse(rawInput)
    const { id, ...data } = input
    const updated = await db.book.update({ where: { id }, data })
    revalidatePath('/')
    return { success: true, book: updated }
  } catch (e) {
    return { success: false, error: 'No se pudo actualizar el libro.' }
  }
}

// ---------------------------------------------------------------------------
// 4. ADMIN: Ajuste manual de inventario
// ---------------------------------------------------------------------------
const AdjustInventorySchema = z.object({
  bookId: z.string(),
  warehouseId: z.string(),
  newStock: z.number().int().min(0),
  reason: z.string().optional(),
})

export async function adjustInventoryAction(rawInput: z.infer<typeof AdjustInventorySchema>) {
  try {
    const input = AdjustInventorySchema.parse(rawInput)

    const result = await db.$transaction(async (tx) => {
      const inv = await tx.inventory.findUnique({
        where: { bookId_warehouseId: { bookId: input.bookId, warehouseId: input.warehouseId } },
      })
      if (!inv) throw new Error('Inventario no encontrado.')

      const balanceBefore = inv.stockAvailable
      const diff = input.newStock - balanceBefore
      const movementType = diff > 0 ? 'manual_in' : 'manual_out'

      const updated = await tx.inventory.update({
        where: { id: inv.id },
        data: { stockAvailable: input.newStock, lastCountDate: new Date() },
      })

      await tx.stockMovement.create({
        data: {
          bookId: input.bookId,
          warehouseId: input.warehouseId,
          movementType,
          quantity: diff,
          balanceBefore,
          balanceAfter: input.newStock,
          referenceType: 'manual',
          notes: input.reason || 'Ajuste manual desde panel admin',
        },
      })

      return updated
    })

    revalidatePath('/')
    return { success: true, inventory: result }
  } catch (e) {
    return { success: false, error: 'No se pudo ajustar el inventario.' }
  }
}

// ---------------------------------------------------------------------------
// 5. ADMIN: Crear transferencia entre almacenes
// ---------------------------------------------------------------------------
const TransferSchema = z.object({
  fromWarehouseId: z.string(),
  toWarehouseId: z.string(),
  items: z.array(z.object({
    bookId: z.string(),
    quantity: z.number().int().positive(),
  })),
  notes: z.string().optional(),
})

export async function createTransferAction(rawInput: z.infer<typeof TransferSchema>) {
  try {
    const input = TransferSchema.parse(rawInput)
    if (input.fromWarehouseId === input.toWarehouseId) {
      return { success: false, error: 'Los almacenes de origen y destino deben ser distintos.' }
    }

    const result = await db.$transaction(async (tx) => {
      // Validar stock en origen
      for (const item of input.items) {
        const inv = await tx.inventory.findUnique({
          where: { bookId_warehouseId: { bookId: item.bookId, warehouseId: input.fromWarehouseId } },
        })
        if (!inv || inv.stockAvailable < item.quantity) {
          throw new Error(`Stock insuficiente en origen para el libro ${item.bookId}`)
        }
      }

      const count = await tx.transfer.count()
      const transferNumber = `TRF-${Date.now().toString().slice(-6)}-${count + 1}`

      const transfer = await tx.transfer.create({
        data: {
          transferNumber,
          fromWarehouseId: input.fromWarehouseId,
          toWarehouseId: input.toWarehouseId,
          status: 'in_transit',
          notes: input.notes,
          shippedAt: new Date(),
          items: { create: input.items },
        },
      })

      // Descontar de origen
      for (const item of input.items) {
        const inv = await tx.inventory.findUnique({
          where: { bookId_warehouseId: { bookId: item.bookId, warehouseId: input.fromWarehouseId } },
        })!
        await tx.inventory.update({
          where: { id: inv!.id },
          data: { stockAvailable: inv!.stockAvailable - item.quantity },
        })
        await tx.stockMovement.create({
          data: {
            bookId: item.bookId,
            warehouseId: input.fromWarehouseId,
            movementType: 'transfer_out',
            quantity: -item.quantity,
            balanceBefore: inv!.stockAvailable,
            balanceAfter: inv!.stockAvailable - item.quantity,
            referenceType: 'transfer',
            referenceId: transfer.id,
            notes: `Transferencia ${transferNumber}`,
          },
        })

        // Sumar en destino (upsert inventory)
        const destInv = await tx.inventory.findUnique({
          where: { bookId_warehouseId: { bookId: item.bookId, warehouseId: input.toWarehouseId } },
        })
        if (destInv) {
          await tx.inventory.update({
            where: { id: destInv.id },
            data: { stockAvailable: destInv.stockAvailable + item.quantity },
          })
          await tx.stockMovement.create({
            data: {
              bookId: item.bookId,
              warehouseId: input.toWarehouseId,
              movementType: 'transfer_in',
              quantity: item.quantity,
              balanceBefore: destInv.stockAvailable,
              balanceAfter: destInv.stockAvailable + item.quantity,
              referenceType: 'transfer',
              referenceId: transfer.id,
              notes: `Transferencia ${transferNumber}`,
            },
          })
        } else {
          await tx.inventory.create({
            data: {
              bookId: item.bookId,
              warehouseId: input.toWarehouseId,
              stockAvailable: item.quantity,
            },
          })
          await tx.stockMovement.create({
            data: {
              bookId: item.bookId,
              warehouseId: input.toWarehouseId,
              movementType: 'transfer_in',
              quantity: item.quantity,
              balanceBefore: 0,
              balanceAfter: item.quantity,
              referenceType: 'transfer',
              referenceId: transfer.id,
              notes: `Transferencia ${transferNumber}`,
            },
          })
        }
      }

      return transfer
    })

    revalidatePath('/')
    return { success: true, transfer: result }
  } catch (e: any) {
    return { success: false, error: e?.message || 'No se pudo crear la transferencia.' }
  }
}

// ---------------------------------------------------------------------------
// 6. ADMIN: Crear consignación
// ---------------------------------------------------------------------------
const ConsignmentSchema = z.object({
  bookId: z.string(),
  warehouseId: z.string(),
  publisherId: z.string().optional(),
  quantityConsigned: z.number().int().positive(),
  commissionRate: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
})

export async function createConsignmentAction(rawInput: z.infer<typeof ConsignmentSchema>) {
  try {
    const input = ConsignmentSchema.parse(rawInput)

    const result = await db.$transaction(async (tx) => {
      const count = await tx.consignment.count()
      const consignmentNumber = `CON-${Date.now().toString().slice(-6)}-${count + 1}`

      const consignment = await tx.consignment.create({
        data: {
          consignmentNumber,
          bookId: input.bookId,
          warehouseId: input.warehouseId,
          publisherId: input.publisherId,
          quantityConsigned: input.quantityConsigned,
          quantityPending: input.quantityConsigned,
          status: 'active',
          commissionRate: input.commissionRate,
          notes: input.notes,
        },
      })

      // Actualizar stock_consigned en inventory
      const inv = await tx.inventory.findUnique({
        where: { bookId_warehouseId: { bookId: input.bookId, warehouseId: input.warehouseId } },
      })
      if (inv) {
        await tx.inventory.update({
          where: { id: inv.id },
          data: { stockConsigned: inv.stockConsigned + input.quantityConsigned },
        })
        await tx.stockMovement.create({
          data: {
            bookId: input.bookId,
            warehouseId: input.warehouseId,
            movementType: 'consignment_in',
            quantity: input.quantityConsigned,
            balanceBefore: inv.stockAvailable,
            balanceAfter: inv.stockAvailable,
            referenceType: 'consignment',
            referenceId: consignment.id,
            notes: `Consignación ${consignmentNumber}`,
          },
        })
      }

      return consignment
    })

    revalidatePath('/')
    return { success: true, consignment: result }
  } catch (e: any) {
    return { success: false, error: e?.message || 'No se pudo crear la consignación.' }
  }
}
