import re
import json
import hashlib
from parse_all_catalogo import books

def slugify(text):
    text = text.lower()
    for src, dst in [('á','a'), ('é','e'), ('í','i'), ('ó','o'), ('ú','u'), ('ñ','n')]:
        text = text.replace(src, dst)
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
    return text[:80]

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

# Check classification of each of the 77 books
print("Verifying all 77 books classification:")
for b in books:
    idx = b['index']
    t = b['title']
    raw_col = b['fields'].get('colección', '')
    
    # Determine official collection ID and series
    col_id = None
    series_name = None
    
    # Check collection
    if 'josé maría arguedas' in raw_col.lower() or 'arguedas' in raw_col.lower():
        col_id = 'cjma'
        if 'narrativa' in raw_col.lower():
            series_name = 'CJMA - Serie Narrativa'
        elif 'poesía' in raw_col.lower():
            series_name = 'CJMA - Serie Poesía'
        elif 'ensayo' in raw_col.lower():
            series_name = 'CJMA - Serie Ensayo'
        elif 'estudios críticos' in raw_col.lower() or 'estudios criticos' in raw_col.lower():
            # Specific client correction from Revisiones docx:
            # "y el título de Leamos el Manuscrito… que va en CJMA Ensayo, no acá"
            if 'leamos' in t.lower():
                series_name = 'CJMA - Serie Ensayo'
            else:
                series_name = 'CJMA - Serie Estudios Críticos'
        elif 'plan lector' in raw_col.lower():
            series_name = 'Plan Lector'
        else:
            series_name = 'CJMA - Serie Narrativa'
    elif 'césar vallejo' in raw_col.lower() or 'vallejo' in raw_col.lower():
        col_id = 'ccv'
        series_name = 'CCV - Serie Poesía'
    elif 'carrillo' in raw_col.lower():
        col_id = 'cfc'
        series_name = 'CFC - Serie Enciclopedia Histórica de la Literatura Peruana'
    elif 'bolton' in raw_col.lower():
        col_id = 'crb'
        if 'etnografía clásica' in raw_col.lower() or idx in [25, 26]:
            series_name = 'CRB - Serie Etnografía Clásica en el Altiplano Peruano 1940-1980'
        else:
            series_name = 'CRB - Serie Estudios Etnográficos'
    elif 'narrativa' in raw_col.lower():
        col_id = 'cn'
        if 'clásicos' in raw_col.lower() or 'clasicos' in raw_col.lower():
            series_name = 'CN - Serie Clásicos'
        else:
            series_name = 'CN - Serie Contemporáneos'
    elif raw_col.strip().lower() == 'poesía' or raw_col.strip().lower() == 'poesia':
        col_id = 'cp'
        series_name = 'Colección Poesía (CP)'
    elif 'ensayo' in raw_col.lower():
        col_id = 'ce'
        if 'crítica literaria' in raw_col.lower() or 'critica literaria' in raw_col.lower():
            series_name = 'CE - Serie Crítica Literaria'
        elif 'ciencias sociales' in raw_col.lower():
            series_name = 'CE - Serie Ciencias Sociales'
        elif 'arte y cultura' in raw_col.lower():
            series_name = 'CE - Serie Arte y Cultura'
        elif 'amazonía' in raw_col.lower() or 'amazonia' in raw_col.lower():
            series_name = 'CE - Serie Amazonía'
        else:
            # Fallback based on index / context
            if idx == 45: # Dramatización y religiosidad cultural
                series_name = 'CE - Serie Arte y Cultura'
            else:
                series_name = 'CE - Serie Ciencias Sociales'
    elif 'infanto' in raw_col.lower() or 'juvenil' in raw_col.lower():
        col_id = 'cij'
        series_name = 'Colección Infanto-Juvenil (CIJ)'
    elif 'miscelánea' in raw_col.lower() or 'miscelanea' in raw_col.lower():
        col_id = 'cm'
        series_name = 'Colección Miscelánea (CM)'
    elif 'idiomas' in raw_col.lower():
        col_id = 'ci'
        series_name = 'Colección Idiomas (CI)'
    else:
        # Check title
        if 'dramatización' in t.lower():
            col_id = 'ce'
            series_name = 'CE - Serie Arte y Cultura'
        else:
            print(f"UNKNOWN: {idx}. {t} (raw: {raw_col})")
            
    print(f"[{idx:2d}] {col_id.upper()} | {series_name} | {t[:35]}")
