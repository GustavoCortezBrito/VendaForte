import urllib.request
from bs4 import BeautifulSoup

url = 'https://ep-equipment.com/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')

print("Categories found in nav/links:")
for a in soup.find_all('a', href=True):
    href = a['href']
    if 'product-category' in href:
        print(a.text.strip(), "-->", href)
