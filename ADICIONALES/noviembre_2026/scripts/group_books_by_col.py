from parse_all_catalogo import books
import json

collections = {}

for b in books:
    col = b['fields'].get('colección', 'Sin Colección')
    if col not in collections:
        collections[col] = []
    collections[col].append({
        'title': b['title'],
        'isNew': b['isNew'],
        'author': b['fields'].get('autor') or b['fields'].get('autora') or b['fields'].get('autores') or b['fields'].get('compilador') or b['fields'].get('compiladora') or 'N/A',
        'price': b['fields'].get('precio de venta al público', 'N/A')
    })

print("Collections and books in Catalogo_general_noviembre_2026.docx:")
for col, bks in collections.items():
    print(f"\n=== {col} ({len(bks)} libros) ===")
    for b in bks:
        nov = " [NOVEDAD]" if b['isNew'] else ""
        print(f"  - {b['title']}{nov} ({b['author']}) - S/ {b['price']}")
