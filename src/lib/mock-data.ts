// ============================================================================
//  MOCK BOOKS — 100 libros de muestra para catálogo ultra pro
//  Se usa cuando la DB no está configurada (fallback graceful)
//  Incluye: título, autor, sinopsis, precio, color de portada, género, año
// ============================================================================

export interface MockBook {
  id: string
  title: string
  slug: string
  isbn: string | null
  synopsis: string
  coverUrl: string | null
  originType: 'own' | 'third_party'
  publicationDate: string | null
  pages: number | null
  language: string
  format: 'physical' | 'digital' | 'audiobook'
  dimensions: string | null
  weightGrams: number | null
  edition: string | null
  pricePen: number
  priceUsd: number
  cost: number
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  metaTitle: string // color de portada
  publisher: {
    id: string
    name: string
    slug: string
    type: 'own' | 'third_party'
    commissionRate: number
  } | null
  authors: Array<{ id: string; fullName: string; slug: string; role: string }>
  categories: Array<{ id: string; name: string; slug: string }>
  inventory: Array<{
    id: string
    warehouseId: string
    warehouse: { id: string; name: string; code: string }
    stockAvailable: number
    stockConsigned: number
    stockReserved: number
  }>
}

// Paleta de colores editorial para portadas simuladas
const COVER_COLORS = [
  '#7c2d12', '#1e3a5f', '#4d7c0f', '#831843', '#0f766e',
  '#1f2937', '#7f1d1d', '#155e75', '#422006', '#075985',
  '#312e81', '#365314', '#581c87', '#92400e', '#134e4a',
  '#831843', '#1e40af', '#713f12', '#3730a3', '#155e75',
]

const AUTHORS = [
  'Juan Damonte', 'Cecilia Caballero', 'Luis Miró Quesada', 'Valeria Mendoza',
  'Carlos Yushimito', 'Claudia Salazar Jiménez', 'Diamela Eltit', 'Augusto Rubio Acosta',
  'Isabel Allende Llona', 'Roberto Bolaño', 'Mario Vargas Llosa', 'Carmen Ollé',
  'Antonio Cisneros', 'Blanca Varela', 'César Vallejo', 'José María Arguedas',
  'Alfredo Bryce Echenique', 'Julio Ramón Ribeyro', 'Ciro Alegría', 'Sebastián Salazar Bondy',
]

const PUBLISHERS = [
  { name: 'Editorial Horizonte', slug: 'editorial-horizonte', type: 'own' as const, commissionRate: 0 },
  { name: 'Librería SUR Ediciones', slug: 'libreria-sur-ediciones', type: 'third_party' as const, commissionRate: 30 },
  { name: 'Animal Inverso', slug: 'animal-inverso', type: 'third_party' as const, commissionRate: 25 },
  { name: 'Mejorada Ediciones', slug: 'mejorada-ediciones', type: 'third_party' as const, commissionRate: 28 },
  { name: 'Penguin Random House', slug: 'penguin-random-house', type: 'third_party' as const, commissionRate: 35 },
  { name: 'Alfaguara', slug: 'alfaguara', type: 'third_party' as const, commissionRate: 32 },
]

const CATEGORIES = [
  { name: 'Narrativa', slug: 'narrativa' },
  { name: 'Poesía', slug: 'poesia' },
  { name: 'Ensayo', slug: 'ensayo' },
  { name: 'Crónica', slug: 'cronica' },
  { name: 'Cuento', slug: 'cuento' },
  { name: 'Antología', slug: 'antologia' },
  { name: 'Traducida', slug: 'traducida' },
  { name: 'Biografía', slug: 'biografia' },
]

const WAREHOUSES = [
  { id: 'wh-central', name: 'Almacén Central', code: 'CENTRAL' },
  { id: 'wh-sur', name: 'Librería SUR', code: 'SUR' },
  { id: 'wh-vir', name: 'El Virrey', code: 'VIR' },
  { id: 'wh-cri', name: 'Crisol', code: 'CRI' },
]

const TITLE_PREFIXES = ['El', 'La', 'Los', 'Las', 'Un', 'Una', 'Bajo', 'Sobre', 'Después de', 'Antes de']
const TITLE_WORDS = [
  'horizonte', 'silencio', 'memoria', 'olvido', 'tiempo', 'voz', 'casa', 'río', 'ciudad', 'noche',
  'sombra', 'luz', 'abismo', 'espejo', 'sueño', 'viento', 'lluvia', 'fuego', 'piedra', 'agua',
  'palabra', 'cuerpo', 'alma', 'camino', 'viaje', 'regreso', 'partida', 'encuentro', 'despedida', 'reencuentro',
  'ocaso', 'amanecer', 'tarde', 'invierno', 'estío', 'grieta', 'herida', 'consuelo', 'ausencia', 'presencia',
]

