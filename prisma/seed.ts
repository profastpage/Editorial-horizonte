// ============================================================================
//  SEED — Editorial Horizonte
//  Ejecutar con: bun run prisma/seed.ts
// ============================================================================

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de Editorial Horizonte...')

  // --------------------------------------------------------------
  // 1. PROFILES
  // --------------------------------------------------------------
  const admin = await db.profile.upsert({
    where: { email: 'admin@editorialhorizonte.com' },
    update: {},
    create: {
      email: 'admin@editorialhorizonte.com',
      fullName: 'Juan Damonte',
      role: 'admin',
      phone: '+51 999 888 777',
      isActive: true,
    },
  })

  const editor = await db.profile.upsert({
    where: { email: 'editor@editorialhorizonte.com' },
    update: {},
    create: {
      email: 'editor@editorialhorizonte.com',
      fullName: 'María Quispe',
      role: 'editor',
      isActive: true,
    },
  })

  // --------------------------------------------------------------
  // 2. PUBLISHERS  (Fondo Editorial Propio + Terceras)
  // --------------------------------------------------------------
  const ownPublisher = await db.publisher.upsert({
    where: { slug: 'editorial-horizonte' },
    update: {},
    create: {
      name: 'Editorial Horizonte',
      slug: 'editorial-horizonte',
      type: 'own',
      commissionRate: 0,
      royaltyRate: 0,
      contactName: 'Juan Damonte',
      contactEmail: 'contacto@editorialhorizonte.com',
      contactPhone: '+51 1 234 5678',
      isActive: true,
    },
  })

  const thirdParty1 = await db.publisher.upsert({
    where: { slug: 'libreria-sur-ediciones' },
    update: {},
    create: {
      name: 'Librería SUR Ediciones',
      slug: 'libreria-sur-ediciones',
      type: 'third_party',
      commissionRate: 30,
      royaltyRate: 0,
      contactEmail: 'ventas@libreriasur.com',
      isActive: true,
    },
  })

  const thirdParty2 = await db.publisher.upsert({
    where: { slug: 'animal-inverso' },
    update: {},
    create: {
      name: 'Animal Inverso',
      slug: 'animal-inverso',
      type: 'third_party',
      commissionRate: 25,
      royaltyRate: 0,
      contactEmail: 'info@animalinverso.com',
      isActive: true,
    },
  })

  const thirdParty3 = await db.publisher.upsert({
    where: { slug: 'mejorada-ediciones' },
    update: {},
    create: {
      name: 'Mejorada Ediciones',
      slug: 'mejorada-ediciones',
      type: 'third_party',
      commissionRate: 28,
      royaltyRate: 0,
      contactEmail: 'hola@mejoradaediciones.com',
      isActive: true,
    },
  })

  // --------------------------------------------------------------
  // 3. AUTHORS
  // --------------------------------------------------------------
  const authors = []
  const authorData = [
    { fullName: 'Juan Damonte', slug: 'juan-damonte', nationality: 'Peruana', biography: 'Poeta y editor peruano. Fundador de Editorial Horizonte. Su obra transita entre la crónica urbana y el ensayo lírico.' },
    { fullName: 'Cecilia Caballero', slug: 'cecilia-caballero', nationality: 'Peruana', biography: 'Narradora limeña. Su novela debut fue finalista del Premio Mario Vargas Llosa.' },
    { fullName: 'Luis Miró Quesada', slug: 'luis-miro-quesada', nationality: 'Peruana', biography: 'Ensayista. Especialista en literatura latinoamericana contemporánea.' },
    { fullName: 'Isabel Allende Llona', slug: 'isabel-allende-llona', nationality: 'Chilena', biography: 'Una de las voces más reconocidas de la literatura latinoamericana actual.' },
    { fullName: 'Roberto Bolaño', slug: 'roberto-bolano', nationality: 'Chilena', biography: 'Narrador y poeta. Referente de la nueva narrativa latinoamericana.' },
    { fullName: 'Valeria Mendoza', slug: 'valeria-mendoza', nationality: 'Argentina', biography: 'Poeta y traductora. Premio Casa de las Américas 2022.' },
    { fullName: 'Carlos Yushimito', slug: 'carlos-yushimito', nationality: 'Peruano-Japonés', biography: 'Narrador. Considerado uno de los mejores cuentistas peruanos de su generación.' },
    { fullName: 'Claudia Salazar Jiménez', slug: 'claudia-salazar-jimenez', nationality: 'Peruana', biography: 'Antologadora y novelista. Ganadora del Premio Las Américas 2016.' },
    { fullName: 'Diamela Eltit', slug: 'diamela-eltit', nationality: 'Chilena', biography: 'Narradora y ensayista. Referente de la literatura neo-vanguardista latinoamericana.' },
    { fullName: 'Augusto Rubio Acosta', slug: 'augusto-rubio-acosta', nationality: 'Peruana', biography: 'Poeta cusqueño. Su obra rescata la tradición oral andina.' },
  ]
  for (const a of authorData) {
    const author = await db.author.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    })
    authors.push(author)
  }

  // --------------------------------------------------------------
  // 4. CATEGORIES
  // --------------------------------------------------------------
  const categoryData = [
    { name: 'Narrativa', slug: 'narrativa', sortOrder: 1 },
    { name: 'Poesía', slug: 'poesia', sortOrder: 2 },
    { name: 'Ensayo', slug: 'ensayo', sortOrder: 3 },
    { name: 'Crónica', slug: 'cronica', sortOrder: 4 },
    { name: 'Cuento', slug: 'cuento', sortOrder: 5 },
    { name: 'Antología', slug: 'antologia', sortOrder: 6 },
    { name: 'Traducida', slug: 'traducida', sortOrder: 7 },
  ]
  const categories = []
  for (const c of categoryData) {
    const cat = await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })
    categories.push(cat)
  }

  // --------------------------------------------------------------
  // 5. WAREHOUSES  (Almacenes / Librerías aliadas)
  // --------------------------------------------------------------
  const warehouses = await Promise.all([
    db.warehouse.upsert({
      where: { code: 'CENTRAL' },
      update: {},
      create: {
        name: 'Almacén Central Editorial Horizonte',
        code: 'CENTRAL',
        type: 'warehouse',
        addressLine1: 'Av. La Mar 1234',
        city: 'Lima',
        state: 'Lima',
        country: 'Perú',
        postalCode: '15072',
        phone: '+51 1 234 5678',
        email: 'logistica@editorialhorizonte.com',
        managerName: 'Pedro Castillo',
        isActive: true,
      },
    }),
    db.warehouse.upsert({
      where: { code: 'SUR' },
      update: {},
      create: {
        name: 'Librería SUR',
        code: 'SUR',
        type: 'physical_store',
        addressLine1: 'Av. Larco 1107',
        city: 'Miraflores, Lima',
        state: 'Lima',
        country: 'Perú',
        phone: '+51 1 445 3210',
        email: 'hola@libreriasur.com',
        managerName: 'Ana Wiener',
        isActive: true,
      },
    }),
    db.warehouse.upsert({
      where: { code: 'VIR' },
      update: {},
      create: {
        name: 'El Virrey',
        code: 'VIR',
        type: 'physical_store',
        addressLine1: 'Av. Antonio Miró Quesada 167',
        city: 'San Isidro, Lima',
        state: 'Lima',
        country: 'Perú',
        phone: '+51 1 422 2222',
        email: 'contacto@elvirrey.com.pe',
        managerName: 'Felipe Vergara',
        isActive: true,
      },
    }),
    db.warehouse.upsert({
      where: { code: 'CRI' },
      update: {},
      create: {
        name: 'Crisol',
        code: 'CRI',
        type: 'physical_store',
        addressLine1: 'Av. Javier Prado 5195',
        city: 'Surco, Lima',
        state: 'Lima',
        country: 'Perú',
        phone: '+51 1 437 0000',
        email: 'servicio@crisol.com.pe',
        managerName: 'Rosa García',
        isActive: true,
      },
    }),
  ])

  // --------------------------------------------------------------
  // 6. BOOKS  (catálogo — 12 títulos)
  // --------------------------------------------------------------
  const booksData = [
    {
      isbn: '978-9972-1-0001-1',
      title: 'El horizonte de los días',
      slug: 'el-horizonte-de-los-dias',
      synopsis: 'Una colección de ensayos líricos que recorre los pequeños rituales cotidianos — el café matutino, el silencio del atardecer, la lectura nocturna — y los eleva a una meditación sobre el tiempo, la memoria y el oficio de escribir. Juan Damonte despliega una prosa precisa, casi minimalista, donde cada frase parece tallada a mano.',
      publisherSlug: 'editorial-horizonte',
      originType: 'own',
      publicationDate: new Date('2024-03-15'),
      pages: 184,
      language: 'Español',
      format: 'physical',
      weightGrams: 320,
      dimensions: '21 x 14 x 1.5 cm',
      edition: 'Primera edición',
      pricePen: 65.00,
      priceUsd: 18.00,
      cost: 18.00,
      isActive: true,
      isFeatured: true,
      isNew: true,
      authorSlugs: ['juan-damonte'],
      categorySlugs: ['ensayo', 'cronica'],
      coverColor: '#7c2d12',
    },
    {
      isbn: '978-9972-1-0002-8',
      title: 'Lima, ciudad que se escribe',
      slug: 'lima-ciudad-que-se-escribe',
      synopsis: 'Cecilia Caballero reconstruye la ciudad a través de los textos que la han narrado durante dos siglos. Desde Ricardo Palma hasta los cronistas contemporáneos, este ensayo cartografía los barrios, las voces y los silencios que hacen de Lima un palimpsesto literario imprescindible.',
      publisherSlug: 'editorial-horizonte',
      originType: 'own',
      publicationDate: new Date('2023-11-08'),
      pages: 256,
      language: 'Español',
      format: 'physical',
      weightGrams: 420,
      dimensions: '23 x 15 x 2 cm',
      edition: 'Primera edición',
      pricePen: 78.00,
      priceUsd: 22.00,
      cost: 22.00,
      isActive: true,
      isFeatured: true,
      isNew: false,
      authorSlugs: ['cecilia-caballero'],
      categorySlugs: ['ensayo', 'cronica'],
      coverColor: '#1e3a5f',
    },
    {
      isbn: '978-9972-1-0003-5',
      title: 'Cuaderno de la sierra',
      slug: 'cuaderno-de-la-sierra',
      synopsis: 'Augusto Rubio Acosta recoge quince años de viajes por los Andes peruanos en este cuaderno de bitácora poética. A través de estampas breves, diálogos con comuneros y apuntes etnográficos, el autor teje una cartografía emocional de la sierra que dialoga con la tradición de José María Arguedas.',
      publisherSlug: 'editorial-horizonte',
      originType: 'own',
      publicationDate: new Date('2024-01-20'),
      pages: 152,
      language: 'Español',
      format: 'physical',
      weightGrams: 280,
      dimensions: '20 x 13 x 1.2 cm',
      edition: 'Primera edición',
      pricePen: 58.00,
      priceUsd: 16.00,
      cost: 16.00,
      isActive: true,
      isFeatured: false,
      isNew: true,
      authorSlugs: ['augusto-rubio-acosta'],
      categorySlugs: ['poesia', 'cronica'],
      coverColor: '#4d7c0f',
    },
    {
      isbn: '978-9972-1-0004-2',
      title: 'Las grietas del espejo',
      slug: 'las-grietas-del-espejo',
      synopsis: 'Una novela fragmentaria sobre tres generaciones de mujeres en una familia limeña. Caballero desmonta los silencios heredados y los secretos familiares con una sensibilidad quirúrgica. Finalista del Premio Mario Vargas Llosa 2023.',
      publisherSlug: 'editorial-horizonte',
      originType: 'own',
      publicationDate: new Date('2023-05-12'),
      pages: 312,
      language: 'Español',
      format: 'physical',
      weightGrams: 480,
      dimensions: '24 x 16 x 2.5 cm',
      edition: 'Segunda edición corregida',
      pricePen: 89.00,
      priceUsd: 25.00,
      cost: 24.00,
      isActive: true,
      isFeatured: true,
      isNew: false,
      authorSlugs: ['cecilia-caballero'],
      categorySlugs: ['narrativa'],
      coverColor: '#831843',
    },
    {
      isbn: '978-9972-2-0005-9',
      title: 'Literatura y frontera',
      slug: 'literatura-y-frontera',
      synopsis: 'Luis Miró Quesada analiza cómo la noción de frontera ha atravesado la literatura latinoamericana desde el modernismo hasta el presente. Un ensayo imprescindible para comprender los desplazamientos geopolíticos y estéticos que han dado forma al canon continental.',
      publisherSlug: 'libreria-sur-ediciones',
      originType: 'third_party',
      publicationDate: new Date('2022-09-01'),
      pages: 224,
      language: 'Español',
      format: 'physical',
      weightGrams: 360,
      dimensions: '22 x 14 x 1.8 cm',
      edition: 'Primera edición',
      pricePen: 72.00,
      priceUsd: 20.00,
      cost: 32.00,
      isActive: true,
      isFeatured: false,
      isNew: false,
      authorSlugs: ['luis-miro-quesada'],
      categorySlugs: ['ensayo'],
      coverColor: '#0f766e',
    },
    {
      isbn: '978-9972-2-0006-6',
      title: 'La isla de los nombres rotos',
      slug: 'la-isla-de-los-nombres-rotos',
      synopsis: 'Una novela coral ambientada en una isla ficticia del Pacífico sur. Yushimito despliega su maestría del cuento extendido: personajes rotos, paisajes opresivos, una sintaxis que respira. Una de las novelas más ambiciosas de la narrativa peruana reciente.',
      publisherSlug: 'libreria-sur-ediciones',
      originType: 'third_party',
      publicationDate: new Date('2024-02-14'),
      pages: 280,
      language: 'Español',
      format: 'physical',
      weightGrams: 440,
      dimensions: '23 x 15 x 2.2 cm',
      edition: 'Primera edición',
      pricePen: 85.00,
      priceUsd: 24.00,
      cost: 38.00,
      isActive: true,
      isFeatured: true,
      isNew: true,
      authorSlugs: ['carlos-yushimito'],
      categorySlugs: ['narrativa', 'cuento'],
      coverColor: '#1f2937',
    },
    {
      isbn: '978-9972-3-0007-3',
      title: 'Sangre en el ojo',
      slug: 'sangre-en-el-ojo',
      synopsis: 'Una de las novelas más celebradas de la nueva narrativa chilena. Eltit construye un relato visceral sobre el cuerpo, la maternidad y la violencia política. Edición conmemorativa con prólogo de la autora.',
      publisherSlug: 'animal-inverso',
      originType: 'third_party',
      publicationDate: new Date('2020-08-15'),
      pages: 198,
      language: 'Español',
      format: 'physical',
      weightGrams: 320,
      dimensions: '21 x 14 x 1.4 cm',
      edition: 'Edición conmemorativa',
      pricePen: 68.00,
      priceUsd: 19.00,
      cost: 30.00,
      isActive: true,
      isFeatured: false,
      isNew: false,
      authorSlugs: ['diamela-eltit'],
      categorySlugs: ['narrativa'],
      coverColor: '#7f1d1d',
    },
    {
      isbn: '978-9972-3-0008-0',
      title: 'Voces del Pacífico',
      slug: 'voces-del-pacifico',
      synopsis: 'Claudia Salazar Jiménez reúne en esta antología a 24 poetas del Pacífico latinoamericano. Un mapa indispensable de la lírica contemporánea que dialoga con el mar como símbolo, frontera y memoria.',
      publisherSlug: 'animal-inverso',
      originType: 'third_party',
      publicationDate: new Date('2023-04-22'),
      pages: 340,
      language: 'Español',
      format: 'physical',
      weightGrams: 520,
      dimensions: '24 x 17 x 2.8 cm',
      edition: 'Primera edición',
      pricePen: 95.00,
      priceUsd: 27.00,
      cost: 42.00,
      isActive: true,
      isFeatured: false,
      isNew: false,
      authorSlugs: ['claudia-salazar-jimenez'],
      categorySlugs: ['poesia', 'antologia'],
      coverColor: '#155e75',
    },
    {
      isbn: '978-9972-1-0009-7',
      title: 'El oficio invisible',
      slug: 'el-oficio-invisible',
      synopsis: 'Juan Damonte reflexiona sobre el trabajo editorial como un acto de cuidado. Desde la mesa de corrección hasta la elección de la tipografía, este libro defiende la artesanía en tiempos de producción industrial del libro.',
      publisherSlug: 'editorial-horizonte',
      originType: 'own',
      publicationDate: new Date('2023-09-10'),
      pages: 168,
      language: 'Español',
      format: 'physical',
      weightGrams: 300,
      dimensions: '20 x 13 x 1.3 cm',
      edition: 'Primera edición',
      pricePen: 62.00,
      priceUsd: 17.00,
      cost: 17.00,
      isActive: true,
      isFeatured: false,
      isNew: false,
      authorSlugs: ['juan-damonte'],
      categorySlugs: ['ensayo'],
      coverColor: '#422006',
    },
    {
      isbn: '978-9972-1-0010-3',
      title: 'Río de palabras',
      slug: 'rio-de-palabras',
      synopsis: 'Valeria Mendoza despliega en este poemario una voz fluvial: el agua como metáfora del deseo, la pérdida y el retorno. Uno de los libros de poesía más celebrados de la última década en Latinoamérica.',
      publisherSlug: 'editorial-horizonte',
      originType: 'own',
      publicationDate: new Date('2024-04-05'),
      pages: 96,
      language: 'Español',
      format: 'physical',
      weightGrams: 200,
      dimensions: '19 x 12 x 0.9 cm',
      edition: 'Primera edición',
      pricePen: 45.00,
      priceUsd: 13.00,
      cost: 13.00,
      isActive: true,
      isFeatured: true,
      isNew: true,
      authorSlugs: ['valeria-mendoza'],
      categorySlugs: ['poesia'],
      coverColor: '#075985',
    },
    {
      isbn: '978-9972-4-0011-0',
      title: 'Los senderos que se cruzan',
      slug: 'los-senderos-que-se-cruzan',
      synopsis: 'Una colección de cuentos donde Yushimito vuelve a su Lima natal para rastrear vidas marginales con una compasión quirúrgica. Relatos breves, casi cinematográficos, donde lo extraordinario se filtra en lo cotidiano.',
      publisherSlug: 'mejorada-ediciones',
      originType: 'third_party',
      publicationDate: new Date('2023-12-01'),
      pages: 210,
      language: 'Español',
      format: 'physical',
      weightGrams: 340,
      dimensions: '22 x 14 x 1.6 cm',
      edition: 'Primera edición',
      pricePen: 75.00,
      priceUsd: 21.00,
      cost: 33.00,
      isActive: true,
      isFeatured: false,
      isNew: false,
      authorSlugs: ['carlos-yushimito'],
      categorySlugs: ['cuento', 'narrativa'],
      coverColor: '#312e81',
    },
    {
      isbn: '978-9972-4-0012-7',
      title: 'Ejercicios de silencio',
      slug: 'ejercicios-de-silencio',
      synopsis: 'Augusto Rubio Acosta propone una poética del silencio: poemas breves, casi haikus, que detienen el aliento y devuelven al lector al centro de sí mismo. Un libro para leer despacio, preferiblemente al amanecer.',
      publisherSlug: 'mejorada-ediciones',
      originType: 'third_party',
      publicationDate: new Date('2024-05-18'),
      pages: 88,
      language: 'Español',
      format: 'physical',
      weightGrams: 180,
      dimensions: '18 x 11 x 0.8 cm',
      edition: 'Primera edición',
      pricePen: 42.00,
      priceUsd: 12.00,
      cost: 19.00,
      isActive: true,
      isFeatured: false,
      isNew: true,
      authorSlugs: ['augusto-rubio-acosta'],
      categorySlugs: ['poesia'],
      coverColor: '#365314',
    },
  ]

  const createdBooks = []
  for (const b of booksData) {
    const publisher = await db.publisher.findUnique({ where: { slug: b.publisherSlug } })
    if (!publisher) continue

    const book = await db.book.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        isbn: b.isbn,
        title: b.title,
        slug: b.slug,
        synopsis: b.synopsis,
        coverUrl: null, // se generará visualmente en UI
        publisherId: publisher.id,
        originType: b.originType,
        publicationDate: b.publicationDate,
        pages: b.pages,
        language: b.language,
        format: b.format,
        weightGrams: b.weightGrams,
        dimensions: b.dimensions,
        edition: b.edition,
        pricePen: b.pricePen,
        priceUsd: b.priceUsd,
        cost: b.cost,
        isActive: b.isActive,
        isFeatured: b.isFeatured,
        isNew: b.isNew,
        // guardamos el color de portada como metaTitle temporal
        metaTitle: b.coverColor,
      },
    })

    // Asociar autores
    for (const aSlug of b.authorSlugs) {
      const author = await db.author.findUnique({ where: { slug: aSlug } })
      if (author) {
        await db.bookAuthor.upsert({
          where: { bookId_authorId: { bookId: book.id, authorId: author.id } },
          update: {},
          create: { bookId: book.id, authorId: author.id },
        })
      }
    }

    // Asociar categorías
    for (const cSlug of b.categorySlugs) {
      const cat = await db.category.findUnique({ where: { slug: cSlug } })
      if (cat) {
        await db.bookCategory.upsert({
          where: { bookId_categoryId: { bookId: book.id, categoryId: cat.id } },
          update: {},
          create: { bookId: book.id, categoryId: cat.id },
        })
      }
    }

    createdBooks.push({ ...book, coverColor: b.coverColor })
  }

  // --------------------------------------------------------------
  // 7. INVENTORY  (stock por libro × almacén)
  // --------------------------------------------------------------
  for (const book of createdBooks) {
    for (const wh of warehouses) {
      const existing = await db.inventory.findUnique({
        where: { bookId_warehouseId: { bookId: book.id, warehouseId: wh.id } },
      })
      if (existing) continue

      let stockAvailable = 0
      let stockConsigned = 0
      let minThreshold = 3

      if (wh.code === 'CENTRAL') {
        stockAvailable = 40 + Math.floor(Math.random() * 30)
      } else if (wh.code === 'SUR') {
        stockAvailable = 6 + Math.floor(Math.random() * 10)
        stockConsigned = 4 + Math.floor(Math.random() * 6)
      } else if (wh.code === 'VIR') {
        stockAvailable = 4 + Math.floor(Math.random() * 8)
        stockConsigned = 3 + Math.floor(Math.random() * 5)
      } else if (wh.code === 'CRI') {
        stockAvailable = 5 + Math.floor(Math.random() * 8)
        stockConsigned = 3 + Math.floor(Math.random() * 4)
      }

      await db.inventory.create({
        data: {
          bookId: book.id,
          warehouseId: wh.id,
          stockAvailable,
          stockConsigned,
          stockReserved: 0,
          minThreshold,
          maxCapacity: wh.code === 'CENTRAL' ? 200 : 50,
          locationCode: wh.code === 'CENTRAL' ? `P${Math.floor(Math.random() * 5) + 1}-E${Math.floor(Math.random() * 8) + 1}` : null,
        },
      })
    }
  }

  // --------------------------------------------------------------
  // 8. CONSIGNMENTS  (algunas consignaciones activas en SUR)
  // --------------------------------------------------------------
  const surWarehouse = warehouses.find(w => w.code === 'SUR')!
  const virWarehouse = warehouses.find(w => w.code === 'VIR')!
  const featuredBooks = createdBooks.slice(0, 6)
  for (const book of featuredBooks) {
    const publisher = await db.publisher.findUnique({ where: { id: book.publisherId ?? '' } })
    if (!publisher) continue

    const quantity = 4 + Math.floor(Math.random() * 6)
    const commissionRate = publisher.type === 'third_party' ? publisher.commissionRate : 0

    await db.consignment.create({
      data: {
        consignmentNumber: `CON-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
        bookId: book.id,
        warehouseId: surWarehouse.id,
        publisherId: publisher.id,
        quantityConsigned: quantity,
        quantitySold: Math.floor(Math.random() * (quantity - 1)),
        quantityReturned: 0,
        status: 'active',
        commissionRate,
        royaltyRate: 0,
        agreementDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        performedById: admin.id,
      },
    })
  }

  // --------------------------------------------------------------
  // 9. ORDERS  (algunas ventas de muestra para el dashboard)
  // --------------------------------------------------------------
  const now = Date.now()
  for (let i = 0; i < 12; i++) {
    const book = createdBooks[Math.floor(Math.random() * createdBooks.length)]
    const wh = warehouses[Math.floor(Math.random() * warehouses.length)]
    const qty = 1 + Math.floor(Math.random() * 3)
    const total = book.pricePen * qty
    const daysAgo = Math.floor(Math.random() * 30)
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000)
    const statuses = ['delivered', 'delivered', 'delivered', 'shipped', 'processing', 'paid']
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    const customer = await db.customer.upsert({
      where: { email: `cliente${i}@example.com` },
      update: { totalOrders: { increment: 1 }, totalSpent: { increment: total } },
      create: {
        email: `cliente${i}@example.com`,
        fullName: `Cliente Demo ${i + 1}`,
        phone: `+51 999 ${100000 + i}`,
        marketingOptIn: i % 2 === 0,
        totalOrders: 1,
        totalSpent: total,
      },
    })

    const order = await db.order.create({
      data: {
        orderNumber: `EH-${createdAt.getFullYear()}${String(createdAt.getMonth() + 1).padStart(2, '0')}${String(createdAt.getDate()).padStart(2, '0')}-${String(i + 1).padStart(5, '0')}`,
        customerId: customer.id,
        customerEmail: customer.email,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        status,
        currency: 'PEN',
        subtotal: total,
        discountAmount: 0,
        shippingAmount: total > 150 ? 0 : 12,
        taxAmount: 0,
        totalAmount: total + (total > 150 ? 0 : 12),
        warehouseId: wh.id,
        paymentProvider: ['mercadopago', 'paypal', 'izipay'][i % 3],
        paymentStatus: status === 'delivered' || status === 'shipped' ? 'completed' : 'pending',
        paidAt: status === 'delivered' || status === 'shipped' ? createdAt : null,
        createdAt,
        updatedAt: createdAt,
      },
    })

    await db.orderItem.create({
      data: {
        orderId: order.id,
        bookId: book.id,
        warehouseId: wh.id,
        quantity: qty,
        unitPrice: book.pricePen,
        lineTotal: total,
        bookTitleSnapshot: book.title,
        originTypeSnapshot: book.originType,
        commissionRateSnapshot: 0,
        commissionAmount: 0,
        royaltyAmount: 0,
        stockDeducted: status !== 'pending' && status !== 'cancelled',
        deductedAt: status !== 'pending' && status !== 'cancelled' ? createdAt : null,
        createdAt,
      },
    })
  }

  // --------------------------------------------------------------
  // 10. SETTINGS
  // --------------------------------------------------------------
  await db.setting.upsert({
    where: { key: 'site_name' },
    update: {},
    create: { key: 'site_name', value: JSON.stringify('Editorial Horizonte'), description: 'Nombre del sitio' },
  })
  await db.setting.upsert({
    where: { key: 'currency_default' },
    update: {},
    create: { key: 'currency_default', value: JSON.stringify('PEN'), description: 'Moneda por defecto' },
  })
  await db.setting.upsert({
    where: { key: 'shipping_free_threshold' },
    update: {},
    create: { key: 'shipping_free_threshold', value: JSON.stringify(150), description: 'Envío gratis a partir de S/150' },
  })
  await db.setting.upsert({
    where: { key: 'developer_credits' },
    update: {},
    create: { key: 'developer_credits', value: JSON.stringify('Diseño y desarrollo por fastpagepro.com'), description: 'INMUTABLE — créditos del desarrollador' },
  })
  await db.setting.upsert({
    where: { key: 'contact_email' },
    update: {},
    create: { key: 'contact_email', value: JSON.stringify('contacto@editorialhorizonte.com'), description: 'Email público' },
  })
  await db.setting.upsert({
    where: { key: 'social_instagram' },
    update: {},
    create: { key: 'social_instagram', value: JSON.stringify('@editorialhorizonte'), description: 'Instagram' },
  })
  await db.setting.upsert({
    where: { key: 'admin_password' },
    update: {},
    create: { key: 'admin_password', value: JSON.stringify('horizonte2024'), description: 'Password de acceso admin (demo)' },
  })

  console.log('✅ Seed completado.')
  console.log(`   - Profiles: 2`)
  console.log(`   - Publishers: 4 (1 own + 3 third_party)`)
  console.log(`   - Authors: ${authors.length}`)
  console.log(`   - Categories: ${categories.length}`)
  console.log(`   - Warehouses: ${warehouses.length}`)
  console.log(`   - Books: ${createdBooks.length}`)
  console.log(`   - Inventory: ${createdBooks.length * warehouses.length} registros`)
  console.log(`   - Consignments: ${featuredBooks.length}`)
  console.log(`   - Orders de muestra: 12`)
  console.log('   - Admin login: admin@editorialhorizonte.com / horizonte2024')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
