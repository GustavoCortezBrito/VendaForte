import urllib.request
import re
import json
import os

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}

json_path = os.path.join(os.path.dirname(__file__), '..', 'lib', 'data', 'electric-forklifts.json')
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Checking images for {len(products)} products...")

updated_count = 0

for idx, p in enumerate(products, 1):
    url = p.get('url') or f"https://ep-equipment.com/product/{p['slug']}/"
    print(f"[{idx}/{len(products)}] Fetching exact image for {p['slug']} from {url}...")

    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')

        # Try to find og:image meta tag first (WordPress WooCommerce usually sets og:image to the exact featured product photo)
        og_img_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.I)
        found_main = ""

        if og_img_match:
            cand = og_img_match.group(1)
            if 'ep-portal' in cand or 'wp-content/uploads' in cand:
                found_main = cand

        # If no og:image or generic logo, search for product hero image attribute
        if not found_main:
            # Look for woocommerce-product-gallery or img with attr_ in src/data-src
            attr_matches = re.findall(r'https://cdn\.ep-portal\.net/products/attr_[^"\']+\.webp', html)
            if attr_matches:
                found_main = attr_matches[0]

        if not found_main:
            # Look for uploads images
            upload_matches = re.findall(r'https://ep-equipment\.com/wp-content/uploads/[^"\']+\.(?:png|jpg|jpeg|webp)', html)
            valid_uploads = [u for u in upload_matches if 'logo' not in u.lower() and 'icon' not in u.lower() and 'header' not in u.lower()]
            if valid_uploads:
                found_main = valid_uploads[0]

        if found_main:
            p['mainImage'] = found_main
            # update gallery to include found_main as first
            g = [found_main] + [img for img in p.get('galleryImages', []) if img != found_main]
            p['galleryImages'] = g[:5]
            updated_count += 1
            print(f"  -> Found exact image: {found_main}")
        else:
            print(f"  -> Kept existing image: {p['mainImage']}")

    except Exception as e:
        print(f"  -> Error: {e}")

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\nFinished updating exact images for {updated_count} / {len(products)} products!")
