import zipfile
import xml.etree.ElementTree as ET
import json
import re

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

paras = read_docx('ADICIONALES/noviembre_2026/Catalogo_general_noviembre_2026.docx')

author_prefixes = ('autor:', 'autores:', 'autora:', 'autoras:', 'compilador:', 'compiladora:', 'compiladores:', 'editor:', 'editora:', 'coordinador:', 'coordinadora:')

book_start_indices = []
for i, p in enumerate(paras):
    p_lower = p.lower()
    if any(p_lower.startswith(pref) for pref in author_prefixes):
        # The line before this should be the book title, unless it's a sub-author line
        # Check if the line before is an author line too (e.g. Autores:... then Editora:...)
        prev = paras[i-1]
        prev_lower = prev.lower()
        if not any(prev_lower.startswith(pref) for pref in author_prefixes):
            book_start_indices.append(i-1)

# Remove duplicates while preserving order
unique_indices = []
for idx in book_start_indices:
    if not unique_indices or unique_indices[-1] != idx:
        unique_indices.append(idx)

print(f"Total book entries found: {len(unique_indices)}")

books = []
for k, start_idx in enumerate(unique_indices):
    end_idx = unique_indices[k+1] if k+1 < len(unique_indices) else len(paras)
    
    title_raw = paras[start_idx]
    entry_paras = paras[start_idx+1 : end_idx]
    
    fields = {}
    current_key = None
    
    for line in entry_paras:
        # Check if this line is a collection/series header that got caught between entries
        # Usually headers appear before the title
        if any(line.startswith(c) for c in ['Colección ', 'Papel de viento', 'CJMA', 'CCV', 'CFC', 'CRB', 'CN', 'CE', 'CIJ', 'CM', 'CI']):
            if len(line) < 80 and not ':' in line:
                continue
        
        parts = line.split(':', 1)
        if len(parts) == 2 and len(parts[0].strip()) < 40 and not any(parts[0].lower().startswith(x) for x in ['http', 'nota', 'capítulo']):
            key = parts[0].strip().lower()
            val = parts[1].strip()
            fields[key] = val
            current_key = key
        else:
            if current_key == 'reseña':
                fields['reseña'] += ' ' + line.strip()
            elif current_key:
                fields[current_key] += ' ' + line.strip()
    
    is_new = 'novedad' in title_raw.lower()
    clean_title = re.sub(r'\s*novedad\s*', '', title_raw, flags=re.I).strip()
    
    books.append({
        'index': k + 1,
        'title': clean_title,
        'raw_title': title_raw,
        'isNew': is_new,
        'fields': fields
    })

print(f"Parsed {len(books)} books successfully.\n")
for b in books:
    author = b['fields'].get('autor') or b['fields'].get('autora') or b['fields'].get('autores') or b['fields'].get('compilador') or b['fields'].get('compiladora') or 'N/A'
    col = b['fields'].get('colección', 'N/A')
    price = b['fields'].get('precio de venta al público', 'N/A')
    isbn = b['fields'].get('isbn', 'N/A')
    novedad = " [NOVEDAD]" if b['isNew'] else ""
    print(f"{b['index']:2d}. {b['title']}{novedad}")
    print(f"    Autor: {author} | Col: {col} | S/ {price} | ISBN: {isbn}")
