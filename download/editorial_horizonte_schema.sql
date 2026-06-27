-- ============================================================================
--  EDITORIAL HORIZONTE — ESQUEMA RELACIONAL SUPABASE / POSTGRESQL
--  Cliente      : Juan Damonte (Editorial Horizonte)
--  Proveedor    : Fast Page Pro — Fabio Herrera
--  Versión      : 1.0.0
--  Motor        : PostgreSQL 15+ (Supabase)
--  Descripción  : Esquema relacional completo para e-commerce + ERP
--                 multi-almacén con consignaciones, descuento de stock
--                 atómico en tiempo real, RLS estricta y auditoría total.
--  Compatible   : Ejecutar directo en Supabase SQL Editor (idempotente).
-- ============================================================================

-- ============================================================================
-- 0. EXTENSIONES
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";   -- geolocalización de almacenes

-- ============================================================================
-- 1. ENUMS (TIPOS DE DATOS DEL DOMINIO)
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'editor', 'warehouse_manager', 'customer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE publisher_type AS ENUM ('own', 'third_party');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE book_origin_type AS ENUM ('own', 'third_party');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE book_format AS ENUM ('physical', 'digital', 'audiobook');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE warehouse_type AS ENUM ('physical_store', 'warehouse', 'distribution_center');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_provider AS ENUM ('mercadopago', 'paypal', 'izipay', 'manual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'partial_refund');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE currency_code AS ENUM ('PEN', 'USD');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE movement_type AS ENUM (
    'initial_stock', 'sale', 'consignment_in', 'consignment_out',
    'return', 'adjustment', 'transfer_in', 'transfer_out',
    'manual_in', 'manual_out', 'reservation', 'reservation_release'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE transfer_status AS ENUM ('pending', 'in_transit', 'received', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE consignment_status AS ENUM ('active', 'partial_settled', 'settled', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE discount_type AS ENUM ('percentage', 'fixed', 'free_shipping');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE author_role AS ENUM ('author', 'co_author', 'translator', 'illustrator', 'prologuist');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- 2. TABLAS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 2.1  PROFILES  (extiende auth.users de Supabase)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  role          user_role NOT NULL DEFAULT 'customer',
  phone         TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.2  PUBLISHERS  (Editoriales — Fondo propio vs Terceras)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS publishers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  type            publisher_type NOT NULL DEFAULT 'third_party',
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (commission_rate BETWEEN 0 AND 100),
  royalty_rate    NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (royalty_rate BETWEEN 0 AND 100),
  contact_name    TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  tax_id          TEXT,
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.3  AUTHORS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS authors (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name    TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  biography    TEXT,
  photo_url    TEXT,
  nationality  TEXT,
  birth_date   DATE,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.4  CATEGORIES  (jerarquía con parent_id)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.5  BOOKS  (Catálogo — núcleo del sistema)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  isbn              TEXT UNIQUE,
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  synopsis          TEXT,
  cover_url         TEXT,                 -- Supabase Storage
  back_cover_url    TEXT,
  publisher_id      UUID REFERENCES publishers(id) ON DELETE SET NULL,
  origin_type       book_origin_type NOT NULL DEFAULT 'own',  -- Fondo Editorial Propio vs Terceras
  publication_date  DATE,
  pages             INT CHECK (pages >= 0),
  language          TEXT DEFAULT 'Español',
  format            book_format NOT NULL DEFAULT 'physical',
  weight_grams      INT CHECK (weight_grams >= 0),
  dimensions        TEXT,                 -- "23 x 15 x 2 cm"
  edition           TEXT,

  -- Precios (multi-moneda)
  price_pen         NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price_pen >= 0),
  price_usd         NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price_usd >= 0),
  cost              NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (cost >= 0),

  -- Flags
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  is_new            BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order        INT NOT NULL DEFAULT 0,

  -- SEO
  meta_title        TEXT,
  meta_description  TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.6  BOOK_AUTHORS  (M:N)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS book_authors (
  book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  role       author_role NOT NULL DEFAULT 'author',
  PRIMARY KEY (book_id, author_id)
);

-- ---------------------------------------------------------------------------
-- 2.7  BOOK_CATEGORIES  (M:N)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS book_categories (
  book_id      UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  category_id  UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);

-- ---------------------------------------------------------------------------
-- 2.8  WAREHOUSES  (Almacenes / Librerías aliadas — nodos físicos)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  code          TEXT UNIQUE NOT NULL,     -- "SUR", "VIR", "CENTRAL"
  type          warehouse_type NOT NULL DEFAULT 'physical_store',
  address_line1 TEXT,
  address_line2 TEXT,
  city          TEXT,
  state         TEXT,
  country       TEXT DEFAULT 'Perú',
  postal_code   TEXT,
  phone         TEXT,
  email         TEXT,
  manager_name  TEXT,
  geolocation   GEOMETRY(Point, 4326),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.9  INVENTORY  (Stock por libro × almacén — núcleo del ERP)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id         UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  warehouse_id    UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
  stock_available INT NOT NULL DEFAULT 0 CHECK (stock_available >= 0),
  stock_consigned INT NOT NULL DEFAULT 0 CHECK (stock_consigned >= 0),
  stock_reserved  INT NOT NULL DEFAULT 0 CHECK (stock_reserved  >= 0), -- carritos activos
  min_threshold   INT NOT NULL DEFAULT 0,                                -- alerta reposición
  max_capacity    INT,
  location_code   TEXT,                                                  -- pasillo/estante
  last_count_date TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (book_id, warehouse_id)
);

-- ---------------------------------------------------------------------------
-- 2.10  STOCK_MOVEMENTS  (Auditoría total — inmutable)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_movements (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id        UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  warehouse_id   UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
  movement_type  movement_type NOT NULL,
  quantity       INT NOT NULL,                       -- positivo: entrada, negativo: salida
  balance_before INT NOT NULL,
  balance_after  INT NOT NULL,
  reference_type TEXT,                                -- 'order' | 'transfer' | 'consignment' | 'manual'
  reference_id   UUID,
  notes          TEXT,
  performed_by   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.11  DISCOUNTS  (Códigos promocionales)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS discounts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code              TEXT UNIQUE NOT NULL,
  description       TEXT,
  type              discount_type NOT NULL DEFAULT 'percentage',
  value             NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_order_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_uses          INT,
  used_count        INT NOT NULL DEFAULT 0,
  valid_from        TIMESTAMPTZ,
  valid_until       TIMESTAMPTZ,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.12  CUSTOMERS  (compradores — pueden no tener auth)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                     TEXT NOT NULL,
  full_name                 TEXT,
  phone                     TEXT,
  auth_user_id              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  default_shipping_address  JSONB,
  default_billing_address   JSONB,
  marketing_opt_in          BOOLEAN NOT NULL DEFAULT FALSE,
  total_orders              INT NOT NULL DEFAULT 0,
  total_spent               NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email)
);

