const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => resolve(''));
  });
}

async function main() {
  const pagesToScan = [
    'https://ep-equipment.com/products/',
    'https://ep-equipment.com/warehouse-equipment/',
    'https://ep-equipment.com/product-category/electric-forklifts/',
    'https://ep-equipment.com/product-category/electric-pallet-trucks/',
    'https://ep-equipment.com/product-category/stackers/',
    'https://ep-equipment.com/product-category/order-pickers/',
    'https://ep-equipment.com/product-category/reach-trucks/',
    'https://ep-equipment.com/product-category/tow-tractors/',
    'https://ep-equipment.com/product-category/autonomous-guided-vehicles/'
  ];

  const allCategories = new Set();
  const allProducts = new Set();

  for (const url of pagesToScan) {
    console.log(`Fetching ${url}...`);
    const html = await fetchUrl(url);
    if (!html) {
      console.log(`Failed to fetch ${url}`);
      continue;
    }

    const catMatches = html.match(/https?:\/\/ep-equipment\.com\/product-category\/[a-zA-Z0-9-]+\/?/g) || [];
    catMatches.forEach(c => allCategories.add(c));

    const prodMatches = html.match(/https?:\/\/ep-equipment\.com\/product\/[a-zA-Z0-9-]+\/?/g) || [];
    prodMatches.forEach(p => allProducts.add(p));
  }

  console.log('\n--- ALL PRODUCT CATEGORIES FOUND ---');
  console.log(Array.from(allCategories));

  console.log(`\nTOTAL UNIQUE PRODUCTS FOUND ACROSS THESE PAGES: ${allProducts.size}`);
}

main();
