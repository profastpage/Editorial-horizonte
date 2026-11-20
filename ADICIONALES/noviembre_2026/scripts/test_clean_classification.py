import re
from parse_all_catalogo import books

def classify_book(idx, title, raw_col):
    raw_col_lower = raw_col.lower()
    t_lower = title.lower()
    
    col_id = None
    series_name = None
    
    # 1. CJMA
    if 'josé maría arguedas' in raw_col_lower or 'arguedas' in raw_col_lower:
        col_id = 'cjma'
        if 'narrativa' in raw_col_lower:
            series_name = 'CJMA - Serie Narrativa'
        elif 'poesía' in raw_col_lower or 'poesia' in raw_col_lower:
            series_name = 'CJMA - Serie Poesía'
        elif 'ensayo' in raw_col_lower:
            series_name = 'CJMA - Serie Ensayo'
        elif 'estudios críticos' in raw_col_lower or 'estudios criticos' in raw_col_lower:
            if 'leamos' in t_lower:
                series_name = 'CJMA - Serie Ensayo'
            else:
                series_name = 'CJMA - Serie Estudios Críticos'
        elif 'plan lector' in raw_col_lower:
            series_name = 'CJMA - Plan Lector'
        else:
            series_name = 'CJMA - Serie Narrativa'
            
    # 2. CCV
    elif 'césar vallejo' in raw_col_lower or 'vallejo' in raw_col_lower:
        col_id = 'ccv'
        series_name = 'CCV - Serie Poesía'
        
    # 3. CFC
    elif 'carrillo' in raw_col_lower or 'carillo' in raw_col_lower:
        col_id = 'cfc'
        series_name = 'CFC - Serie Enciclopedia Histórica de la Literatura Peruana'
        
    # 4. CRB
    elif 'bolton' in raw_col_lower:
        col_id = 'crb'
        if 'etnografía clásica' in raw_col_lower or idx in [25, 26]:
            series_name = 'CRB - Serie Etnografía Clásica en el Altiplano Peruano 1940-1980'
        else:
            series_name = 'CRB - Serie Estudios Etnográficos'
            
    # 5. CN
    elif 'narrativa' in raw_col_lower:
        col_id = 'cn'
        if 'clásicos' in raw_col_lower or 'clasicos' in raw_col_lower:
            series_name = 'CN - Serie Clásicos'
        else:
            series_name = 'CN - Serie Contemporáneos'
            
    # 6. CP
    elif raw_col_lower.strip() in ['poesía', 'poesia']:
        col_id = 'cp'
        series_name = 'Colección Poesía (CP)'
        
    # 7. CE
    elif 'ensayo' in raw_col_lower:
        col_id = 'ce'
        if 'crítica literaria' in raw_col_lower or 'critica literaria' in raw_col_lower:
            series_name = 'CE - Serie Crítica Literaria'
        elif 'ciencias sociales' in raw_col_lower:
            series_name = 'CE - Serie Ciencias Sociales'
        elif 'arte y cultura' in raw_col_lower:
            series_name = 'CE - Serie Arte y Cultura'
        elif 'amazonía' in raw_col_lower or 'amazonia' in raw_col_lower:
            series_name = 'CE - Serie Amazonía'
        else:
            if idx == 45 or 'dramatización' in t_lower or 'danza' in t_lower:
                series_name = 'CE - Serie Arte y Cultura'
            else:
                series_name = 'CE - Serie Ciencias Sociales'
                
    # 8. CIJ
    elif 'infanto' in raw_col_lower or 'juvenil' in raw_col_lower:
        col_id = 'cij'
        series_name = 'Colección Infanto-Juvenil (CIJ)'
        
    # 9. CM
    elif 'miscelánea' in raw_col_lower or 'miscelanea' in raw_col_lower:
        col_id = 'cm'
        series_name = 'Colección Miscelánea (CM)'
        
    # 10. CI
    elif 'idiomas' in raw_col_lower:
        col_id = 'ci'
        series_name = 'Colección Idiomas (CI)'
        
    else:
        if 'dramatización' in t_lower:
            col_id = 'ce'
            series_name = 'CE - Serie Arte y Cultura'
        else:
            col_id = 'ce'
            series_name = 'CE - Serie Ciencias Sociales'
            
    return col_id, series_name

stats = {}
for b in books:
    col_id, ser = classify_book(b['index'], b['title'], b['fields'].get('colección', ''))
    stats[col_id] = stats.get(col_id, 0) + 1
    nov = " [NOVEDAD]" if b['isNew'] else ""
    print(f"[{b['index']:2d}] {col_id.upper()} | {ser:<55} | {b['title'][:32]}{nov}")

print("\nCollection counts:")
for k, v in stats.items():
    print(f"  {k.upper()}: {v} libros")
print(f"TOTAL: {sum(stats.values())}")
