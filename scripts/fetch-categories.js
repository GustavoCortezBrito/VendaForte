const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

async function run() {
  try {
    const html = await fetchUrl('https://ep-equipment.com/products/');
    const matches = html.match(/href=["'](https?:\/\/ep-equipment\.com\/product-category\/[^"']+)["']/g);
    if (matches) {
      const categories = [...new Set(matches.map(m => m.replace(/href=["']/, '').replace(/["']$/, '')))];
      console.log('Product Categories Found:');
      categories.forEach(c => console.log('-', c));
    } else {
      console.log('No categories matched on /products/');
    }
  } catch (err) {
    console.error(err);
  }
}

run();
