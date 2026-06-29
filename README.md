# Editorial Horizonte

> Libros que vuelven a casa. Editorial independiente peruana con e-commerce premium + ERP multi-almacén para control de inventario y consignaciones.

Cliente: **Juan Damonte** · Proveedor: **Fast Page Pro** · Diseño y desarrollo por [fastpagepro.com](https://fastpagepro.com)

---

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript estricto
- **Estilos**: Tailwind CSS v4 + shadcn/ui (Radix) + Framer Motion + Recharts
- **Tipografía**: Fraunces (serif editorial) + Inter (sans)
- **Base de datos**: Prisma ORM (SQLite en dev, PostgreSQL/Supabase en prod)
- **Validación**: Zod (cliente + servidor)
- **Estado**: Zustand (carrito persistido + UI)
- **Animaciones**: Framer Motion (scroll-driven, micro-interacciones)

## Arquitectura

### Base de datos relacional (20 modelos)

```
profiles → publishers (own | third_party) → books
                                              ↓
                            book_authors ← authors
                            book_categories ← categories
                                              ↓
                          inventory ← warehouses (multi-almacén)
                              ↓
                       stock_movements (auditoría inmutable)
                              ↓
                orders → order_items (snapshot de precios/comisiones)
                              ↓
                          payments · customers · consignments · transfers
```

### Reglas de negocio clave

1. **Separación de catálogo** — `publishers.type` distingue fondo editorial propio (`own`) de terceras editoriales (`third_party`) con comisión/regalía.
2. **Multi-almacén** — Cada librería aliada (SUR, Virrey, Crisol, Central) es un nodo independiente con `stockAvailable`, `stockConsigned`, `stockReserved`.
3. **Descuento atómico en tiempo real** — Server Action `checkoutAction` envuelve toda la operación en `db.$transaction`: valida stock completo antes de mutar, lanza `STOCK_INSUFFICIENT` si no alcanza (rollback total), registra `stock_movements` con `balanceBefore/after`, idempotente vía flag `stockDeducted`.
4. **CMS/ERP protegido** — Login contra `settings.admin_password` + panel con 5 tabs (Resumen, Inventario, Órdenes, Auditoría, Catálogo).

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fuentes, ThemeProvider, Toaster)
│   ├── page.tsx                # Single-page con scroll-spy (SSR)
│   └── globals.css             # Sistema de diseño editorial
├── components/
│   ├── navbar.tsx              # Sticky con scroll-spy + currency toggle
│   ├── footer.tsx              # Créditos hardcodeados inamovibles
│   ├── book-cover.tsx          # Portada simulada con tipografía
│   ├── theme-provider.tsx
│   ├── sections/
│   │   ├── hero.tsx            # Hero cinematográfico con parallax
│   │   ├── catalog.tsx         # Catálogo con filtros + skeletons
│   │   ├── about.tsx           # Nosotros + valores + cita
│   │   ├── allies.tsx          # Librerías aliadas (warehouses)
│   │   └── contact.tsx         # Formulario de contacto
│   ├── catalog/
│   │   ├── book-card.tsx       # Tarjeta de libro
│   │   └── book-detail-dialog.tsx  # Ficha + multi-warehouse selector
│   ├── checkout/
│   │   ├── cart-drawer.tsx     # Carrito lateral persistido
│   │   └── checkout-dialog.tsx # Checkout 3 pasos + pasarelas
│   └── admin/
│       └── admin-sheet.tsx     # Panel ERP completo (5 tabs)
├── hooks/
│   └── use-scroll-spy.ts       # IntersectionObserver + History API
├── lib/
│   ├── db.ts                   # Prisma client
│   ├── types.ts                # Tipos compartidos
│   ├── utils.ts                # cn, formatPrice, formatDate, slugify...
│   ├── store.ts                # Zustand: cart, UI, catalog filters
│   ├── actions.ts              # Server Actions (checkout atómico, admin)
│   └── queries.ts              # Consultas SSR (catálogo, dashboard)
└── prisma/
    ├── schema.prisma           # 20 modelos relacionales
    └── seed.ts                 # Seed con 12 libros + 4 almacenes + órdenes

download/
└── editorial_horizonte_schema.sql  # Esquema SQL production-ready para Supabase
                                      (1,270 líneas, RLS, funciones PL/pgSQL)
```

## Desarrollo local

```bash
# 1. Instalar dependencias
bun install

# 2. Configurar entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL

# 3. Crear la base de datos + seed
bun run db:push
bun run seed

# 4. Iniciar dev server
bun run dev
# → http://localhost:3000
```

### Credenciales admin (demo)

```
Email: admin@editorialhorizonte.com
Password: horizonte2024
```

## Despliegue a Vercel

1. **Importa el repo** en [vercel.com/new](https://vercel.com/new)
2. **Framework preset**: Next.js (auto-detectado)
3. **Build command**: `next build` (ya configurado en `package.json`)
4. **Install command**: `bun install` (o `npm install`)
5. **Environment variables** (Settings → Environment Variables):
   - `DATABASE_URL` — tu conexión PostgreSQL (Supabase / Neon / Railway)
   - `ADMIN_PASSWORD` — contraseña admin segura (cambia la del demo)
   - Pasarelas: `MERCADOPAGO_ACCESS_TOKEN`, `PAYPAL_CLIENT_ID`, etc.
6. **Deploy** — Vercel ejecutará automáticamente `postinstall: prisma generate` + `next build`

### Para producción con Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta `download/editorial_horizonte_schema.sql` en el SQL Editor
3. Configura `DATABASE_URL` en Vercel con tu cadena de conexión Supabase
4. Reemplaza `src/lib/db.ts` y `src/lib/queries.ts` por el cliente `@supabase/supabase-js`
5. Migra las Server Actions a RPC calls sobre las funciones PL/pgSQL (`deduct_inventory_for_order`, `restore_inventory_for_order`, etc.)

## Créditos

**Diseño y desarrollo por [fastpagepro.com](https://fastpagepro.com)**

Este enlace está hardcodeado en el footer y no puede ser editado ni eliminado desde el panel administrador.

## Licencia

Propiedad de Editorial Horizonte. Todos los derechos reservados.
