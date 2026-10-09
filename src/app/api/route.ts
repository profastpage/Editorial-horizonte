import { NextRequest, NextResponse } from "next/server";
import seedData from "@/data/seed-data.json";

// ─── In-memory state (mutations live in memory — acceptable for Vercel demo) ───
const state = {
  books: JSON.parse(JSON.stringify(seedData.books)) as typeof seedData.books,
  inventory: JSON.parse(JSON.stringify(seedData.inventory)) as typeof seedData.inventory,
  orders: JSON.parse(JSON.stringify(seedData.orders)) as typeof seedData.orders,
  orderItems: JSON.parse(JSON.stringify(seedData.orderItems)) as typeof seedData.orderItems,
  auditLog: JSON.parse(JSON.stringify(seedData.auditLog)) as typeof seedData.auditLog,
};

// Helper: get total stock for a book across all warehouses
function getTotalStock(bookId: string): number {
  return state.inventory
    .filter((i) => i.bookId === bookId)
    .reduce((sum, i) => sum + i.stockDisponible, 0);
}

// Helper: find book with enriched data
function enrichBook(book: (typeof seedData.books)[0]) {
  const authors = seedData.bookAuthors
    .filter((ba) => ba.bookId === book.id)
    .sort((a, b) => a.order - b.order)
    .map((ba) => {
      const author = seedData.authors.find((a) => a.id === ba.authorId);
      if (!author) return null;
      return { authorId: author.id, order: ba.order, author: { id: author.id, name: author.name, nationality: author.nationality } };
    })
    .filter(Boolean);
  const categories = seedData.bookCategories
    .filter((bc) => bc.bookId === book.id)
    .map((bc) => {
      const cat = seedData.categories.find((c) => c.id === bc.categoryId);
      if (!cat) return null;
      return { categoryId: cat.id, category: { id: cat.id, name: cat.name, slug: cat.slug } };
    })
    .filter(Boolean);
  const publisher = book.publisherId
    ? seedData.publishers.find((p) => p.id === book.publisherId)
    : null;
  return {
    ...book,
    authors,
    categories,
    publisher: publisher ? { id: publisher.id, name: publisher.name, country: publisher.country } : null,
    totalStock: getTotalStock(book.id),
  };
}

