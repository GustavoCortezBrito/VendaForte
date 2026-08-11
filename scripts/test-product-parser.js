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

async function testParse(url) {
  console.log(`--- Fetching ${url} ---`);
  const html = await fetchUrl(url);
  if (!html) {
    console.log('Failed to fetch');
    return;
  }

  // H1 title
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  // Breadcrumbs or categories
  const catMatches = html.match(/product-category\/([^/"']+)/g);
  const cats = catMatches ? [...new Set(catMatches.map(c => c.replace('product-category/', '')))] : [];

  // Specs table
  const specs = {};
  const trMatches = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  for (const tr of trMatches) {
    const tdMatches = tr.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi);
    if (tdMatches && tdMatches.length >= 2) {
      const k = tdMatches[0].replace(/<[^>]+>/g, '').trim();
      const v = tdMatches[1].replace(/<[^>]+>/g, '').trim();
      if (k && v && k.toLowerCase() !== 'name') {
        specs[k] = v;
      }
    }
  }

  // Images
  const imgMatches = html.match(/(https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png))/gi) || [];
  const validImgs = [...new Set(imgMatches.filter(u => 
    (u.includes('cdn.ep-portal.net') || u.includes('wp-content/uploads')) && 
    !u.includes('logo') && !u.includes('icon') && !u.includes('flag') && !u.includes('badge')
  ))];

  console.log('Title:', title);
  console.log('Categories:', cats);
  console.log('Specs Count:', Object.keys(specs).length);
  console.log('Key specs:', {
    Capacity: specs['Rated capacity'] || specs['Capacity'] || specs['Load Capacity'],
    Lift: specs['Max lift height'] || specs['Lift height'] || specs['Lift'],
    Voltage: specs['Battery voltage'] || specs['Voltage'],
    Wheels: specs['Wheels']
  });
  console.log('Images Found:', validImgs.slice(0, 3));
}

async function run() {
  await testParse('https://ep-equipment.com/product/ds3/');
  await testParse('https://ep-equipment.com/product/f4-2t/');
  await testParse('https://ep-equipment.com/product/efl302b3/');
}

run();
