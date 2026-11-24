# 🚀 FASTPAGE PRO - PROTOCOLO AGÉNTICO DE DESARROLLO (V4)
# Estándar de Ingeniería: Software Limpio, Anti-Spaghetti y Cero Alucinaciones
# Instructor / Arquitecto: Ing. Fabio Herrera | FastPage Pro

================================================================================
🎛️ CONFIGURACIÓN DE EJECUCIÓN: MODO CONFIRMAR (Estructural) | DIRECTO (Menor)
================================================================================
- **CONFIRMAR:** Cambios estructurales, lógica de negocio, filtros de catálogo, rutas o migraciones.
- **DIRECTO:** Ajustes cosméticos, copy oficial, correcciones puntuales de datos verificados o estilos Tailwind.

---

## 1. CONTEXTO REAL DEL PROYECTO

### 📌 IDENTIDAD Y STACK TECNOLÓGICO
- **Cliente / Proyecto:** Editorial Horizonte (`https://www.horizontelibros.com`)
- **Stack Verificado (`package.json`):** Next.js 16.1.1 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4 · Radix UI / shadcn · Zustand · TanStack React Query · Framer Motion · Three.js
- **Entorno Local:** `npm run dev` en `http://localhost:7000`
- **Validación Obligatoria:** `npm run build` y `npm run lint` (0 errores antes de commitear)
- **Despliegue Producción (Vercel):** `git push profast main` *(el remoto de despliegue es `profast`; no usar `origin`)*

---

## 2. FUENTES DE VERDAD Y REGLAS DE DOMINIO (EDITORIAL HORIZONTE)

### 📚 CATÁLOGO Y PORTADAS (CERO ALUCINACIONES)
- **Base de datos activa:** `src/data/seed-data.json` (consumida por `src/lib/books.ts` y `src/app/api/route.ts`).
- **Documentos maestros del cliente:**
  - `ADICIONALES/noviembre_2026/Catalogo_general_noviembre_2026.docx` (77 títulos, colecciones, series, autores, precios y novedades).
  - `ADICIONALES/extracted_pagina_web_horizonte.txt` (lineamientos de UI, navegación, contacto y sellos).
  - `ADICIONALES/noviembre_2026/portadas/` (portadas originales enviadas por el cliente).
- **Regla estricta de portadas (`public/covers/*.webp`):**
  1. **NUNCA** asociar una portada solo por nombre de archivo genérico o ambiguo (ej. `caratula-01`, `caratula-orig`, `boceto caratula`, `Caratula horizonte`, `Caratula grande3ra edicion`). Verificar siempre el título y autor visibles en la imagen antes de asignarla.
  2. Si existen dos archivos con mismo nombre base y distinta extensión (ej. `.jpg` y `.png` de `boceto caratula`), generar nombres `.webp` distintos en `public/covers/` para no sobrescribir uno con otro.
  3. Si un libro no tiene portada oficial verificada en Drive, asignar `coverUrl: null` para renderizar el mockup editorial 3D neutro sin inventar ni reciclar carátulas ajenas.

### 🗂️ TAXONOMÍA OFICIAL (COLECCIONES, SERIES Y BADGES)
- **2 Sellos Editoriales:** `Editorial Horizonte` (activo) y `Papel de Viento` (oculto/vacío hasta recibir títulos).
- **10 Colecciones Oficiales:** `cjma` (José María Arguedas), `ccv` (César Vallejo), `cfc` (Francisco Carrillo), `crb` (Ralph Bolton), `cn` (Narrativa), `cp` (Poesía), `ce` (Ensayo), `cij` (Infanto-Juvenil), `cm` (Miscelánea), `ci` (Idiomas).
- **No mezclar series homónimas:** Respetar explícitamente `collectionId` y `series` del Word (ej. `CJMA - Serie Ensayo` ≠ `Colección Ensayo (CE)`).
- **Badges oficiales en tarjetas (`book-card.tsx`):**
  - Mostrar origen con las etiquetas `Sello propio` / `Sello distribuido`.
  - Reservar `Novedad` (`isNew: true`) únicamente para los lanzamientos marcados como `NOVEDAD` en el Word oficial.
  - Mantener `isFeatured: false` por defecto (`Destacado` desactivado salvo indicación expresa del cliente para reediciones o títulos específicos).
- **Datos oficiales de contacto y retiro:** Jirón Sucre 470, San Miguel, Lima Metropolitana · WhatsApp `+51 955637859` · `contacto@horizontelibros.com` / `ventas@horizontelibros.com`.

---

## 3. REGLAS ESTRICTAS DE ARQUITECTURA (NO HACER)
- **NO** reescribir archivos enteros si solo se requiere modificar una función o entrada puntual (edición quirúrgica).
- **NO** borrar funciones existentes, variables de entorno ni comentarios de documentación.
- **NO** crear nuevos componentes o módulos monolíticos mayores a 200 líneas (aplicar modularización y separación de responsabilidades; esta regla aplica a código `.ts/.tsx`, no a archivos de datos como `seed-data.json`).
- **NO** instalar dependencias `npm` pesadas o redundantes sin previa autorización.
- **NO** inventar rutas, endpoints, precios, ISBNs ni esquemas inexistentes en el proyecto.
- **NO** usar estilos CSS inline ni CSS puro cuando Tailwind CSS resuelve el requerimiento.
- **NO** ejecutar scripts complejos de Python en línea con comillas anidadas en PowerShell; guardar utilidades temporales o de auditoría en `scripts/*.py`.

---

## 4. REFERENCIA DE ESQUEMA ACTIVO (`src/lib/types.ts` / `src/data/seed-data.json`)
```typescript
// Campos clave de cada libro en seed-data.json
interface SeedBookReference {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null; // null -> mockup editorial neutro
  collectionId: 'cjma' | 'ccv' | 'cfc' | 'crb' | 'cn' | 'cp' | 'ce' | 'cij' | 'cm' | 'ci';
  series: string;
  originType: 'PROPIO' | 'TERCERO';
  isFeatured: boolean; // false por defecto salvo reedición/título específico aprobado
  isNew: boolean;      // true solo para novedades oficiales del catálogo
  isActive: boolean;
}
```
