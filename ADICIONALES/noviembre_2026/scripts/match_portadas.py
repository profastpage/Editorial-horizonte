import os
import re
from parse_all_catalogo import books

portadas = os.listdir('ADICIONALES/noviembre_2026/portadas')

def normalize(s):
    s = s.lower()
    s = re.sub(r'[áàäâ]', 'a', s)
    s = re.sub(r'[éèëê]', 'e', s)
    s = re.sub(r'[íìïî]', 'i', s)
    s = re.sub(r'[óòöô]', 'o', s)
    s = re.sub(r'[úùüû]', 'u', s)
    s = re.sub(r'ñ', 'n', s)
    s = re.sub(r'[^a-z0-9]', ' ', s)
    return ' '.join(s.split())

portada_norm = [(f, normalize(f)) for f in portadas]

matches = []
for b in books:
    t = b['title']
    t_norm = normalize(t)
    words = [w for w in t_norm.split() if len(w) > 3 and w not in ['sobre', 'entre', 'para', 'como', 'hacia', 'desde', 'serie', 'edicion', 'ilustrada']]
    
    best_file = None
    best_score = 0
    
    for f, f_norm in portada_norm:
        score = sum(1 for w in words if w in f_norm)
        if score > best_score:
            best_score = score
            best_file = f
            
    matches.append((b['index'], t, best_file, best_score))

print("Cover matching preliminary results:")
for idx, title, f, score in matches:
    print(f"{idx:2d}. {title[:40]:<40} -> {f} (score {score})")
