import os
import re
import json
import hashlib
from parse_all_catalogo import books
from test_clean_classification import classify_book

def slugify(text):
    text = text.lower()
    for src, dst in [('á','a'), ('é','e'), ('í','i'), ('ó','o'), ('ú','u'), ('ñ','n')]:
        text = text.replace(src, dst)
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
    return text[:90]

def parse_price(price_str):
    if not price_str or price_str == 'N/A':
        return 35.0
    m = re.search(r'(\d+(?:\.\d+)?)', price_str.replace(',', '.'))
    if m:
        return float(m.group(1))
    return 35.0

def parse_pages(formato_str):
    if not formato_str:
        return 160
    m = re.search(r'(\d+)\s*p[aá]g', formato_str, re.I)
    if m:
        return int(m.group(1))
    return 160

# Specific cover overrides for exact matches
cover_map = {
    1: '/covers/cara_tula_yawar_fiesta-01.webp', # Yawar Fiesta
    2: '/covers/Caratula_horizonte_Mesa_de_trabajo_1.webp', # Los ríos profundos
    3: '/covers/cara_tula_EL_SEXTO15ed_2024-01.webp', # El Sexto
    4: '/covers/carátula_TODAS_LAS_SANGRES_2026_Mesa_de_trabajo_1.webp', # Todas las sangres
    5: '/covers/Carátula_zorros_2024_Josue-01.webp', # El zorro de arriba...
    6: '/covers/caratula_FINAL-01.webp', # Yahuar huillay
    7: '/covers/Caratula_grande3ra_edicion_2026-01.webp', # Relatos completos [NOVEDAD]
    8: '/covers/caratula-01.webp', # Canto kechwa
    9: '/covers/caratula-orig.webp', # Katatay
    10: '/covers/11528.webp', # Indios, mestizos y señores
    11: '/covers/Caratula_Dioses_y_hombres_Mesa_de_trabajo_1.webp', # Dioses y hombres de Huarochirí
    12: '/covers/Caratula_nuevo_formato_impresion_21-01.webp', # Obra antropológica y cultural
    13: '/covers/CARATULA_9_de_enero_Mesa_de_trabajo_1.webp', # Escritos sobre el Cuzco [NOVEDAD]
    14: '/covers/cultura_andina102.webp', # Cultura andina y forma novelesca
    15: None, # Vigencia y universalidad (mockup)
    16: '/covers/Caratula_Leamos_juntos_Mesa_de_trabajo_1.webp', # Leamos juntos el Manuscrito...
    17: '/covers/caratula_Reforma-01.webp', # José María Arguedas y la reforma agraria [NOVEDAD]
    18: '/covers/CARÁTULA_AGUA_reimp_2025_sin_solapas-01.webp', # Agua, Warma kuyay... (Plan Lector)
    19: '/covers/caratula_Seis_aprox_definitiva_19_septiembre-01.webp', # Warma Kuyay, Agua... (Plan Lector)
    20: None, # España aparta de mí este cáliz (mockup editorial neutro)
    21: '/covers/caratula_tomo_2_nueva_Mesa_de_trabajo_1.webp', # Literatura quechua clásica (tomo 1)
    22: '/covers/cronistas_convento009.webp', # Cronistas de convento (tomo 9)
    23: '/covers/Cuyes,_camiones_y_cuentos_en_los_andes013.webp', # Cuyes, camiones...
    24: '/covers/Alpacas_y_cuyes_en_la_etnografía_andina_001.webp', # Parentesco y matrimonio...
    25: None, # Parentesco, matrimonio y familia en Puno
    26: None, # La cultura expresiva puneña
    27: None, # Sympathy
    28: '/covers/CARATULA_FINAL_LOARTE-01.webp', # Agustina. El norte de mi amor
    29: '/covers/caratula_Chucuito_Mesa_de_trabajo_1.webp', # Chucuito. Esta es la historia de Nicolò
    30: '/covers/CARÁTULA_EL_MAPA_Y_LA_ESPADA_11_febrero_2026-01.webp', # El mapa y la espada
    31: '/covers/Caratula_Querido_camarada_Mao_10_julio_2026.webp', # Querido camarada Mao [NOVEDAD]
    32: None, # Los salvajes del Sur
    33: None, # La poética chanka
    34: '/covers/Caratula_Comentarios_irreales_Mesa_de_trabajo_1.webp', # Comentarios irreales
    35: None, # Evanescencia
    36: None, # El poema multidimensional
    37: None, # El Laboratorio de la Vanguardia
    38: '/covers/El_demonio_andino.webp', # El demonio andino
    39: None, # Algo de él queda
    40: '/covers/Caratula_-_La_retorica_final-01.webp', # La retórica neobarroca
    41: None, # James Joyce
    42: '/covers/diez_claves106.webp', # Diez claves del éxito
    43: None, # La crisis del sistema imperial [NOVEDAD]
    44: '/covers/Caratula_-_Periodizacion_Quijano_-01.webp', # Periodización Quijano
    45: '/covers/Dramatización_y_religiosidad_cultural043.webp', # Dramatización y religiosidad
    46: '/covers/Caratula_MINERIA_COMUNIDADES.webp', # Minería. comunidades
    47: '/covers/caratula_Rondas_campesinas_Mesa_de_trabajo_1.webp', # Rondas campesinas
    48: '/covers/CARÁTULA_EL_TURISMO-01.webp', # El turismo [NOVEDAD]
    49: None, # La anarquía inmanentista
    50: '/covers/Buscando_un_inca.webp', # Buscando un inca
    51: '/covers/CRONISTAS_INDIOS_Y_MESTIZOS_III_EL_INCA_GARCILASO_DE_LA_VEGA_656.webp', # Coros mestizos
    52: '/covers/CARATULA_4TA_EDICIÓN_GUAMAN_POMA_Mesa_de_trabajo_1.webp', # Guaman Poma
    53: None, # Avenida Arequipa
    54: None, # La oligarquía peruana
    55: '/covers/boceto_caratula_Mesa_de_trabajo_1.webp', # Perú volver a empezar [NOVEDAD]
    56: '/covers/Amauta_caratula_16_octubre_Mesa_de_trabajo_1.webp', # Amauta. Cien años [NOVEDAD]
    57: None, # Recuperando nuestra memoria [NOVEDAD]
    58: '/covers/Caratula_boceto_Mesa_de_trabajo_1-01.webp', # El otro Dimas [NOVEDAD]
    59: None, # Pepe Villalobos
    60: '/covers/Caratula_F___Resistir_el_paso_del_tiempo_Mesa_de_trabajo_1.webp', # Resistir el paso del tiempo
    61: '/covers/Caratula_Textil_Mujeres_de_Poder_Horizonte-01.webp', # Textil: Mujeres de poder
    62: None, # Tejiendo la identidad
    63: None, # Las dos mitades de Rafael Chanchari
    64: '/covers/Caratula_Imaginario_Shawi-01.webp', # Imaginario Shawi
    65: '/covers/DE_SERES_DIVINOS.webp', # De Seres Divinos
    66: '/covers/CARÁTULA_mujer_ashaninka_Mesa_de_trabajo_1.webp', # La mujer ashaninka
    67: '/covers/Caratula_Memorias_antropologa-01.webp', # Memorias de una antropóloga
    68: '/covers/Caratula_Contacto_linguistico-01-01.webp', # Contacto lingüístico
    69: None, # Los ashaninka: un pueblo tras el bosque
    70: '/covers/caratula_el_rey-01.webp', # El rey de la montaña
    71: '/covers/dos_cuentos-01.webp', # Dos cuentos de amor infantil [NOVEDAD]
    72: None, # La abeja haragana
    73: None, # Picaflor y el niño Inti
    74: '/covers/caratula_Abrazando_el_ahora___Horizonte_c-02.webp', # Abrazando el ahora
    75: '/covers/Carátula_Influencers_22_JULIO-01.webp', # Influencers de verdad [NOVEDAD]
    76: None, # Tante parole
    77: None, # Io sono Dante
}

