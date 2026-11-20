import zipfile
import xml.etree.ElementTree as ET

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

for i, p in enumerate(paragraphs):
    if any(k in p.lower() for k in ['novedad', 'amauta', 'relatos completos', 'próximamente', 'proximamente']):
        print(f'{i}: {p}')
