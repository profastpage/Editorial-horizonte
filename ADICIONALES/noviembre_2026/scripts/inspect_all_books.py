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

books = []
for i, p in enumerate(paras):
    if i + 1 < len(paras) and paras[i+1].startswith('Autor:'):
        title = p
        fields = {}
        j = i + 1
        while j < len(paras):
            if j + 1 < len(paras) and paras[j+1].startswith('Autor:'):
                break
            line = paras[j]
            # check if line has key: value
            parts = line.split(':', 1)
            if len(parts) == 2 and len(parts[0]) < 40 and not any(parts[0].lower().startswith(x) for x in ['http', 'nota', 'capítulo']):
                k = parts[0].strip().lower()
                v = parts[1].strip()
                fields[k] = v
            else:
                if 'reseña' in fields:
                    fields['reseña'] += '\n' + line
                elif 'también te puede interesar' in line.lower():
                    fields['interesar'] = line
            j += 1
        books.append({'title_raw': title, 'fields': fields})

print(f"Total parsed books: {len(books)}")
for idx, b in enumerate(books, 1):
    t = b['title_raw']
    author = b['fields'].get('autor', 'N/A')
    col = b['fields'].get('colección', 'N/A')
    price = b['fields'].get('precio de venta al público', 'N/A')
    pages = b['fields'].get('formato', 'N/A')
    isbn = b['fields'].get('isbn', 'N/A')
    print(f"{idx:2d}. {t} | {author} | {col} | {price}")