-- ---------------------------------------------------------------------------
-- 2.13  ORDERS  (Pedidos)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number         TEXT UNIQUE NOT NULL,
  customer_id          UUID REFERENCES customers(id) ON DELETE SET NULL,

  -- Snapshot del cliente (inmutable aunque el cliente cambie)
  customer_email       TEXT NOT NULL,
  customer_name        TEXT,
  customer_phone       TEXT,

  status               order_status NOT NULL DEFAULT 'pending',
  currency             currency_code NOT NULL DEFAULT 'PEN',

  -- Totales
  subtotal             NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount           NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount         NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Almacén principal de despacho
  warehouse_id         UUID REFERENCES warehouses(id) ON DELETE SET NULL,

  -- Pago
  payment_provider     payment_provider,
  payment_provider_id  TEXT,
  payment_status       payment_status NOT NULL DEFAULT 'pending',
  paid_at              TIMESTAMPTZ,

  -- Direcciones (snapshot)
  shipping_address     JSONB,
  billing_address      JSONB,

  -- Descuento aplicado
  discount_id          UUID REFERENCES discounts(id) ON DELETE SET NULL,

  -- Metadata
  notes                TEXT,
  ip_address           INET,
  user_agent           TEXT,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  shipped_at           TIMESTAMPTZ,
  delivered_at         TIMESTAMPTZ,
  cancelled_at         TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- 2.14  ORDER_ITEMS  (Líneas de pedido — snapshot de precios/comisiones)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  book_id             UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  warehouse_id        UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,

  quantity            INT NOT NULL CHECK (quantity > 0),
  unit_price          NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  discount_per_unit   NUMERIC(10,2) NOT NULL DEFAULT 0,
  line_total          NUMERIC(12,2) NOT NULL,

  -- Snapshot para auditoría (aunque el libro cambie después)
  book_title_snapshot TEXT NOT NULL,
  publisher_id_snapshot UUID,
  origin_type_snapshot  book_origin_type NOT NULL,
  commission_rate_snapshot NUMERIC(5,2) NOT NULL DEFAULT 0,
  commission_amount   NUMERIC(12,2) NOT NULL DEFAULT 0,
  royalty_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,

  stock_deducted      BOOLEAN NOT NULL DEFAULT FALSE,
  deducted_at         TIMESTAMPTZ,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.15  TRANSFERS  (Transferencias entre almacenes)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transfers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transfer_number   TEXT UNIQUE NOT NULL,
  from_warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
  to_warehouse_id   UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
  status            transfer_status NOT NULL DEFAULT 'pending',
  notes             TEXT,
  performed_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  shipped_at        TIMESTAMPTZ,
  received_at       TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS transfer_items (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transfer_id        UUID NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
  book_id            UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  quantity           INT NOT NULL CHECK (quantity > 0),
  received_quantity  INT NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.16  CONSIGNMENTS  (Consignaciones a librerías aliadas)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consignments (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consignment_number  TEXT UNIQUE NOT NULL,
  book_id             UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  warehouse_id        UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
  publisher_id        UUID REFERENCES publishers(id) ON DELETE SET NULL,

  quantity_consigned  INT NOT NULL CHECK (quantity_consigned > 0),
  quantity_sold       INT NOT NULL DEFAULT 0,
  quantity_returned   INT NOT NULL DEFAULT 0,
  quantity_pending    INT NOT NULL DEFAULT 0,  -- consigned - sold - returned

  status              consignment_status NOT NULL DEFAULT 'active',
  agreement_date      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  settlement_date     TIMESTAMPTZ,
  commission_rate     NUMERIC(5,2) NOT NULL DEFAULT 0,
  royalty_rate        NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_settlement    NUMERIC(12,2) NOT NULL DEFAULT 0,

  notes               TEXT,
  performed_by        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.17  PAYMENTS  (registros detallados por intento de pago)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id                 UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider                 payment_provider NOT NULL,
  provider_transaction_id  TEXT,
  amount                   NUMERIC(12,2) NOT NULL,
  currency                 currency_code NOT NULL DEFAULT 'PEN',
  status                   payment_status NOT NULL DEFAULT 'pending',
  raw_response             JSONB,
  error_message            TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.18  SETTINGS  (configuraciones globales key/value)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT UNIQUE NOT NULL,
  value       JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2.19  AUDIT_LOG  (auditoría de acciones administrativas)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action       TEXT NOT NULL,         -- 'book.update', 'inventory.adjust', ...
  entity_type  TEXT NOT NULL,
  entity_id    UUID,
  old_value    JSONB,
  new_value    JSONB,
  ip_address   INET,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. ÍNDICES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_books_slug           ON books(slug);
CREATE INDEX IF NOT EXISTS idx_books_origin         ON books(origin_type);
CREATE INDEX IF NOT EXISTS idx_books_active         ON books(is_active);
CREATE INDEX IF NOT EXISTS idx_books_featured       ON books(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_books_publisher      ON books(publisher_id);
CREATE INDEX IF NOT EXISTS idx_books_price_pen      ON books(price_pen);

CREATE INDEX IF NOT EXISTS idx_inventory_book_wh    ON inventory(book_id, warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse  ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock  ON inventory(stock_available)
  WHERE stock_available <= min_threshold;

CREATE INDEX IF NOT EXISTS idx_movements_book_wh    ON stock_movements(book_id, warehouse_id);
CREATE INDEX IF NOT EXISTS idx_movements_created    ON stock_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movements_ref        ON stock_movements(reference_type, reference_id);

CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer      ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_warehouse     ON orders(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_orders_created       ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number        ON orders(order_number);

CREATE INDEX IF NOT EXISTS idx_order_items_order    ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_book_wh  ON order_items(book_id, warehouse_id);

CREATE INDEX IF NOT EXISTS idx_consignments_status  ON consignments(status);
CREATE INDEX IF NOT EXISTS idx_consignments_book_wh ON consignments(book_id, warehouse_id);

CREATE INDEX IF NOT EXISTS idx_transfers_status     ON transfers(status);
CREATE INDEX IF NOT EXISTS idx_audit_created        ON audit_log(created_at DESC);

-- ============================================================================
-- 4. FUNCIONES PL/pgSQL
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 4.1  handle_new_user()  — crea profile automáticamente al registrarse
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 4.2  generate_order_number()  — formato EH-YYYYMMDD-XXXXX
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seq_val BIGINT;
  today_str TEXT;
BEGIN
  today_str := to_char(NOW() AT TIME ZONE 'America/Lima', 'YYYYMMDD');
  seq_val := nextval(pg_get_serial_sequence('public.orders', 'id'));
  RETURN 'EH-' || today_str || '-' || lpad((seq_val % 100000)::text, 5, '0');
END;
$$;

-- ---------------------------------------------------------------------------
-- 4.3  set_updated_at()  — trigger genérico para updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 4.4  recalc_inventory_balance()  — recalcula stock_consigned desde consignments
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.recalc_consigned_stock(
  p_book_id      UUID,
  p_warehouse_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_consigned INT;
BEGIN
  SELECT COALESCE(SUM(quantity_pending), 0)
    INTO total_consigned
    FROM public.consignments
   WHERE book_id = p_book_id
     AND warehouse_id = p_warehouse_id
     AND status IN ('active', 'partial_settled');

  UPDATE public.inventory
     SET stock_consigned = total_consigned,
         updated_at = NOW()
   WHERE book_id = p_book_id
     AND warehouse_id = p_warehouse_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- 4.5  *** ALGORITMO DE DESCUENTO DE STOCK ATÓMICO ***
--      deduct_inventory_for_order(p_order_id)
--      - Adquiere row-level lock (FOR UPDATE) sobre cada línea de inventario.
--      - Valida stock suficiente ANTES de mutar nada (transacción atómica).
--      - Registra stock_movements con balance_before / balance_after.
--      - Marca order_items.stock_deducted = TRUE.
--      - Lanza EXCEPTION si stock insuficiente (rollback total).
--      - Idempotente: si ya fue descontado, no hace nada.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.deduct_inventory_for_order(p_order_id UUID)
RETURNS TABLE(book_id UUID, warehouse_id UUID, quantity INT, status TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item RECORD;
  inv RECORD;
  insufficient BOOLEAN := FALSE;
BEGIN
  -- 1. Validación previa: todo item debe tener stock suficiente
  FOR item IN
    SELECT oi.id, oi.book_id, oi.warehouse_id, oi.quantity, oi.stock_deducted
      FROM public.order_items oi
     WHERE oi.order_id = p_order_id
  LOOP
    IF item.stock_deducted THEN
      CONTINUE;
    END IF;

    SELECT *
      INTO inv
      FROM public.inventory
     WHERE book_id = item.book_id
       AND warehouse_id = item.warehouse_id
     FOR UPDATE;  -- *** BLOQUEO DE CONCURRENCIA ***

    IF NOT FOUND OR inv.stock_available < item.quantity THEN
      insufficient := TRUE;
      LEAVE;
    END IF;
  END LOOP;

  IF insufficient THEN
    RAISE EXCEPTION 'STOCK_INSUFFICIENT: uno o más items no tienen stock disponible para la orden %', p_order_id;
  END IF;

  -- 2. Descuento atómico + auditoría
  FOR item IN
    SELECT oi.id, oi.book_id, oi.warehouse_id, oi.quantity, oi.stock_deducted
      FROM public.order_items oi
     WHERE oi.order_id = p_order_id
  LOOP
    IF item.stock_deducted THEN
      CONTINUE;
    END IF;

    SELECT *
      INTO inv
      FROM public.inventory
     WHERE book_id = item.book_id
       AND warehouse_id = item.warehouse_id
     FOR UPDATE;

    UPDATE public.inventory
       SET stock_available = inv.stock_available - item.quantity,
           updated_at = NOW()
     WHERE book_id = item.book_id
       AND warehouse_id = item.warehouse_id;

    INSERT INTO public.stock_movements
      (book_id, warehouse_id, movement_type, quantity,
       balance_before, balance_after,
       reference_type, reference_id, notes)
    VALUES
      (item.book_id, item.warehouse_id, 'sale', -item.quantity,
       inv.stock_available, inv.stock_available - item.quantity,
       'order', p_order_id, 'Descuento automático por venta');

    UPDATE public.order_items
       SET stock_deducted = TRUE,
           deducted_at = NOW()
     WHERE id = item.id;

    quantity := item.quantity;
    book_id := item.book_id;
    warehouse_id := item.warehouse_id;
    status := 'deducted';
    RETURN NEXT;
  END LOOP;

  -- 3. Actualizar estado de la orden
  UPDATE public.orders
     SET status = 'processing',
         updated_at = NOW()
   WHERE id = p_order_id
     AND status = 'paid';
END;
$$;

-- ---------------------------------------------------------------------------
-- 4.6  restore_inventory_for_order()  — rollback si la orden se cancela
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.restore_inventory_for_order(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item RECORD;
  inv RECORD;
BEGIN
  FOR item IN
    SELECT id, book_id, warehouse_id, quantity
      FROM public.order_items
     WHERE order_id = p_order_id
       AND stock_deducted = TRUE
  LOOP
    SELECT * INTO inv
      FROM public.inventory
     WHERE book_id = item.book_id
       AND warehouse_id = item.warehouse_id
     FOR UPDATE;

    UPDATE public.inventory
       SET stock_available = inv.stock_available + item.quantity,
           updated_at = NOW()
     WHERE book_id = item.book_id
       AND warehouse_id = item.warehouse_id;

    INSERT INTO public.stock_movements
      (book_id, warehouse_id, movement_type, quantity,
       balance_before, balance_after,
       reference_type, reference_id, notes)
    VALUES
      (item.book_id, item.warehouse_id, 'return', item.quantity,
       inv.stock_available, inv.stock_available + item.quantity,
       'order', p_order_id, 'Restauración por cancelación de orden');

    UPDATE public.order_items
       SET stock_deducted = FALSE,
           deducted_at = NULL
     WHERE id = item.id;
  END LOOP;
END;
$$;

-- ---------------------------------------------------------------------------
-- 4.7  get_global_stock(book_id)  — vista agregada multi-almacén
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_global_stock(p_book_id UUID)
RETURNS TABLE(
  warehouse_id UUID,
  warehouse_name TEXT,
  warehouse_code TEXT,
  stock_available INT,
  stock_consigned INT,
  stock_reserved INT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT w.id, w.name, w.code,
         COALESCE(i.stock_available, 0),
         COALESCE(i.stock_consigned, 0),
         COALESCE(i.stock_reserved, 0)
    FROM public.warehouses w
    LEFT JOIN public.inventory i
      ON i.warehouse_id = w.id
     AND i.book_id = p_book_id
   WHERE w.is_active = TRUE
   ORDER BY w.sort_order NULLS LAST, w.name;
$$;

-- ---------------------------------------------------------------------------
-- 4.8  calculate_order_totals(p_order_id)  — recalcula totales desde items
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_order_totals(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subtotal NUMERIC(12,2);
  v_discount NUMERIC(12,2);
  v_shipping NUMERIC(12,2);
  v_total    NUMERIC(12,2);
BEGIN
  SELECT COALESCE(SUM(line_total), 0) INTO v_subtotal
    FROM public.order_items WHERE order_id = p_order_id;

  SELECT COALESCE(discount_amount, 0), COALESCE(shipping_amount, 0)
    INTO v_discount, v_shipping
    FROM public.orders WHERE id = p_order_id;

  v_total := v_subtotal - v_discount + v_shipping;

  UPDATE public.orders
     SET subtotal = v_subtotal,
         total_amount = v_total,
         updated_at = NOW()
   WHERE id = p_order_id;
END;
$$;

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

-- 5.1  Crear profile al registrar usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5.2  updated_at automático en todas las tablas relevantes
DO $$ DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'profiles','publishers','authors','categories','books',
    'warehouses','inventory','discounts','customers',
    'orders','transfers','consignments','payments','settings'
  ])
  LOOP
    EXECUTE format($f$
      DROP TRIGGER IF EXISTS trg_%s_updated ON public.%I;
      CREATE TRIGGER trg_%s_updated
        BEFORE UPDATE ON public.%I
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    $f$, t, t, t, t);
  END LOOP;
END $$;

-- 5.3  Auto-generar order_number al insertar orden
DROP TRIGGER IF EXISTS trg_orders_number ON public.orders;
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_orders_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

-- 5.4  Recalcular quantity_pending en consignments
DROP TRIGGER IF EXISTS trg_consignments_balance ON public.consignments;
CREATE OR REPLACE FUNCTION public.set_consignments_balance()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.quantity_pending := NEW.quantity_consigned - NEW.quantity_sold - NEW.quantity_returned;
  IF NEW.quantity_pending <= 0 AND NEW.status IN ('active','partial_settled') THEN
    NEW.status := 'settled';
    NEW.settlement_date := COALESCE(NEW.settlement_date, NOW());
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_consignments_balance
  BEFORE INSERT OR UPDATE ON public.consignments
  FOR EACH ROW EXECUTE FUNCTION public.set_consignments_balance();

-- 5.5  Auto-recalcular consigned stock en inventory al cambiar consignments
DROP TRIGGER IF EXISTS trg_consignments_recalc ON public.consignments;
CREATE OR REPLACE FUNCTION public.trigger_recalc_consigned()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  PERFORM public.recalc_consigned_stock(
    COALESCE(NEW.book_id, OLD.book_id),
    COALESCE(NEW.warehouse_id, OLD.warehouse_id)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;
CREATE TRIGGER trg_consignments_recalc
  AFTER INSERT OR UPDATE OR DELETE ON public.consignments
  FOR EACH ROW EXECUTE FUNCTION public.trigger_recalc_consigned();

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activar RLS en TODAS las tablas con datos sensibles
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors           ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE books             ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory         ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements   ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE consignments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log         ENABLE ROW LEVEL SECURITY;

-- Helper: funciones para detectar rol del usuario actual
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles
     WHERE id = auth.uid() AND role IN ('admin','editor','warehouse_manager')
  );
$$;

-- 6.1  PROFILES — cada usuario ve su propio profile; staff ve todos
DROP POLICY IF EXISTS profiles_select_own_or_staff ON public.profiles;
CREATE POLICY profiles_select_own_or_staff ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_staff());

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS profiles_insert_admin ON public.profiles;
CREATE POLICY profiles_insert_admin ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS profiles_delete_admin ON public.profiles;
CREATE POLICY profiles_delete_admin ON public.profiles
  FOR DELETE USING (public.is_admin());

-- 6.2  BOOKS, AUTHORS, CATEGORIES, PUBLISHERS, WAREHOUSES — públicos leen activos
DROP POLICY IF EXISTS books_public_read ON public.books;
CREATE POLICY books_public_read ON public.books
  FOR SELECT USING (is_active = TRUE OR public.is_staff());

DROP POLICY IF EXISTS books_staff_write ON public.books;
CREATE POLICY books_staff_write ON public.books
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS authors_public_read ON public.authors;
CREATE POLICY authors_public_read ON public.authors
  FOR SELECT USING (is_active = TRUE OR public.is_staff());

DROP POLICY IF EXISTS authors_staff_write ON public.authors;
CREATE POLICY authors_staff_write ON public.authors
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS categories_public_read ON public.categories;
CREATE POLICY categories_public_read ON public.categories
  FOR SELECT USING (is_active = TRUE OR public.is_staff());

DROP POLICY IF EXISTS categories_staff_write ON public.categories;
CREATE POLICY categories_staff_write ON public.categories
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS publishers_public_read ON public.publishers;
CREATE POLICY publishers_public_read ON public.publishers
  FOR SELECT USING (is_active = TRUE OR public.is_staff());

DROP POLICY IF EXISTS publishers_staff_write ON public.publishers;
CREATE POLICY publishers_staff_write ON public.publishers
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS warehouses_public_read ON public.warehouses;
CREATE POLICY warehouses_public_read ON public.warehouses
  FOR SELECT USING (is_active = TRUE OR public.is_staff());

DROP POLICY IF EXISTS warehouses_staff_write ON public.warehouses;
CREATE POLICY warehouses_staff_write ON public.warehouses
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- 6.3  BOOK_AUTHORS / BOOK_CATEGORIES — públicos leen, staff escribe
DROP POLICY IF EXISTS book_authors_read ON public.book_authors;
CREATE POLICY book_authors_read ON public.book_authors
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS book_authors_staff_write ON public.book_authors;
CREATE POLICY book_authors_staff_write ON public.book_authors
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS book_categories_read ON public.book_categories;
CREATE POLICY book_categories_read ON public.book_categories
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS book_categories_staff_write ON public.book_categories;
CREATE POLICY book_categories_staff_write ON public.book_categories
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- 6.4  INVENTORY, STOCK_MOVEMENTS, CONSIGNMENTS, TRANSFERS — SOLO STAFF
DROP POLICY IF EXISTS inventory_staff_only ON public.inventory;
CREATE POLICY inventory_staff_only ON public.inventory
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS movements_staff_only ON public.stock_movements;
CREATE POLICY movements_staff_only ON public.stock_movements
  FOR SELECT USING (public.is_staff());

-- Las inserciones de movimientos las hace SECURITY DEFINER desde funciones
DROP POLICY IF EXISTS movements_insert_definer ON public.stock_movements;
CREATE POLICY movements_insert_definer ON public.stock_movements
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS consignments_staff_only ON public.consignments;
CREATE POLICY consignments_staff_only ON public.consignments
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS transfers_staff_only ON public.transfers;
CREATE POLICY transfers_staff_only ON public.transfers
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS transfer_items_staff_only ON public.transfer_items;
CREATE POLICY transfer_items_staff_only ON public.transfer_items
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- 6.5  CUSTOMERS — el propio cliente se ve; staff ve todos
DROP POLICY IF EXISTS customers_select_own_or_staff ON public.customers;
CREATE POLICY customers_select_own_or_staff ON public.customers
  FOR SELECT USING (auth_user_id = auth.uid() OR public.is_staff());

DROP POLICY IF EXISTS customers_insert_own_or_staff ON public.customers;
CREATE POLICY customers_insert_own_or_staff ON public.customers
  FOR INSERT WITH CHECK (auth_user_id = auth.uid() OR public.is_staff());

DROP POLICY IF EXISTS customers_update_own_or_staff ON public.customers;
CREATE POLICY customers_update_own_or_staff ON public.customers
  FOR UPDATE USING (auth_user_id = auth.uid() OR public.is_staff());

-- 6.6  ORDERS / ORDER_ITEMS / PAYMENTS — cliente ve las suyas; staff todas
DROP POLICY IF EXISTS orders_select_own_or_staff ON public.orders;
CREATE POLICY orders_select_own_or_staff ON public.orders
  FOR SELECT USING (
    customer_id IN (SELECT id FROM public.customers WHERE auth_user_id = auth.uid())
    OR public.is_staff()
  );

DROP POLICY IF EXISTS orders_insert_own_or_staff ON public.orders;
CREATE POLICY orders_insert_own_or_staff ON public.orders
  FOR INSERT WITH CHECK (TRUE);  -- checkout público anónimo permitido

DROP POLICY IF EXISTS orders_update_staff ON public.orders;
CREATE POLICY orders_update_staff ON public.orders
  FOR UPDATE USING (public.is_staff());

DROP POLICY IF EXISTS order_items_select_own_or_staff ON public.order_items;
CREATE POLICY order_items_select_own_or_staff ON public.order_items
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM public.orders o
       WHERE o.customer_id IN (SELECT id FROM public.customers WHERE auth_user_id = auth.uid())
    )
    OR public.is_staff()
  );

DROP POLICY IF EXISTS order_items_insert_public ON public.order_items;
CREATE POLICY order_items_insert_public ON public.order_items
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS order_items_update_staff ON public.order_items;
CREATE POLICY order_items_update_staff ON public.order_items
  FOR UPDATE USING (public.is_staff());

DROP POLICY IF EXISTS payments_select_own_or_staff ON public.payments;
CREATE POLICY payments_select_own_or_staff ON public.payments
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM public.orders o
       WHERE o.customer_id IN (SELECT id FROM public.customers WHERE auth_user_id = auth.uid())
    )
    OR public.is_staff()
  );

DROP POLICY IF EXISTS payments_insert_staff ON public.payments;
CREATE POLICY payments_insert_staff ON public.payments
  FOR INSERT WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS payments_update_staff ON public.payments;
CREATE POLICY payments_update_staff ON public.payments
  FOR UPDATE USING (public.is_staff());

-- 6.7  DISCOUNTS — público valida; staff administra
DROP POLICY IF EXISTS discounts_public_read_active ON public.discounts;
CREATE POLICY discounts_public_read_active ON public.discounts
  FOR SELECT USING (is_active = TRUE OR public.is_staff());

DROP POLICY IF EXISTS discounts_staff_write ON public.discounts;
CREATE POLICY discounts_staff_write ON public.discounts
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- 6.8  SETTINGS — público lee; staff escribe
DROP POLICY IF EXISTS settings_public_read ON public.settings;
CREATE POLICY settings_public_read ON public.settings
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS settings_staff_write ON public.settings;
CREATE POLICY settings_staff_write ON public.settings
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- 6.9  AUDIT_LOG — solo staff lee; funciones SECURITY DEFINER escriben
DROP POLICY IF EXISTS audit_log_staff_read ON public.audit_log;
CREATE POLICY audit_log_staff_read ON public.audit_log
  FOR SELECT USING (public.is_staff());

DROP POLICY IF EXISTS audit_log_definer_insert ON public.audit_log;
CREATE POLICY audit_log_definer_insert ON public.audit_log
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================================
-- 7. STORAGE BUCKETS  (Supabase Storage)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('author-photos', 'author-photos', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage: público lee, staff escribe
DROP POLICY IF EXISTS "book-covers-public-read" ON storage.objects;
CREATE POLICY "book-covers-public-read" ON storage.objects
  FOR SELECT USING (bucket_id = 'book-covers');

DROP POLICY IF EXISTS "book-covers-staff-write" ON storage.objects;
CREATE POLICY "book-covers-staff-write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'book-covers' AND public.is_staff()
  );

DROP POLICY IF EXISTS "book-covers-staff-update" ON storage.objects;
CREATE POLICY "book-covers-staff-update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'book-covers' AND public.is_staff()
  );

DROP POLICY IF EXISTS "book-covers-staff-delete" ON storage.objects;
CREATE POLICY "book-covers-staff-delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'book-covers' AND public.is_staff()
  );

-- Repetir patrón para author-photos y site-assets
DROP POLICY IF EXISTS "author-photos-public-read" ON storage.objects;
CREATE POLICY "author-photos-public-read" ON storage.objects
  FOR SELECT USING (bucket_id = 'author-photos');

DROP POLICY IF EXISTS "author-photos-staff-write" ON storage.objects;
CREATE POLICY "author-photos-staff-write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'author-photos' AND public.is_staff());

DROP POLICY IF EXISTS "author-photos-staff-update" ON storage.objects;
CREATE POLICY "author-photos-staff-update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'author-photos' AND public.is_staff());

DROP POLICY IF EXISTS "author-photos-staff-delete" ON storage.objects;
CREATE POLICY "author-photos-staff-delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'author-photos' AND public.is_staff());

DROP POLICY IF EXISTS "site-assets-public-read" ON storage.objects;
CREATE POLICY "site-assets-public-read" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "site-assets-staff-write" ON storage.objects;
CREATE POLICY "site-assets-staff-write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND public.is_staff());

DROP POLICY IF EXISTS "site-assets-staff-update" ON storage.objects;
CREATE POLICY "site-assets-staff-update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'site-assets' AND public.is_staff());

DROP POLICY IF EXISTS "site-assets-staff-delete" ON storage.objects;
CREATE POLICY "site-assets-staff-delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'site-assets' AND public.is_staff());

-- ============================================================================
-- 8. DATOS SEMILLA (seed mínimo)
-- ============================================================================

-- 8.1  Editorial Horizonte como Fondo Editorial Propio
INSERT INTO publishers (name, slug, type, commission_rate, royalty_rate, is_active)
VALUES ('Editorial Horizonte', 'editorial-horizonte', 'own', 0, 0, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 8.2  Almacenes aliados (referenciados en el brief)
INSERT INTO publishers (name, slug, type, commission_rate, is_active)
VALUES
  ('Librería SUR Ediciones', 'libreria-sur-ediciones', 'third_party', 30.00, TRUE),
  ('Animal Inverso', 'animal-inverso', 'third_party', 25.00, TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO warehouses (name, code, type, city, country, is_active)
VALUES
  ('Almacén Central Editorial Horizonte', 'CENTRAL', 'warehouse', 'Lima', 'Perú', TRUE),
  ('Librería SUR', 'SUR', 'physical_store', 'Lima', 'Perú', TRUE),
  ('El Virrey', 'VIR', 'physical_store', 'Lima', 'Perú', TRUE),
  ('Crisol', 'CRI', 'physical_store', 'Lima', 'Perú', TRUE)
ON CONFLICT (code) DO NOTHING;

-- 8.3  Categorías base
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Narrativa',         'narrativa',         1),
  ('Poesía',            'poesia',            2),
  ('Ensayo',            'ensayo',            3),
  ('Crónica',           'cronica',           4),
  ('Literatura Infantil','literatura-infantil',5),
  ('Traducida',         'traducida',         6)
ON CONFLICT (slug) DO NOTHING;

-- 8.4  Settings iniciales
INSERT INTO settings (key, value, description) VALUES
  ('site_name', '"Editorial Horizonte"'::jsonb, 'Nombre del sitio'),
  ('currency_default', '"PEN"'::jsonb, 'Moneda por defecto'),
  ('shipping_free_threshold', '150'::jsonb, 'Envío gratis a partir de S/150'),
  ('tax_rate', '0'::jsonb, 'IGV incluido en precios'),
  ('contact_email', '"contacto@editorialhorizonte.com"'::jsonb, 'Email público'),
  ('social_instagram', '"@editorialhorizonte"'::jsonb, 'Instagram'),
  ('developer_credits', '"Diseño y desarrollo por fastpagepro.com"'::jsonb,
   'Créditos del desarrollador — NO MODIFICABLE')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- 9. COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================
COMMENT ON TABLE  profiles          IS 'Usuarios autenticados (extiende auth.users de Supabase).';
COMMENT ON TABLE  publishers        IS 'Editoriales. type=own → Fondo Editorial Propio; type=third_party → Terceras con comisión.';
COMMENT ON TABLE  books             IS 'Catálogo de libros. origin_type separa fondo propio de terceras para reportes de margen.';
COMMENT ON TABLE  warehouses        IS 'Nodos físicos: cada librería aliada es un almacén independiente.';
COMMENT ON TABLE  inventory         IS 'Stock por libro × almacén. ÚNICA fuente de verdad de disponibilidad.';
COMMENT ON TABLE  stock_movements   IS 'Auditoría inmutable de todo movimiento de stock (ventas, consignaciones, ajustes, transferencias).';
COMMENT ON TABLE  orders            IS 'Pedidos. order_number se autogenera con formato EH-YYYYMMDD-XXXXX.';
COMMENT ON TABLE  order_items       IS 'Líneas de pedido con snapshot de precio y comisión para auditoría histórica.';
COMMENT ON TABLE  consignments      IS 'Consignaciones de libros a librerías aliadas. quantity_pending se autocalcula.';
COMMENT ON TABLE  transfers         IS 'Transferencias de stock entre almacenes.';
COMMENT ON TABLE  payments          IS 'Intentos de pago detallados (uno por intento, no por orden).';
COMMENT ON TABLE  audit_log         IS 'Bitácora de acciones administrativas para trazabilidad.';

COMMENT ON FUNCTION public.deduct_inventory_for_order(UUID)
  IS 'ALGORITMO PRINCIPAL: descuenta stock atómicamente con bloqueo FOR UPDATE. Lanza EXCEPTION si stock insuficiente.';
COMMENT ON FUNCTION public.restore_inventory_for_order(UUID)
  IS 'Restaura stock cuando una orden se cancela (rollback simétrico al descuento).';
COMMENT ON FUNCTION public.recalc_consigned_stock(UUID, UUID)
  IS 'Recalcula stock_consigned en inventory a partir de consignments activas.';

-- ============================================================================
--  FIN DEL ESQUEMA — Editorial Horizonte v1.0.0
--  Próximo paso: scaffolding del monorepo Next.js 15 + integración Supabase.
-- ============================================================================
