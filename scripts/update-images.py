import urllib.request
import json
import os
import re
from bs4 import BeautifulSoup

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode('utf-8')

def build_category_image_map():
    url = 'https://ep-equipment.com/product-category/electric-forklifts/'
    html = fetch(url)
    soup = BeautifulSoup(html, 'html.parser')
    
    img_map = {}
    for a in soup.find_all('a', href=True):
        href = a['href']
        if '/product/' in href and href.count('/') >= 4:
            slug = href.strip('/').split('/')[-1]
            parent = a.parent
            while parent and not parent.find_all('img'):
                parent = parent.parent
            if parent:
                for img in parent.find_all('img'):
                    data_src = img.get('data-src') or img.get('data-srcset') or img.get('src')
                    if data_src and 'cdn.ep-portal.net' in data_src:
                        # Convert 300w to full res 1024w / webp
                        clean_url = data_src.split()[0]
                        clean_url = re.sub(r'-\d+w\.webp', '.webp', clean_url)
                        img_map[slug] = clean_url
                        break
    return img_map

def main():
    print("Extracting category image map...")
    img_map = build_category_image_map()
    print(f"Mapped {len(img_map)} product images.")
    for k, v in img_map.items():
        print(f"  {k} => {v}")

    json_path = os.path.join(os.path.dirname(__file__), '..', 'lib', 'data', 'electric-forklifts.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            products = json.load(f)
            
        for p in products:
            slug = p['slug']
            if slug in img_map:
                p['mainImage'] = img_map[slug]
            elif not p['mainImage']:
                p['mainImage'] = f"https://cdn.ep-portal.net/products/thumbnail/1762430440040-wwqzkx.webp"
                
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
            
        print("Updated lib/data/electric-forklifts.json successfully!")

if __name__ == '__main__':
    main()
