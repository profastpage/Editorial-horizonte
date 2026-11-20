import os
import re
from parse_all_catalogo import books

covers = [f for f in os.listdir('public/covers') if f.endswith('.webp')]

def normalize(s):
    s = s.lower()
    for src, dst in [('á','a'), ('é','e'), ('í','i'), ('ó','o'), ('ú','u'), ('ñ','n')]:
        s = s.replace(src, dst)
    s = re.sub(r'[^a-z0-9]', ' ', s)
    return ' '.join(s.split())

# Manual explicit map for tricky titles
explicit_map = {
    'yawar fiesta': 'cat_yawar_fiesta.webp', # or caratula_yawar_fiesta-01.webp
    'los rios profundos': 'Caratula_horizonte_Mesa_de_trabajo_1.webp', # let's check
    'el sexto': 'caratula_EL_SEXTO15ed_2024-01.webp',
    'todas las sangres': 'caratula_TODAS_LAS_SANGRES_2026_Mesa_de_trabajo_1.webp',
    'el zorro de arriba': 'Caratula_zorros_2024_Josue-01.webp',
    'yahuar huillay': 'caratula_FINAL-01.webp', # let's check
    'relatos completos': 'Caratula_grande3ra_edicion_2026-01.webp',
    'canto kechwa': 'caratula-01.webp', # let's check
    'katatay': 'caratula-orig.webp', # let's check
    'dioses y hombres': 'Caratula_Dioses_y_hombres_Mesa_de_trabajo_1.webp',
    'leamos juntos': 'Caratula_Leamos_juntos_Mesa_de_trabajo_1.webp',
    'arguedas y la reforma': 'caratula_Reforma-01.webp',
    'agua, warma': 'CARATULA_AGUA_reimp_2025_sin_solapas-01.webp',
    'guaman poma': 'CARATULA_4TA_EDICIÓN_GUAMAN_POMA_Mesa_de_trabajo_1.webp',
    'nueva cronica': 'CARATULA_4TA_EDICIÓN_GUAMAN_POMA_Mesa_de_trabajo_1.webp',
    'cronistas de convento': 'cronistas_convento009.webp',
    'cuyes, camiones': 'Cuyes,_camiones_y_cuentos_en_los_andes013.webp',
    'chucuito': 'caratula_Chucuito_Mesa_de_trabajo_1.webp',
    'el mapa y la espada': 'CARATULA_EL_MAPA_Y_LA_ESPADA_11_febrero_2026-01.webp',
    'querido camarada mao': 'Caratula_Querido_camarada_Mao_10_julio_2026.webp',
    'comentarios irreales': 'Caratula_Comentarios_irreales_Mesa_de_trabajo_1.webp',
    'la retorica neobarroca': 'Caratula_-_La_retorica_final-01.webp',
    'diez claves': 'diez_claves106.webp',
    'periodizacion y analisis': 'Caratula_-_Periodizacion_Quijano_-01.webp',
    'dramatizacion y religiosidad': 'Dramatizacion_y_religiosidad_cultural043.webp',
    'rondas campesinas': 'caratula_Rondas_campesinas_Mesa_de_trabajo_1.webp',
    'el turismo': 'CARATULA_EL_TURISMO-01.webp',
    'buscando un inca': 'Buscando_un_inca.webp',
    'amauta. cien anos': 'Amauta_caratula_16_octubre_Mesa_de_trabajo_1.webp',
    'amauta': 'Amauta_caratula_16_octubre_Mesa_de_trabajo_1.webp',
    'el otro dimas': 'Caratula_boceto_Mesa_de_trabajo_1-01.webp',
    'resistir el paso': 'Caratula_F___Resistir_el_paso_del_tiempo_Mesa_de_trabajo_1.webp',
    'textil: mujeres': 'Caratula_Textil_Mujeres_de_Poder_Horizonte-01.webp',
    'imaginario shawi': 'Caratula_Imaginario_Shawi-01.webp',
    'de seres divinos': 'DE_SERES_DIVINOS.webp',
    'mujer ashaninka': 'CARATULA_mujer_ashaninka_Mesa_de_trabajo_1.webp',
    'memorias de una antropologa': 'Caratula_Memorias_antropologa-01.webp',
    'contacto linguistico': 'Caratula__Contacto_linguistico-01-01.webp',
    'el rey de la montana': 'caratula_el_rey-01.webp',
    'dos cuentos de amor': 'dos_cuentos-01.webp',
    'abrazando el ahora': 'caratula_Abrazando_el_ahora___Horizonte_c-02.webp',
    'influencers de verdad': 'Caratula_Influencers_22_JULIO-01.webp',
    'el demonio andino': 'El_demonio_andino.webp',
    'peru volver a empezar': 'caratula_tomo_2_nueva_Mesa_de_trabajo_1.webp'
}

print("Checking explicit and fuzzy matches for all 77 books against covers:")
for b in books:
    t_norm = normalize(b['title'])
    match = None
    for k, v in explicit_map.items():
        if normalize(k) in t_norm:
            match = v
            break
            
    if not match:
        # fuzzy search
        words = [w for w in t_norm.split() if len(w) > 3]
        best_c = None
        best_score = 0
        for c in covers:
            c_norm = normalize(c)
            sc = sum(1 for w in words if w in c_norm)
            if sc > best_score:
                best_score = sc
                best_c = c
        if best_score >= 1:
            match = best_c
            
    print(f"[{b['index']:2d}] {b['title'][:35]:<35} -> {match}")
