const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
      } 
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) redirectUrl = 'https://ep-equipment.com' + redirectUrl;
        return fetchUrl(redirectUrl).then(resolve);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

// All major category endpoints specified by EP equipment
const CATEGORY_MAP = [
  {
    name: 'Paleteiras Elétricas',
    slug: 'paleteiras-eletricas',
    typeDefault: 'Paleteira Elétrica',
    urls: [
      'https://ep-equipment.com/product-category/electric-pallet-trucks/'
    ]
  },
  {
    name: 'Empilhadeiras Patoladas (Stackers)',
    slug: 'empilhadeiras-patoladas',
    typeDefault: 'Empilhadeira Patolada (Stacker)',
    urls: [
      'https://ep-equipment.com/product-category/stackers/'
    ]
  },
  {
    name: 'Empilhadeiras Contrabalançadas',
    slug: 'empilhadeiras-eletricas',
    typeDefault: 'Empilhadeira Contrabalançada',
    urls: [
      'https://ep-equipment.com/product-category/electric-forklifts/',
      'https://ep-equipment.com/product-category/ic-forklifts/'
    ]
  },
  {
    name: 'Empilhadeiras Retráteis (Reach Trucks)',
    slug: 'empilhadeiras-retrateis',
    typeDefault: 'Empilhadeira Retrátil (Reach Truck)',
    urls: [
      'https://ep-equipment.com/product-category/reach-trucks/'
    ]
  },
  {
    name: 'Selecionadoras de Pedidos & Rebocadores',
    slug: 'selecionadoras-pedidos',
    typeDefault: 'Selecionadora de Pedidos',
    urls: [
      'https://ep-equipment.com/product-category/order-pickers/',
      'https://ep-equipment.com/product-category/tow-tractors/'
    ]
  },
  {
    name: 'Equipamentos Especiais & VNA',
    slug: 'equipamentos-especiais',
    typeDefault: 'Equipamento Especial / VNA',
    urls: [
      'https://ep-equipment.com/product-category/very-narrow-aisle-trucks/',
      'https://ep-equipment.com/product-category/autonomous-guided-vehicles/'
    ]
  }
];

// Seed main URLs to crawl extra links from
const SEED_URLS = [
  'https://ep-equipment.com/products/',
  'https://ep-equipment.com/warehouse-equipment/',
  'https://ep-equipment.com/product-category/electric-forklifts/'
];

function formatCapacity(rawCap) {
  if (!rawCap) return '1.500 kg';
  const clean = rawCap.replace(/,/g, '.').replace(/\s+/g, '');
  const numMatch = clean.match(/(\d+(\.\d+)?)/);
  if (!numMatch) return rawCap;
  let val = parseFloat(numMatch[1]);
  if (val < 50) { // e.g. 1.5, 2.0, 3.0 tons
    val = Math.round(val * 1000);
  }
  return `${val.toLocaleString('pt-BR')} kg`;
}

function formatLift(rawLift) {
  if (!rawLift) return '3.000 mm';
  const clean = rawLift.replace(/,/g, '.').replace(/\s+/g, '');
  const numMatch = clean.match(/(\d+(\.\d+)?)/);
  if (!numMatch) return rawLift;
  let val = parseFloat(numMatch[1]);
  if (val < 20) { // e.g. 3.0, 4.5, 6.0 meters
    val = Math.round(val * 1000);
  }
  return `${val.toLocaleString('pt-BR')} mm`;
}

function formatVoltage(rawVolt, title) {
  if (rawVolt && rawVolt.toLowerCase().includes('80')) return '80 V';
  if (rawVolt && rawVolt.toLowerCase().includes('48')) return '48 V';
  if (rawVolt && rawVolt.toLowerCase().includes('24')) return '24 V';
  if (title.toLowerCase().includes('80')) return '80 V';
  if (title.toLowerCase().includes('48')) return '48 V';
  if (title.toLowerCase().includes('24')) return '24 V';
  return rawVolt || '24 V';
}