const TITLE_SUFFIXES = [
  'de los días', 'en la sierra', 'rotos', 'del Pacífico', 'que se cruzan', 'del espejo',
  'de palabras', 'invisible', 'de la sierra', 'de tinta', 'de ceniza', 'de oro',
  'que vuelven', 'sin nombre', 'de nadie', 'del aire', 'del mar', 'de la noche',
  'en otoño', 'en primavera', 'de invierno', 'de verano', 'perdido', 'encontrado',
]

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function generateTitle(idx: number): string {
  // Para tener variedad determinista pero realista
  const usePrefix = idx % 3 === 0
  const useSuffix = idx % 2 === 0
  const word = TITLE_WORDS[(idx * 7) % TITLE_WORDS.length]

  if (usePrefix && useSuffix) {
    const prefix = TITLE_PREFIXES[idx % TITLE_PREFIXES.length]
    const suffix = TITLE_SUFFIXES[idx % TITLE_SUFFIXES.length]
    return `${prefix} ${word} ${suffix}`
  } else if (useSuffix) {
    const suffix = TITLE_SUFFIXES[idx % TITLE_SUFFIXES.length]
    const cap = word.charAt(0).toUpperCase() + word.slice(1)
    return `${cap} ${suffix}`
  } else if (usePrefix) {
    const prefix = TITLE_PREFIXES[idx % TITLE_PREFIXES.length]
    const cap = word.charAt(0).toUpperCase() + word.slice(1)
    return `${prefix} ${cap}`
  } else {
    const cap = word.charAt(0).toUpperCase() + word.slice(1)
    const suffix = TITLE_SUFFIXES[(idx + 3) % TITLE_SUFFIXES.length]
    return `${cap} ${suffix}`
  }
}

const SYNOPSIS_TEMPLATES = [
  'Una obra que recorre los pequeños rituales cotidianos y los eleva a una meditación sobre el tiempo, la memoria y el oficio de escribir. El autor despliega una prosa precisa, casi minimalista, donde cada frase parece tallada a mano.',
  'Una colección de ensayos líricos que cartografía los barrios, las voces y los silencios de la ciudad. A través de estampas breves y diálogos con sus habitantes, el texto teje una cartografía emocional imprescindible.',
  'Una novela fragmentaria sobre tres generaciones de una familia. El autor desmonta los silencios heredados y los secretos familiares con una sensibilidad quirúrgica. Una de las obras más ambiciosas de la narrativa reciente.',
  'Un poemario donde la voz se vuelve fluvial: el agua como metáfora del deseo, la pérdida y el retorno. Uno de los libros de poesía más celebrados de la última década en Latinoamérica.',
  'Una novela coral ambientada en una isla ficticia del Pacífico sur. Personajes rotos, paisajes opresivos, una sintaxis que respira. Una obra maestra del cuento extendido.',
  'El autor analiza cómo la noción de frontera ha atravesado la literatura latinoamericana desde el modernismo hasta el presente. Un ensayo imprescindible para comprender los desplazamientos geopolíticos del canon continental.',
  'Una de las novelas más celebradas de la nueva narrativa. Un relato visceral sobre el cuerpo, la maternidad y la violencia política. Edición conmemorativa con prólogo de la autora.',
  'El autor reúne en esta antología a 24 poetas del Pacífico latinoamericano. Un mapa indispensable de la lírica contemporánea que dialoga con el mar como símbolo, frontera y memoria.',
  'El autor reflexiona sobre el trabajo editorial como un acto de cuidado. Desde la mesa de corrección hasta la elección de la tipografía, este libro defiende la artesanía en tiempos de producción industrial.',
  'Una colección de cuentos donde el autor vuelve a su ciudad natal para rastrear vidas marginales con una compasión quirúrgica. Relatos breves, casi cinematográficos, donde lo extraordinario se filtra en lo cotidiano.',
]

