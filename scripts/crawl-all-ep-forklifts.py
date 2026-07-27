import urllib.request
import re
import json
import os
import time
from bs4 import BeautifulSoup

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}

def fetch(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def crawl_all():
    base_category_url = 'https://ep-equipment.com/product-category/electric-forklifts/'
    product_links = []

    print("--- Starting Full EP Equipment Crawler ---")
    
    # Crawl page 1 to 10
    for page_num in range(1, 11):
        if page_num == 1:
            url = base_category_url
        else:
            url = f"https://ep-equipment.com/product-category/electric-forklifts/page/{page_num}/"
        
        print(f"Fetching page {page_num}: {url}")
        html = fetch(url)
        if not html:
            continue

        soup = BeautifulSoup(html, 'html.parser')
        page_found = 0
        
        for a in soup.find_all('a', href=True):
            href = a['href']
            if '/product/' in href and href.count('/') >= 4:
                full_link = href if href.startswith('http') else 'https://ep-equipment.com' + href
                full_link = full_link.split('?')[0] # remove query params
                if full_link not in product_links:
                    product_links.append(full_link)
                    page_found += 1
        
        print(f"Found {page_found} new product links on page {page_num}.")
        time.sleep(0.5)

    print(f"\nTotal unique product links found across all pages: {len(product_links)}")

    products = []

    for idx, link in enumerate(product_links, 1):
        slug = link.strip('/').split('/')[-1]
        print(f"[{idx}/{len(product_links)}] Processing {slug}...")

        p_html = fetch(link)
        if not p_html:
            continue

        p_soup = BeautifulSoup(p_html, 'html.parser')

        # Raw specs
        specs = {}
        for table in p_soup.find_all('table'):
            for row in table.find_all('tr'):
                cols = row.find_all(['td', 'th'])
                if len(cols) >= 2:
                    k = cols[0].text.strip()
                    v = cols[1].text.strip()
                    if k and v and k.lower() != "name":
                        specs[k] = v

        # Extract images
        raw_imgs = []
        for img in p_soup.find_all('img'):
            for attr in ['data-src', 'data-srcset', 'src']:
                val = img.get(attr)
                if val:
                    for part in val.split(','):
                        u = part.strip().split()[0]
                        if u.startswith('//'):
                            u = 'https:' + u
                        if ('cdn.ep-portal.net/products/' in u or 'wp-content/uploads/' in u) and not u.endswith('.svg'):
                            if u not in raw_imgs:
                                raw_imgs.append(u)

        product_specific_imgs = [i for i in raw_imgs if 'attr_' in i or 'features_container' in i or 'banner' in i or 'product' in i]
        if not product_specific_imgs:
            product_specific_imgs = raw_imgs

        main_image = product_specific_imgs[0] if product_specific_imgs else (raw_imgs[0] if raw_imgs else "https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp")
        gallery_images = product_specific_imgs[1:7] if len(product_specific_imgs) > 1 else raw_imgs[:6]

        # Product Title
        h1 = p_soup.find('h1')
        title_text = h1.text.strip() if h1 else slug.upper()

        # Description / excerpt
        desc = ""
        desc_el = p_soup.find('div', class_=re.compile('description|content|summary', re.I))
        if desc_el:
            desc = desc_el.text.strip()
        if not desc:
            p_first = p_soup.find('p')
            if p_first:
                desc = p_first.text.strip()

        capacity = specs.get('Rated capacity', specs.get('Capacity', '1.500 kg'))
        lift_height = specs.get('Max lift height', specs.get('Lift', '4.500 mm'))
        battery_volt = specs.get('Battery voltage', '80 V' if '80' in title_text else '48 V')
        battery_type = specs.get('Battery type', 'Li-Ion')
        turning_radius = specs.get('Turning radius', specs.get('Turning Radius', '1.500 mm'))
        travel_speed = specs.get('Travel speed, laden/unladen', '13/14 km/h')

        # Type classification
        type_str = "Elétrica Contrabalançada"
        if "3" in title_text or "3" in specs.get('Wheels', '') or "3-wheel" in desc.lower():
            type_str = "3 Rodas Li-Ion"
        elif "4" in title_text or "4" in specs.get('Wheels', '') or "4-wheel" in desc.lower():
            type_str = "4 Rodas Li-Ion"

        product_item = {
            "id": slug,
            "slug": slug,
            "title": title_text,
            "subtitle": f"Empilhadeira Elétrica EP {title_text} • {capacity}",
            "type": type_str,
            "capacity": capacity,
            "liftingHeight": lift_height,
            "batteryVoltage": battery_volt,
            "batteryType": battery_type,
            "turningRadius": turning_radius,
            "travelSpeed": travel_speed,
            "description": desc or f"A empilhadeira elétrica EP {title_text} oferece alta produtividade, economia operacional e zero emissões com bateria de Lítio.",
            "applications": [
                "Centros de distribuição e logística",
                "Estocagem e movimentação de paletes",
                "Carga e descarga de caminhões"
            ],
            "url": link,
            "mainImage": main_image,
            "galleryImages": gallery_images,
            "specs": specs,
            "category": "Empilhadeiras Elétricas",
            "categorySlug": "empilhadeiras-eletricas",
            "highlights": [
                {"title": "Bateria Li-Ion EP", "desc": "Tecnologia de lítio com recarga oportuna rápida e zero manutenção de água."},
                {"title": "Alta Eficiência Operacional", "desc": "Desempenho comparável a modelos a combustão com custo de energia reduzido."},
                {"title": "Ergonomia Avançada", "desc": "Cabine ergonômica com comandos intuitivos e mastro de visibilidade panorâmica."},
                {"title": "Garantia Venda Forte", "desc": "Suporte técnico especializado, peças de reposição e assistência autorizada."}
            ]
        }
        products.append(product_item)

    out_file = os.path.join(os.path.dirname(__file__), '..', 'lib', 'data', 'electric-forklifts.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"\n--- SUCCESS! Saved {len(products)} products to {out_file} ---")

if __name__ == '__main__':
    crawl_all()
