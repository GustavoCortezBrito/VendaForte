import urllib.request
import re
import json
import os
from bs4 import BeautifulSoup

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode('utf-8')

def crawl():
    category_url = 'https://ep-equipment.com/product-category/electric-forklifts/'
    print(f"Fetching category page: {category_url}")
    html = fetch(category_url)
    soup = BeautifulSoup(html, 'html.parser')
    
    product_links = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        if '/product/' in href and href.count('/') >= 4:
            full_link = href if href.startswith('http') else 'https://ep-equipment.com' + href
            if full_link not in product_links:
                product_links.append(full_link)
    
    print(f"Found {len(product_links)} products.")
    
    PT_MODELS_INFO = {
        "efs151": {
            "title": "EFS151",
            "subtitle": "Empilhadeira Elétrica Contrabalançada Compacta 3 Rodas 1.5T",
            "type": "3 Rodas",
            "description": "A EFS151 é uma empilhadeira elétrica ultra-compacta de 3 rodas com capacidade para 1.500 kg. Projetada com chassi reduzido e raio de giro de apenas 1535 mm, é perfeita para movimentação ágil em corredores estreitos, mezaninos e contêineres.",
            "applications": ["Depósitos com corredores estreitos", "Operações de carga e descarga em caminhões", "Indústrias leves e logística interna"]
        },
        "tcl101": {
            "title": "TCL101",
            "subtitle": "Empilhadeira Elétrica Íon-Lítio 80V Tracionada 3 Rodas 1.0T",
            "type": "3 Rodas Li-Ion 80V",
            "description": "A TCL101 é uma empilhadeira elétrica compacta alimentada por bateria de Lítio 80V. Conta com motor duplo de tração PMSM de alto rendimento, freio automático em rampa e dimensões reduzidas para máxima manobrabilidade em espaços fechados.",
            "applications": ["Armazéns de alta densidade", "Operações em elevadores de carga e mezaninos", "Movimentação contínua de pallets leves"]
        },
        "tcl122": {
            "title": "TCL122",
            "subtitle": "Empilhadeira Elétrica Íon-Lítio 80V Tracionada 3 Rodas 1.2T",
            "type": "3 Rodas Li-Ion 80V",
            "description": "A TCL122 combina 1.200 kg de capacidade nominal com tecnologia Li-Ion 80V e motores PMSM duplos. Oferece aceleração suave, recarga rápida e excelente ergonomia para o operador durante jornadas intensas.",
            "applications": ["Logística de varejo e centros de distribuição", "Carga e descarga de mercadorias", "Ambientes fabris com restrição de espaço"]
        },
        "tcl152": {
            "title": "TCL152",
            "subtitle": "Empilhadeira Elétrica Íon-Lítio 80V Tracionada 3 Rodas 1.5T",
            "type": "3 Rodas Li-Ion 80V",
            "description": "Desenvolvida para máxima produtividade, a TCL152 entrega 1.500 kg de capacidade de carga com chassi compacto de 3 rodas. Equipada com bateria de Lítio de 80V, permite cargas de oportunidade sem efeito memória.",
            "applications": ["Armazenagem vertical até 4.5m", "Operação interna contínua 24/7", "Indústria farmacêutica e alimentícia"]
        },
        "tdl161": {
            "title": "TDL161",
            "subtitle": "Empilhadeira Elétrica Li-Ion 48V 4 Rodas Versátil 1.6T",
            "type": "4 Rodas Li-Ion 48V",
            "description": "A TDL161 é uma empilhadeira de 4 rodas projetada para máxima estabilidade e tração em pisos irregulares ou operações mistas (interna/externa). Capacidade de 1.600 kg e elevação até 6,0 metros.",
            "applications": ["Operações internas e externas em pátios", "Indústria manufatureira e materiais de construção", "Carga e descarga de carretas"]
        },
        "tdl162": {
            "title": "TDL162",
            "subtitle": "Empilhadeira Elétrica Li-Ion 80V 4 Rodas Alta Performance 1.6T",
            "type": "4 Rodas Li-Ion 80V",
            "description": "Com arquitetura 80V de alta eficiência, a TDL162 oferece potência equivalente a modelos a combustão com zero emissão. Excelente velocidade de translação e elevação para operações pesadas.",
            "applications": ["Operações de ritmo intenso 2 ou 3 turnos", "Movimentação em rampas e superfícies acentuadas", "Logística pesada e bebidas"]
        },
        "tdl201": {
            "title": "TDL201",
            "subtitle": "Empilhadeira Elétrica Li-Ion 48V 4 Rodas Robustez 2.0T",
            "type": "4 Rodas Li-Ion 48V",
            "description": "A TDL201 possui capacidade nominal de 2.000 kg com estabilidade superior em 4 rodas. Chassi reforçado, mastro de ampla visibilidade e cabine ergonômica com comandos intuitivos.",
            "applications": ["Movimentação de paletes pesados de até 2 toneladas", "Armazéns de grande porte e estoques verticais", "Indústria metalúrgica e embalagens"]
        },
        "tvl151": {
            "title": "TVL151",
            "subtitle": "Empilhadeira Elétrica Contrabalançada Li-Ion 80V 3 Rodas 1.5T",
            "type": "3 Rodas Li-Ion 80V",
            "description": "A linha TVL é referência em ergonomia e visão ampla para o operador. A TVL151 de 1.5T oferece tração dupla 80V, direção hidráulica suave e sistema inteligente de gerenciamento de bateria (BMS).",
            "applications": ["Centros de distribuição com corredores de 3.1m", "Operações logísticas de alta precisão", "Movimentação rápida de paletes"]
        },
        "tvl181": {
            "title": "TVL181",
            "subtitle": "Empilhadeira Elétrica Contrabalançada Li-Ion 80V 3 Rodas 1.8T",
            "type": "3 Rodas Li-Ion 80V",
            "description": "Equipada com capacidade para 1.800 kg e elevação de até 6,0 metros, a TVL181 une a agilidade de 3 rodas à robustez necessária para cargas intermediárias pesadas.",
            "applications": ["Estocagem em prateleiras altas", "Operações com múltiplos turnos via carga rápida Li-Ion", "Indústria automobilística e autopeças"]
        },
        "tvl182": {
            "title": "TVL182",
            "subtitle": "Empilhadeira Elétrica Contrabalançada Li-Ion 80V Premium 1.8T",
            "type": "3 Rodas Li-Ion 80V",
            "description": "Modelo evoluído com chassi em monobloco fundido e motores PMSM de última geração. A TVL182 proporciona economia de energia superior e custo operacional mínimo.",
            "applications": ["Armazenagem intensiva e movimentação de alta frequência", "Operações em contêineres e garagens baixas", "Logística verde com zero emissões"]
        },
        "tvl201": {
            "title": "TVL201",
            "subtitle": "Empilhadeira Elétrica Contrabalançada Li-Ion 80V 3 Rodas 2.0T",
            "type": "3 Rodas Li-Ion 80V",
            "description": "A TVL201 oferece 2.000 kg de capacidade com o menor raio de giro da categoria para empilhadeiras de 2 toneladas. Direção precisa e aceleração responsiva.",
            "applications": ["Cargas pesadas em espaços restritos", "Centros logísticos e e-commerce", "Operações fabris exigentes"]
        },
        "tvl202": {
            "title": "TVL202",
            "subtitle": "Empilhadeira Elétrica Contrabalançada Li-Ion 80V Premium 2.0T",
            "type": "3 Rodas Li-Ion 80V",
            "description": "A TVL202 é o topo da linha de 3 rodas da EP Equipment. Possui chassi monobloco reforçado por fundição integral, motor PMSM duplo de 80V e cabine ultra-espaçosa para o operador.",
            "applications": ["Operações pesadas de 2.000 kg em ambientes internos", "Trabalho contínuo 24 horas por dia", "Logística de alto rendimento"]
        }
    }

    products = []
    
    for idx, link in enumerate(product_links, 1):
        slug = link.strip('/').split('/')[-1]
        print(f"[{idx}/{len(product_links)}] Parsing {slug}...")
        
        p_html = fetch(link)
        p_soup = BeautifulSoup(p_html, 'html.parser')
        
        # Raw specs
        specs = {}
        for table in p_soup.find_all('table'):
            for row in table.find_all('tr'):
                cols = row.find_all(['td', 'th'])
                if len(cols) >= 2:
                    k = cols[0].text.strip()
                    v = cols[1].text.strip()
                    if k and v and k != "Name":
                        specs[k] = v
                        
        # Extract images checking data-src, data-srcset, src
        raw_imgs = []
        for img in p_soup.find_all('img'):
            for attr in ['data-src', 'data-srcset', 'src']:
                val = img.get(attr)
                if val:
                    # extract URLs from srcset if any
                    for part in val.split(','):
                        u = part.strip().split()[0]
                        if u.startswith('//'):
                            u = 'https:' + u
                        if ('cdn.ep-portal.net/products/' in u or 'wp-content/uploads/' in u) and not u.endswith('.svg'):
                            if u not in raw_imgs:
                                raw_imgs.append(u)

        # Filter out navigation megamenu images if specific product images are present
        product_specific_imgs = [i for i in raw_imgs if 'attr_' in i or 'features_container' in i or 'banner' in i or 'product' in i]
        if not product_specific_imgs:
            product_specific_imgs = raw_imgs

        main_image = product_specific_imgs[0] if product_specific_imgs else (raw_imgs[0] if raw_imgs else "")
        gallery_images = product_specific_imgs[1:7] if len(product_specific_imgs) > 1 else raw_imgs[:6]

        info = PT_MODELS_INFO.get(slug, {
            "title": slug.upper(),
            "subtitle": f"Empilhadeira Elétrica {slug.upper()}",
            "type": "Elétrica Contrabalançada",
            "description": f"Empilhadeira elétrica de alta performance modelo {slug.upper()}.",
            "applications": ["Logística interna", "Armazenagem", "Carga e Descarga"]
        })
        
        capacity = specs.get('Rated capacity', '1500 kg')
        lift_height = specs.get('Max lift height', specs.get('Lift', '4500 mm'))
        battery_volt = specs.get('Battery voltage', '80V' if '80' in info['type'] else '48V')
        battery_type = specs.get('Battery type', 'Li-Ion (Íon-Lítio)')
        turning_radius = specs.get('Turning radius', '1535 mm')
        travel_speed = specs.get('Travel speed, laden/unladen', '9/10 km/h')

        product_item = {
            "id": slug,
            "slug": slug,
            "title": info["title"],
            "subtitle": info["subtitle"],
            "type": info["type"],
            "capacity": capacity,
            "liftingHeight": lift_height,
            "batteryVoltage": battery_volt,
            "batteryType": battery_type,
            "turningRadius": turning_radius,
            "travelSpeed": travel_speed,
            "description": info["description"],
            "applications": info["applications"],
            "url": link,
            "mainImage": main_image,
            "galleryImages": gallery_images,
            "specs": specs,
            "category": "Empilhadeiras Elétricas",
            "categorySlug": "empilhadeiras-eletricas",
            "highlights": [
                {"title": "Bateria Li-Ion 80V / 48V", "desc": "Carregamento oportuno rápido (1 a 2 horas) com vida útil de até 3000 ciclos."},
                {"title": "Motores Duplos PMSM", "desc": "Tecnologia de motor síncrono de ímã permanente para maior rendimento e menor consumo."},
                {"title": "Ergonomia & Segurança", "desc": "Redução automática de velocidade em curvas e freio automático de rampa para proteção total."},
                {"title": "Design Monobloco", "desc": "Estrutura fundida integral com mastro de ampla visibilidade panorâmica."}
            ]
        }
        products.append(product_item)

    out_file = os.path.join(os.path.dirname(__file__), '..', 'lib', 'data', 'electric-forklifts.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
        
    print(f"Crawl completed! Saved {len(products)} products with HD images to {out_file}")

if __name__ == '__main__':
    crawl()