# Authors pool
authors_dict = {}
def get_or_create_author(name):
    clean = name.strip()
    # remove prefix like 'Autores: ' if any
    clean = re.sub(r'^(?:autor(?:es|as|a)?|compilador(?:es|a)?|editor(?:es|a)?):\s*', '', clean, flags=re.I).strip()
    if clean not in authors_dict:
        auth_id = f"aut_{hashlib.md5(clean.encode()).hexdigest()[:16]}"
        authors_dict[clean] = {
            "id": auth_id,
            "name": clean,
            "bio": f"Autor/a e investigador/a publicado por Editorial Horizonte.",
            "nationality": "Peruana",
            "createdAt": "2026-01-01T00:00:00.000Z",
            "updatedAt": "2026-01-01T00:00:00.000Z"
        }
    return authors_dict[clean]["id"]

# Categories pool
categories = [
  {
    "id": "cat_arguedas",
    "name": "José María Arguedas",
    "slug": "jose-maria-arguedas",
    "description": "Obras completas, narrativa, poesía, ensayos y estudios críticos de José María Arguedas.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_vallejo",
    "name": "César Vallejo",
    "slug": "cesar-vallejo",
    "description": "Poesía, narrativa y estudios críticos en torno a César Vallejo.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_carrillo",
    "name": "Francisco Carrillo",
    "slug": "francisco-carrillo",
    "description": "Enciclopedia histórica de la literatura peruana.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_bolton",
    "name": "Ralph Bolton",
    "slug": "ralph-bolton",
    "description": "Estudios antropológicos y etnografía clásica en el Altiplano peruano.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_narrativa",
    "name": "Narrativa Peruana",
    "slug": "narrativa-peruana",
    "description": "Novela, cuento y prosa contemporánea y clásica.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_poesia",
    "name": "Poesía",
    "slug": "poesia",
    "description": "Poemarios de autores peruanos y universales.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_ensayo",
    "name": "Ensayo y Crítica Literaria",
    "slug": "ensayo-y-critica",
    "description": "Análisis literario, estética y crítica cultural.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_ciencias_sociales",
    "name": "Ciencias Sociales e Historia",
    "slug": "ciencias-sociales-historia",
    "description": "Antropología, sociología, historia, política y economía.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_arte_cultura",
    "name": "Arte y Cultura",
    "slug": "arte-y-cultura",
    "description": "Danza, artes visuales, textiles y expresiones culturales del Perú.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_amazonia",
    "name": "Amazonía y Pueblos Originarios",
    "slug": "amazonia-pueblos-originarios",
    "description": "Etnografía, lenguas originarias y mitología amazónica y andina.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_infanto_juvenil",
    "name": "Infanto-Juvenil y Plan Lector",
    "slug": "infanto-juvenil",
    "description": "Cuentos ilustrados, clásicos adaptados y literatura formativa.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_idiomas",
    "name": "Idiomas y Lingüística",
    "slug": "idiomas-linguistica",
    "description": "Cuadernos de aprendizaje, contacto lingüístico y lenguas.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "cat_miscelanea",
    "name": "Miscelánea y Desarrollo Personal",
    "slug": "miscelanea",
    "description": "Obras de divulgación, testimonios y desarrollo.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]

col_to_cat = {
    'cjma': 'cat_arguedas',
    'ccv': 'cat_vallejo',
    'cfc': 'cat_carrillo',
    'crb': 'cat_bolton',
    'cn': 'cat_narrativa',
    'cp': 'cat_poesia',
    'ce': 'cat_ensayo', # or specific by series
    'cij': 'cat_infanto_juvenil',
    'cm': 'cat_miscelanea',
    'ci': 'cat_idiomas'
}

publishers = [
  {
    "id": "pub_horizonte",
    "name": "Editorial Horizonte",
    "country": "Perú",
    "website": "https://horizontelibros.com",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "pub_papel_de_viento",
    "name": "Papel de Viento",
    "country": "Perú",
    "website": "https://horizontelibros.com",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]

warehouses = [
  {
    "id": "wh_san_miguel",
    "name": "Almacén Central San Miguel",
    "slug": "san-miguel-central",
    "address": "San Miguel, Lima",
    "city": "Lima",
    "phone": "+51 955 637 859",
    "contactName": "Editorial Horizonte",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]

parsed_books = []
book_authors = []
book_categories = []
inventory = []

seen_slugs = {}

for b in books:
    idx = b['index']
    title = b['title']
    fields = b['fields']
    
    # Author
    author_name = fields.get('autor') or fields.get('autora') or fields.get('autores') or fields.get('compilador') or fields.get('compiladora') or 'Editorial Horizonte'
    # Clean author if it contains Editora note
    if 'editora:' in author_name.lower():
        author_name = re.sub(r'Editora:.*', '', author_name, flags=re.I).strip()
    
    author_id = get_or_create_author(author_name)
    
    # Classify
    col_id, series_name = classify_book(idx, title, fields.get('colección', ''))
    
    # Unique slug
    base_slug = slugify(title)
    if base_slug in seen_slugs:
        seen_slugs[base_slug] += 1
        book_slug = f"{base_slug}-{seen_slugs[base_slug]}"
    else:
        seen_slugs[base_slug] = 1
        book_slug = base_slug
        
    book_id = f"bk_{hashlib.md5(f'{idx}_{title}'.encode()).hexdigest()[:16]}"
    
    price = parse_price(fields.get('precio de venta al público'))
    cost_price = round(price * 0.4, 2)
    
    formato = fields.get('formato', '')
    pages = parse_pages(formato)
    
    # Clean ISBN (strip whitespace, trailing dashes)
    isbn = fields.get('isbn', '').strip().strip('-').strip()
    if not isbn or isbn == '-':
        isbn = None
        
    synopsis = fields.get('reseña', '').strip()
    if not synopsis:
        synopsis = f"Obra fundamental del catálogo editorial de {author_name}, publicada en cuidadas ediciones para preservar el pensamiento crítico y la memoria cultural peruana."
        
    thematic = fields.get('clasificación temática') or fields.get('clasificacion tematica')
    audience = fields.get('público objetivo') or fields.get('publico objetivo')
    related = fields.get('interesar') or fields.get('también te puede interesar') or fields.get('tambien te puede interesar')
    if related:
        related = re.sub(r'^(?:también te puede interesar|tambien te puede interesar):\s*', '', related, flags=re.I).strip()
        
    is_new = b['isNew']
    
    # Cover
    cover_url = cover_map.get(idx)
    
    # Category selection
    cat_id = col_to_cat[col_id]
    if col_id == 'ce':
        if 'ciencias sociales' in series_name.lower():
            cat_id = 'cat_ciencias_sociales'
        elif 'arte y cultura' in series_name.lower():
            cat_id = 'cat_arte_cultura'
        elif 'amazonía' in series_name.lower() or 'amazonia' in series_name.lower():
            cat_id = 'cat_amazonia'
        else:
            cat_id = 'cat_ensayo'
            
    book_entry = {
        "id": book_id,
        "title": title,
        "slug": book_slug,
        "isbn": isbn,
        "synopsis": synopsis,
        "pages": pages,
        "language": "castellano",
        "publicationYear": 2024 if is_new else 2021,
        "coverUrl": cover_url,
        "price": price,
        "costPrice": cost_price,
        "weightKg": round(pages * 0.002 + 0.1, 2),
        "isActive": True,
        "isFeatured": idx in [1, 2, 4, 7, 10, 20, 23, 31, 50, 56], # featured classics & major novelties
        "isNew": is_new,
        "originType": "PROPIO",
        "publisherId": "pub_horizonte",
        "formatDescription": formato if formato else f"{pages} páginas, tapa blanda",
        "thematic": thematic,
        "audience": audience,
        "relatedTitles": related,
        "series": series_name,
        "collectionId": col_id,
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-01-01T00:00:00.000Z"
    }
    
    parsed_books.append(book_entry)
    
    book_authors.append({
        "bookId": book_id,
        "authorId": author_id,
        "order": 0
    })
    
    book_categories.append({
        "bookId": book_id,
        "categoryId": cat_id
    })
    
    # Also add specific sub-category for CJMA, etc.
    if col_id == 'cjma' and cat_id != 'cat_arguedas':
        book_categories.append({
            "bookId": book_id,
            "categoryId": 'cat_arguedas'
        })
        
    inventory.append({
        "id": f"inv_{book_id}_c",
        "bookId": book_id,
        "warehouseId": "wh_san_miguel",
        "stockDisponible": 35,
        "stockConsignado": 0,
        "stockMinimo": 5,
        "stockReposicion": 20,
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-01-01T00:00:00.000Z"
    })

final_data = {
    "authors": list(authors_dict.values()),
    "categories": categories,
    "publishers": publishers,
    "warehouses": warehouses,
    "bookAuthors": book_authors,
    "bookCategories": book_categories,
    "books": parsed_books,
    "inventory": inventory,
    "orders": [],
    "orderItems": [],
    "auditLog": []
}

with open('src/data/seed-data.json', 'w', encoding='utf-8') as f:
    json.dump(final_data, f, indent=2, ensure_ascii=False)

print(f"Generated seed-data.json successfully with {len(parsed_books)} books and {len(authors_dict)} authors.")