async function run() {
  console.log('=== Crawling EP Equipment Site ===');
  const productMap = new Map(); // productLink -> catObj

  // 1. Scan categories and pagination
  for (const cat of CATEGORY_MAP) {
    for (const catUrl of cat.urls) {
      console.log(`Scanning category URL: ${catUrl}`);
      for (let page = 1; page <= 15; page++) {
        const url = page === 1 ? catUrl : `${catUrl}page/${page}/`;
        const html = await fetchUrl(url);
        if (!html) break;

        const matches = html.match(/href=["'](https?:\/\/ep-equipment\.com\/product\/[^"']+)["']/g);
        if (!matches) {
          if (page > 1) break;
          continue;
        }

        let added = 0;
        for (const m of matches) {
          let link = m.replace(/href=["']/, '').replace(/["']$/, '').split('?')[0];
          if (!link.endsWith('/')) link += '/';
          if (!productMap.has(link)) {
            productMap.set(link, cat);
            added++;
          }
        }
        console.log(`  Page ${page}: +${added} products`);
        if (added === 0 && page > 1) break;
      }
    }
  }

  // 2. Scan seed pages for any extra product links
  for (const seedUrl of SEED_URLS) {
    console.log(`Scanning seed URL: ${seedUrl}`);
    const html = await fetchUrl(seedUrl);
    if (html) {
      const matches = html.match(/href=["'](https?:\/\/ep-equipment\.com\/product\/[^"']+)["']/g) || [];
      for (const m of matches) {
        let link = m.replace(/href=["']/, '').replace(/["']$/, '').split('?')[0];
        if (!link.endsWith('/')) link += '/';
        if (!productMap.has(link)) {
          // Default to Paleteiras or Forklifts based on slug if unknown
          let fallbackCat = CATEGORY_MAP[0];
          if (link.includes('forklift') || link.includes('efl') || link.includes('cpd') || link.includes('tvl') || link.includes('tcl')) {
            fallbackCat = CATEGORY_MAP[2];
          } else if (link.includes('stacker') || link.includes('es') || link.includes('ds')) {
            fallbackCat = CATEGORY_MAP[1];
          }
          productMap.set(link, fallbackCat);
          console.log(`  Found extra product link from seed: ${link}`);
        }
      }
    }
  }

  console.log(`\nFound total unique product links to scrape: ${productMap.size}`);

  const products = [];
  let index = 0;

  // Fetch product pages in concurrent batches of 15
  const CONCURRENCY = 15;
  const entries = Array.from(productMap.entries());
  
  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    const batch = entries.slice(i, i + CONCURRENCY);
    console.log(`Processing batch ${i + 1} to ${Math.min(i + CONCURRENCY, entries.length)} of ${entries.length}...`);

    await Promise.all(batch.map(async ([link, cat]) => {
      const parts = link.replace(/\/$/, '').split('/');
      const slug = parts[parts.length - 1];

      const html = await fetchUrl(link);
      if (!html) return;

      // H1 Title
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      let title = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : slug.toUpperCase();
      if (!title || title.toLowerCase().includes('gone') || title.toLowerCase().includes('error') || title.toLowerCase().includes('404')) return;

      // Specs parsing
      const specs = {};
      const trMatches = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
      for (const tr of trMatches) {
        const tdMatches = tr.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi);
        if (tdMatches && tdMatches.length >= 2) {
          const k = tdMatches[0].replace(/<[^>]+>/g, '').trim();
          const v = tdMatches[1].replace(/<[^>]+>/g, '').trim();
          if (k && v && k.toLowerCase() !== 'name' && k.length < 50) {
            specs[k] = v;
          }
        }
      }

      // Images
      const rawImgs = html.match(/(https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png))/gi) || [];
      const epImgs = [...new Set(rawImgs.filter(u => 
        (u.includes('cdn.ep-portal.net') || u.includes('wp-content/uploads')) && 
        !u.includes('logo') && !u.includes('icon') && !u.includes('flag') && !u.includes('badge') && !u.endsWith('.svg')
      ))];

      let mainImage = epImgs.find(i => i.includes('attr_5')) || epImgs[0] || 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp';
      let galleryImages = epImgs.filter(i => i !== mainImage).slice(0, 6);

      const rawCap = specs['Rated capacity'] || specs['Capacity'] || specs['Load Capacity'] || specs['Rated Load Capacity'];
      const rawLift = specs['Max lift height'] || specs['Lift height'] || specs['Lift'] || specs['Max. lift height'];
      const rawVolt = specs['Battery voltage'] || specs['Voltage'] || specs['Battery'];
      const rawBattType = specs['Battery type'] || 'Li-Ion';
      const rawRadius = specs['Turning radius'] || specs['Turning Radius'] || '1.350 mm';
      const rawSpeed = specs['Travel speed, laden/unladen'] || specs['Travel Speed'] || '4.5 / 5.0 km/h';

      const capacity = formatCapacity(rawCap);
      const liftingHeight = formatLift(rawLift);
      const batteryVoltage = formatVoltage(rawVolt, title);

      // Refine product type based on category and title
      const lowerTitle = title.toLowerCase();
      let productType = cat.typeDefault;

      if (cat.slug === 'empilhadeiras-eletricas') {
        if (lowerTitle.includes('3') || lowerTitle.startsWith('tvl') || lowerTitle.startsWith('tcl') || lowerTitle.startsWith('efs') || lowerTitle.includes('3-wheel')) {
          productType = '3 Rodas Li-Ion';
        } else {
          productType = '4 Rodas Li-Ion';
        }
      } else if (cat.slug === 'paleteiras-eletricas') {
        productType = 'Paleteira Elétrica';
      } else if (cat.slug === 'empilhadeiras-patoladas') {
        productType = 'Empilhadeira Patolada (Stacker)';
      } else if (cat.slug === 'empilhadeiras-retrateis') {
        productType = 'Empilhadeira Retrátil (Reach Truck)';
      } else if (cat.slug === 'selecionadoras-pedidos') {
        if (lowerTitle.includes('qdd') || lowerTitle.includes('tow') || lowerTitle.includes('rebocador')) {
          productType = 'Rebocador Elétrico';
        } else {
          productType = 'Selecionadora de Pedidos';
        }
      } else if (cat.slug === 'equipamentos-especiais') {
        productType = lowerTitle.includes('agv') || lowerTitle.includes('amr') ? 'Veículo Autônomo (AGV/AMR)' : 'Empilhadeira VNA / Especial';
      }

      let categoryPTName = 'Equipamento Industrial';
      if (cat.slug === 'paleteiras-eletricas') categoryPTName = 'Paleteira Elétrica';
      else if (cat.slug === 'empilhadeiras-patoladas') categoryPTName = 'Empilhadeira Patolada';
      else if (cat.slug === 'empilhadeiras-eletricas') categoryPTName = 'Empilhadeira Contrabalançada';
      else if (cat.slug === 'empilhadeiras-retrateis') categoryPTName = 'Empilhadeira Retrátil';
      else if (cat.slug === 'selecionadoras-pedidos') categoryPTName = 'Selecionadora / Rebocador';
      else if (cat.slug === 'equipamentos-especiais') categoryPTName = 'Equipamento Especial';

      const subtitle = `${categoryPTName} EP ${title} • ${capacity}`;
      const description = `A ${categoryPTName.toLowerCase()} EP ${title} é projetada para entregar alta performance, máxima ergonomia e eficiência operacional com tecnologia de bateria Íon-Lítio.`;

      products.push({
        id: slug,
        slug: slug,
        title: title,
        subtitle: subtitle,
        category: cat.name,
        categorySlug: cat.slug,
        type: productType,
        capacity: capacity,
        liftingHeight: liftingHeight,
        batteryVoltage: batteryVoltage,
        batteryType: rawBattType.includes('Lead') ? 'Chumbo-Ácido' : 'Li-Ion',
        turningRadius: rawRadius,
        travelSpeed: rawSpeed,
        description: description,
        applications: [
          "Centros de distribuição e logística",
          "Operação contínua com bateria Íon-Lítio",
          "Movimentação e estocagem pesada"
        ],
        url: link,
        mainImage: mainImage,
        galleryImages: galleryImages,
        specs: specs,
        highlights: [
          { title: "Tecnologia Li-Ion EP", desc: "Bateria de lítio sem manutenção de água e recarga oportuna rápida." },
          { title: "Alta Eficiência & Ergonomia", desc: "Comandos precisos, facilidade de operação e baixo consumo energético." },
          { title: "Segurança Certificada", desc: "Estrutura reforçada, frenagem automática e excelente visibilidade para o operador." },
          { title: "Garantia Venda Forte", desc: "Atendimento especializado, peças de reposição e suporte completo." }
        ]
      });
    }));
  }

  const jsonPath = path.join(__dirname, '..', 'lib', 'data', 'electric-forklifts.json');
  fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf-8');

  console.log(`\n==================================================`);
  console.log(`CRAWL COMPLETED! Total ${products.length} products saved to JSON.`);
  console.log(`==================================================`);
}

run();