// ─── GET /api?resource=books|categories|warehouses|orders|inventory|dashboard|authors|publishers|allbooks ───

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");

  try {
    switch (resource) {
      case "books": {
        const search = searchParams.get("search") || undefined;
        const categoryId = searchParams.get("categoryId") || undefined;
        const originType = searchParams.get("originType") || undefined;
        const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
        const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

        let filtered = state.books.filter((b) => b.isActive);

        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter((b) => {
            const titleMatch = b.title.toLowerCase().includes(q);
            const authorMatch = seedData.bookAuthors
              .filter((ba) => ba.bookId === b.id)
              .some((ba) => {
                const a = seedData.authors.find((x) => x.id === ba.authorId);
                return a?.name.toLowerCase().includes(q);
              });
            return titleMatch || authorMatch;
          });
        }
        if (categoryId) {
          const catBookIds = new Set(
            seedData.bookCategories.filter((bc) => bc.categoryId === categoryId).map((bc) => bc.bookId)
          );
          filtered = filtered.filter((b) => catBookIds.has(b.id));
        }
        if (originType) {
          filtered = filtered.filter((b) => b.originType === originType);
        }
        if (minPrice !== undefined) filtered = filtered.filter((b) => b.price >= minPrice);
        if (maxPrice !== undefined) filtered = filtered.filter((b) => b.price <= maxPrice);

        // Sort: featured first
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

        const result = filtered.map(enrichBook);
        return NextResponse.json(result);
      }

      case "categories": {
        return NextResponse.json(seedData.categories);
      }

      case "warehouses": {
        return NextResponse.json(seedData.warehouses.filter((w) => w.isActive));
      }

      case "orders": {
        const ordersWithItems = state.orders.map((order) => ({
          ...order,
          items: state.orderItems.filter((oi) => oi.orderId === order.id),
          warehouse: order.warehouseId
            ? { id: order.warehouseId, name: seedData.warehouses.find((w) => w.id === order.warehouseId)?.name || "" }
            : null,
        }));
        ordersWithItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return NextResponse.json(ordersWithItems);
      }

      case "inventory": {
        const warehouseId = searchParams.get("warehouseId") || undefined;
        let inv = state.inventory;
        if (warehouseId) inv = inv.filter((i) => i.warehouseId === warehouseId);

        const result = inv.map((i) => ({
          ...i,
          book: (() => {
            const b = state.books.find((x) => x.id === i.bookId);
            return b ? { id: b.id, title: b.title, isbn: b.isbn, price: b.price, originType: b.originType } : null;
          })(),
          warehouse: (() => {
            const w = seedData.warehouses.find((x) => x.id === i.warehouseId);
            return w ? { id: w.id, name: w.name, city: w.city } : null;
          })(),
        }));
        return NextResponse.json(result);
      }

      case "dashboard": {
        const nonCancelled = state.orders.filter((o) => o.status !== "CANCELLED");
        const totalSales = nonCancelled.reduce((s, o) => s + o.totalAmount, 0);
        const pendingOrders = state.orders.filter((o) => o.status === "PENDING").length;
        const totalBooks = state.books.filter((b) => b.isActive).length;
        const totalStock = state.inventory.reduce((s, i) => s + i.stockDisponible, 0);

        // Sales by warehouse
        const warehouseSales: Record<string, number> = {};
        for (const order of nonCancelled) {
          if (order.warehouseId) {
            const wName = seedData.warehouses.find((w) => w.id === order.warehouseId)?.name;
            if (wName) warehouseSales[wName] = (warehouseSales[wName] || 0) + order.totalAmount;
          }
        }
        const salesByWarehouse = Object.entries(warehouseSales).map(([name, sales]) => ({ name, sales: Math.round(sales) }));

        // Books by origin
        const activeBooks = state.books.filter((b) => b.isActive);
        const propio = activeBooks.filter((b) => b.originType === "PROPIO").length;
        const tercero = activeBooks.filter((b) => b.originType === "TERCERO").length;
        const booksByOrigin = [
          { name: "Fondo Propio", value: propio, fill: "var(--color-primary)" },
          { name: "Terceros", value: tercero, fill: "oklch(0.75 0.14 75)" },
        ];

        return NextResponse.json({ totalSales, totalStock, pendingOrders, totalBooks, salesByWarehouse, booksByOrigin });
      }

      case "authors": {
        return NextResponse.json(seedData.authors);
      }

      case "publishers": {
        return NextResponse.json(seedData.publishers.filter((p) => p.isActive));
      }

      case "allbooks": {
        const allBooks = state.books.map((book) => {
          const authors = seedData.bookAuthors
            .filter((ba) => ba.bookId === book.id)
            .sort((a, b) => a.order - b.order)
            .map((ba) => {
              const author = seedData.authors.find((a) => a.id === ba.authorId)!;
              return { authorId: author.id, order: ba.order, author: { id: author.id, name: author.name } };
            });
          const categories = seedData.bookCategories
            .filter((bc) => bc.bookId === book.id)
            .map((bc) => {
              const cat = seedData.categories.find((c) => c.id === bc.categoryId)!;
              return { categoryId: cat.id, category: { id: cat.id, name: cat.name } };
            });
          const publisher = book.publisherId ? seedData.publishers.find((p) => p.id === book.publisherId) : null;
          return { ...book, authors, categories, publisher: publisher ? { id: publisher.id, name: publisher.name } : null };
        });
        allBooks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return NextResponse.json(allBooks);
      }

      default:
        return NextResponse.json({ error: "Unknown resource" }, { status: 400 });
    }
  } catch (error) {
    console.error("API GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}

// ─── POST /api?action=createOrder|updateBook|updateInventory|loginAdmin|createBook ───

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    const body = await request.json();

    switch (action) {
      case "createOrder": {
        const orderNumber = `EH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;

        const items = body.items as Array<{
          bookId: string;
          title: string;
          price: number;
          quantity: number;
          originType: string;
        }>;

        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        const orderId = `ord_${Date.now()}`;
        const order = {
          id: orderId,
          orderNumber,
          customerName: body.customerName,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone,
          customerAddress: body.customerAddress,
          customerCity: body.customerCity,
          warehouseId: body.warehouseId,
          status: "PENDING" as const,
          source: "ONLINE" as const,
          subtotal,
          discountAmount: 0,
          shippingCost: 0,
          totalAmount: subtotal,
          paymentMethod: null,
          paymentRef: null,
          notes: null,
          confirmedAt: null,
          shippedAt: null,
          deliveredAt: null,
          cancelledAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.orders.push(order as any);

        for (const item of items) {
          const inv = state.inventory.find(
            (i) => i.bookId === item.bookId && i.warehouseId === body.warehouseId
          );
          if (!inv || inv.stockDisponible < item.quantity) {
            return NextResponse.json(
              { error: `Stock insuficiente para "${item.title}". Disponible: ${inv?.stockDisponible || 0}` },
              { status: 400 }
            );
          }

          const newStock = inv.stockDisponible - item.quantity;
          inv.stockDisponible = newStock;

          state.orderItems.push({
            id: `oi_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            orderId,
            bookId: item.bookId,
            title: item.title,
            unitPrice: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
            commissionRate: null,
            commissionAmount: null,
          } as any);

          state.auditLog.push({
            id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            bookId: item.bookId,
            warehouseId: body.warehouseId,
            orderId,
            movementType: "SALE",
            quantityBefore: inv.stockDisponible + item.quantity,
            quantityAfter: newStock,
            quantityDelta: -item.quantity,
            performedById: null,
            notes: `Venta online - Orden ${orderNumber}`,
            createdAt: new Date().toISOString(),
          } as any);
        }

        return NextResponse.json({ success: true, orderNumber });
      }

      case "updateBook": {
        const { id, ...data } = body;
        const book = state.books.find((b) => b.id === id);
        if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
        if (data.title !== undefined) book.title = data.title;
        if (data.price !== undefined) book.price = data.price;
        if (data.costPrice !== undefined) book.costPrice = data.costPrice;
        if (data.isActive !== undefined) book.isActive = data.isActive;
        if (data.isFeatured !== undefined) book.isFeatured = data.isFeatured;
        if (data.synopsis !== undefined) book.synopsis = data.synopsis;
        if (data.pages !== undefined) book.pages = data.pages;
        if (data.publicationYear !== undefined) book.publicationYear = data.publicationYear;
        return NextResponse.json(book);
      }

      case "updateInventory": {
        const { bookId, warehouseId, delta, movementType } = body;
        const inv = state.inventory.find((i) => i.bookId === bookId && i.warehouseId === warehouseId);
        if (!inv) return NextResponse.json({ error: "Registro de inventario no encontrado" }, { status: 404 });
        const newStock = inv.stockDisponible + delta;
        if (newStock < 0) return NextResponse.json({ error: "Stock no puede ser negativo" }, { status: 400 });
        inv.stockDisponible = newStock;
        state.auditLog.push({
          id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          bookId,
          warehouseId,
          orderId: null,
          movementType,
          quantityBefore: inv.stockDisponible - delta,
          quantityAfter: newStock,
          quantityDelta: delta,
          performedById: null,
          notes: `Ajuste manual (${movementType})`,
          createdAt: new Date().toISOString(),
        } as any);
        return NextResponse.json({ newStock });
      }

      case "loginAdmin": {
        const { password } = body;
        if (password === "horizonte2026") return NextResponse.json({ success: true });
        return NextResponse.json({ success: false }, { status: 401 });
      }

      case "createBook": {
        const slug = (body.title as string)
          .toLowerCase()
          .replace(/[^a-z0-9áéíóúñü]+/g, "-")
          .replace(/^-|-$/g, "");

        const newBook = {
          id: `book_${Date.now()}`,
          title: body.title,
          slug,
          isbn: body.isbn || null,
          synopsis: body.synopsis || null,
          pages: body.pages || null,
          language: body.language || "Español",
          publicationYear: body.publicationYear || null,
          coverUrl: null,
          price: body.price,
          costPrice: body.costPrice || null,
          weightKg: null,
          isActive: true,
          isFeatured: false,
          originType: body.originType,
          publisherId: body.publisherId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.books.push(newBook as any);

        if (body.authorIds?.length) {
          for (let idx = 0; idx < body.authorIds.length; idx++) {
            seedData.bookAuthors.push({ bookId: newBook.id, authorId: body.authorIds[idx], order: idx });
          }
        }
        if (body.categoryIds?.length) {
          for (const catId of body.categoryIds) {
            seedData.bookCategories.push({ bookId: newBook.id, categoryId: catId });
          }
        }

        return NextResponse.json(newBook);
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}