export function getMockBooks(): MockBook[] {
  const books: MockBook[] = []

  for (let i = 0; i < 100; i++) {
    const title = generateTitle(i)
    const slug = `${slugify(title)}-${i + 1}`
    const authorName = AUTHORS[i % AUTHORS.length]
    const authorSlug = slugify(authorName)
    const publisher = PUBLISHERS[i % PUBLISHERS.length]
    const category1 = CATEGORIES[i % CATEGORIES.length]
    const category2 = CATEGORIES[(i + 3) % CATEGORIES.length]
    const coverColor = COVER_COLORS[i % COVER_COLORS.length]
    const year = 2019 + (i % 7)
    const pricePen = 35 + (i % 70)
    const isOwn = publisher.type === 'own'
    const isFeatured = i % 7 === 0
    const isNew = i % 11 === 0
    const pages = 80 + (i * 13) % 350
    const synopsis = SYNOPSIS_TEMPLATES[i % SYNOPSIS_TEMPLATES.length]

    // Stock por almacén
    const stockCentral = 20 + (i * 7) % 40
    const stockSur = i % 4 === 0 ? 0 : 3 + (i % 10)
    const stockVir = i % 5 === 0 ? 0 : 2 + (i % 8)
    const stockCri = i % 6 === 0 ? 0 : 2 + (i % 6)

    books.push({
      id: `mock-book-${i + 1}`,
      title,
      slug,
      isbn: `978-9972-${String(i + 1).padStart(4, '0')}-${i % 10}`,
      synopsis,
      coverUrl: null,
      originType: isOwn ? 'own' : 'third_party',
      publicationDate: new Date(`${year}-${String((i % 12) + 1).padStart(2, '0')}-15`).toISOString(),
      pages,
      language: i % 5 === 0 ? 'Inglés' : i % 7 === 0 ? 'Francés' : 'Español',
      format: 'physical',
      dimensions: `${20 + (i % 4)} x ${13 + (i % 3)} x ${(1 + (i % 3)).toFixed(1)} cm`,
      weightGrams: 180 + (i * 17) % 350,
      edition: i % 3 === 0 ? 'Segunda edición corregida' : 'Primera edición',
      pricePen,
      priceUsd: Math.round((pricePen / 3.6) * 100) / 100,
      cost: isOwn ? pricePen * 0.3 : pricePen * 0.55,
      isActive: true,
      isFeatured,
      isNew,
      metaTitle: coverColor,
      publisher: {
        id: `pub-${publisher.slug}`,
        name: publisher.name,
        slug: publisher.slug,
        type: publisher.type,
        commissionRate: publisher.commissionRate,
      },
      authors: [{
        id: `auth-${authorSlug}`,
        fullName: authorName,
        slug: authorSlug,
        role: 'author',
      }],
      categories: [
        { id: `cat-${category1.slug}`, name: category1.name, slug: category1.slug },
        ...(i % 2 === 0 ? [{ id: `cat-${category2.slug}`, name: category2.name, slug: category2.slug }] : []),
      ],
      inventory: [
        {
          id: `inv-${i}-central`,
          warehouseId: WAREHOUSES[0].id,
          warehouse: WAREHOUSES[0],
          stockAvailable: stockCentral,
          stockConsigned: 0,
          stockReserved: 0,
        },
        {
          id: `inv-${i}-sur`,
          warehouseId: WAREHOUSES[1].id,
          warehouse: WAREHOUSES[1],
          stockAvailable: stockSur,
          stockConsigned: stockSur > 0 ? 2 + (i % 4) : 0,
          stockReserved: 0,
        },
        {
          id: `inv-${i}-vir`,
          warehouseId: WAREHOUSES[2].id,
          warehouse: WAREHOUSES[2],
          stockAvailable: stockVir,
          stockConsigned: stockVir > 0 ? 1 + (i % 3) : 0,
          stockReserved: 0,
        },
        {
          id: `inv-${i}-cri`,
          warehouseId: WAREHOUSES[3].id,
          warehouse: WAREHOUSES[3],
          stockAvailable: stockCri,
          stockConsigned: stockCri > 0 ? 1 + (i % 2) : 0,
          stockReserved: 0,
        },
      ],
    })
  }

  return books
}

export function getMockCategories() {
  return CATEGORIES.map((c, i) => ({
    id: `cat-${c.slug}`,
    name: c.name,
    slug: c.slug,
    description: null,
    parentId: null,
    sortOrder: i + 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}

export function getMockWarehouses() {
  return WAREHOUSES.map((w, i) => ({
    id: w.id,
    name: w.name,
    code: w.code,
    type: w.code === 'CENTRAL' ? 'warehouse' as const : 'physical_store' as const,
    city: 'Lima',
    addressLine1: w.code === 'CENTRAL' ? 'Av. La Mar 1234' : `Av. Principal ${100 + i * 50}`,
    phone: `+51 1 ${234 + i} 5678`,
    email: `logistica@${w.code.toLowerCase()}.com`,
    managerName: ['Pedro Castillo', 'Ana Wiener', 'Felipe Vergara', 'Rosa García'][i] ?? null,
    isActive: true,
  }))
}
