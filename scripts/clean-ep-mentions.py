import json
import os
import re

json_path = os.path.join(os.path.dirname(__file__), '..', 'lib', 'data', 'electric-forklifts.json')
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Cleaning EP mentions from {len(products)} products...")

for p in products:
    if 'subtitle' in p:
        p['subtitle'] = re.sub(r'Empilhadeira\s+Elétrica\s+EP\s+', 'Empilhadeira Elétrica ', p['subtitle'], flags=re.I)
        p['subtitle'] = re.sub(r'EP\s+Equipment\s*', '', p['subtitle'], flags=re.I)

    if 'description' in p:
        p['description'] = re.sub(r'EP\s+Equipment\s*', '', p['description'], flags=re.I)
        p['description'] = re.sub(r'\bEP\b', '', p['description'])

    if 'highlights' in p:
        for h in p['highlights']:
            if 'title' in h:
                h['title'] = re.sub(r'\s+EP$', '', h['title'], flags=re.I)
                h['title'] = re.sub(r'EP\s+Equipment', '', h['title'], flags=re.I)
            if 'desc' in h:
                h['desc'] = re.sub(r'EP\s+Equipment', '', h['desc'], flags=re.I)

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("Finished cleaning json data!")
