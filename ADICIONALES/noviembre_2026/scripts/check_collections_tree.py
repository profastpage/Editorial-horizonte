from parse_catalogo import paragraphs
import json

collections = {}
current_col = "General"
current_ser = "General"

for i, p in enumerate(paragraphs):
    if p.startswith('Colección ') or p.startswith('Papel de viento'):
        current_col = p
        current_ser = "Sin serie"
        collections[current_col] = {}
        continue
    if any(p.startswith(x) for x in ['CJMA - ', 'CCV - ', 'CFC - ', 'CRB - ', 'CN - ', 'CE - ', 'Serie ']):
        current_ser = p
        if current_col not in collections:
            collections[current_col] = {}
        collections[current_col][current_ser] = []
        continue
    if i + 1 < len(paragraphs) and paragraphs[i+1].startswith('Autor:'):
        title = p
        if current_col not in collections:
            collections[current_col] = {}
        if current_ser not in collections[current_col]:
            collections[current_col][current_ser] = []
        collections[current_col][current_ser].append(title)

print(json.dumps(collections, indent=2, ensure_ascii=False))
