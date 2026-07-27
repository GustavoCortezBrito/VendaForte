import json
import os

json_path = os.path.join(os.path.dirname(__file__), '..', 'lib', 'data', 'electric-forklifts.json')

with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Cleaning images for {len(products)} products...")

for p in products:
    slug = p['slug']

    # Default fallback for TVL series if mismatched image
    if slug == 'tvl151':
        p['mainImage'] = 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp'
        p['galleryImages'] = [
            'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp',
            'https://cdn.ep-portal.net/products/thumbnail/1779791368477-ps5fvm-300w.webp',
            'https://cdn.ep-portal.net/products/thumbnail/1762430440040-wwqzkx-300w.webp'
        ]
    elif slug == 'tvl181':
        p['mainImage'] = 'https://cdn.ep-portal.net/products/attr_5/1762338440190-wx552t.webp'
    elif slug == 'tvl201':
        p['mainImage'] = 'https://cdn.ep-portal.net/products/attr_5/1762338605995-oge79k.webp'

    # Filter gallery images to remove suspicious images that don't match product
    valid_gallery = []
    for img in p.get('galleryImages', []):
        if img and img != p['mainImage']:
            # filter out pallet truck images if it's a forklift
            if 'ep-portal.net' in img or 'uploads' in img:
                valid_gallery.append(img)
    
    # ensure mainImage is first
    p['galleryImages'] = list(dict.fromkeys([p['mainImage']] + valid_gallery[:4]))

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("Image cleaning complete!")
