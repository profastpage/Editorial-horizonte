import zipfile
import xml.etree.ElementTree as ET
import re
import json

def read_docx(path):
    with zipfile.ZipFile(path) as docx:
        tree = ET.fromstring(docx.read('word/document.xml'))
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        text = []
        for p in tree.iterfind('.//w:p', namespaces):
            p_text = ''.join(node.text for node in p.iterfind('.//w:t', namespaces) if node.text)
            if p_text.strip():
                text.append(p_text.strip())
        return text

paragraphs = read_docx('ADICIONALES/noviembre_2026/Catalogo_general_noviembre_2026.docx')

# Let's inspect the structure and find all books
# Looking at the paragraphs, we see headings like:
# "Colección José María Arguedas"
# "CJMA - Serie Narrativa"
# Book Title [optional NOVEDAD]
# "Autor: ..."
# "Idioma: ..."
# "Colección: ..."
# "Edición: ..."
# "Número de depósito legal: ..."
# "ISBN: ..."
# "Clasificación temática: ..."
# "Público objetivo: ..."
# "Formato: ..."
# "Precio de venta al público: ..."
# "Reseña: ..."
# "También te puede interesar: ..."

books = []
current_collection = ""
current_series = ""

i = 0
while i < len(paragraphs):
    p = paragraphs[i]
    
    # Check for collection headers
    if any(p.startswith(x) for x in ['Colección ', 'Papel de viento']):
        current_collection = p
        current_series = ""
        i += 1
        continue
    
    # Check for series headers
    if any(p.startswith(x) for x in ['CJMA - ', 'CCV - ', 'CFC - ', 'CRB - ', 'CN - ', 'CE - ', 'Serie ']):
        current_series = p
        i += 1
        continue
        
    # Check if next paragraph has "Autor:" or if current paragraph has "Autor:"
    if i + 1 < len(paragraphs) and paragraphs[i+1].startswith('Autor:'):
        # Current paragraph is the book title!
        title_raw = p
        is_new = 'novedad' in title_raw.lower()
        title_clean = re.sub(r'\s*novedad\s*', '', title_raw, flags=re.I).strip()
        
        book_info = {
            'title': title_clean,
            'isNew': is_new,
            'collection_header': current_collection,
            'series_header': current_series,
            'raw_fields': {}
        }
        
        i += 1
        while i < len(paragraphs) and not (i + 1 < len(paragraphs) and paragraphs[i+1].startswith('Autor:')):
            line = paragraphs[i]
            # Stop if we hit another collection or series
            if any(line.startswith(x) for x in ['Colección ', 'CJMA - ', 'CCV - ', 'CFC - ', 'CRB - ', 'CN - ', 'CE - ']):
                break
                
            # Parse field
            parts = line.split(':', 1)
            if len(parts) == 2:
                key = parts[0].strip().lower()
                val = parts[1].strip()
                book_info['raw_fields'][key] = val
            elif line.startswith('También te puede interesar'):
                book_info['raw_fields']['interesar'] = line
            else:
                # continuation
                if 'reseña' in book_info['raw_fields']:
                    book_info['raw_fields']['reseña'] += ' ' + line
            i += 1
            
        books.append(book_info)
    else:
        i += 1

print(f'Total books parsed: {len(books)}')
for idx, b in enumerate(books[:15], 1):
    print(f"{idx}: {b['title']} [{b['collection_header']} / {b['series_header']}] - S/ {b['raw_fields'].get('precio de venta al público', 'N/A')}")
