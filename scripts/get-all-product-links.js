const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

const CATEGORY_BASE_URLS = [
  'https://ep-equipment.com/product-category/electric-pallet-trucks/',
  'https://ep-equipment.com/product-category/stackers/',
  'https://ep-equipment.com/product-category/electric-forklifts/',
  'https://ep-equipment.com/product-category/order-pickers/'
];

async function getProductLinks() {
  const productLinks = new Set();
  
  for (const catUrl of CATEGORY_BASE_URLS) {
    console.log(`Checking category base: ${catUrl}`);
    for (let page = 1; page <= 10; page++) {
      const url = page === 1 ? catUrl : `${catUrl}page/${page}/`;
      const html = await fetchUrl(url);
      if (!html) break;

      const matches = html.match(/href=["'](https?:\/\/ep-equipment\.com\/product\/[^"']+)["']/g);
      if (!matches) {
        if (page > 1) break;
        continue;
      }

      let count = 0;
      for (const m of matches) {
        let link = m.replace(/href=["']/, '').replace(/["']$/, '').split('?')[0];
        if (link.endsWith('/')) link = link.slice(0, -1);
        if (!productLinks.has(link)) {
          productLinks.add(link);
          count++;
        }
      }
      console.log(`  Page ${page}: found ${count} new products`);
      if (count === 0 && page > 1) break;
    }
  }

  console.log(`Total unique products found across categories: ${productLinks.size}`);
  return Array.from(productLinks);
}

getProductLinks();
