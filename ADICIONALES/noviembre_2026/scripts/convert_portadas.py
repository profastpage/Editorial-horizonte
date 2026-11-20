import os
from PIL import Image

portadas_dir = 'ADICIONALES/noviembre_2026/portadas'
covers_dir = 'public/covers'

os.makedirs(covers_dir, exist_ok=True)

files = os.listdir(portadas_dir)
print(f"Processing {len(files)} files from {portadas_dir}...")

for f in files:
    src_path = os.path.join(portadas_dir, f)
    # create a clean filename
    name, ext = os.path.splitext(f)
    clean_name = name.replace(' ', '_').replace('́', '') # clean accents if any
    dst_name = f"{clean_name}.webp"
    dst_path = os.path.join(covers_dir, dst_name)
    
    try:
        with Image.open(src_path) as img:
            # Convert RGBA or RGB to RGB if saving as WebP (or keep RGBA for webp)
            img.save(dst_path, 'WEBP', quality=90)
            print(f"Saved: {dst_name}")
    except Exception as e:
        print(f"Error converting {f}: {e}")

print("Done converting portadas.")
