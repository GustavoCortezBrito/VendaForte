const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

const CATEGORIES = [
  {
    name: 'Paleteiras Elétricas',
    slug: 'paleteiras-eletricas',
    typeDefault: 'Paleteira Elétrica',
    url: 'https://ep-equipment.com/product-category/electric-pallet-trucks/'
  },
  {
    name: 'Empilhadeiras Patoladas',
    slug: 'empilhadeiras-patoladas',
    typeDefault: 'Empilhadeira Patolada (Stacker)',
    url: 'https://ep-equipment.com/product-category/stackers/'
  },
  {
    name: 'Empilhadeiras Elétricas',
    slug: 'empilhadeiras-eletricas',
    typeDefault: 'Elétrica Contrabalançada',
    url: 'https://ep-equipment.com/product-category/electric-forklifts/'
  },
  {
    name: 'Selecionadoras de Pedidos',
    slug: 'selecionadoras-pedidos',
    typeDefault: 'Selecionadora de Pedidos',
    url: 'https://ep-equipment.com/product-category/order-pickers/'
  }
];

function formatCapacity(rawCap) {
  if (!rawCap) return '1.500 kg';
  const num = rawCap.replace(/\./g, '').match(/\d+/);
  if (!num) return rawCap;
  const val = parseInt(num[0], 10);
  return `${val.toLocaleString('pt-BR')} kg`;
}

function formatLift(rawLift) {
  if (!rawLift) return '3.000 mm';
  const num = rawLift.replace(/\./g, '').match(/\d+/);
  if (!num) return rawLift;
  const val = parseInt(num[0], 10);
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
  console.log('=== Starting Full EP Equipment Catalog Crawler ===');
  const productMap = new Map(); // link -> catInfo

  for (const cat of CATEGORIES) {
    console.log(`\nScanning category: ${cat.name}`);
    for (let page = 1; page <= 12; page++) {
      const url = page === 1 ? cat.url : `${cat.url}page/${page}/`;
      const html = await fetchUrl(url);
      if (!html) break;

      const matches = html.match(/href=["'](https?:\/\/ep-equipment\.com\/product\/[^"']+)["']/g);
      if (!matches) {
        if (page > 1) break;
        continue;
      }

      let newCount = 0;
      for (const m of matches) {
        let link = m.replace(/href=["']/, '').replace(/["']$/, '').split('?')[0];
        if (!link.endsWith('/')) link = link + '/';
        if (!productMap.has(link)) {
          productMap.set(link, cat);
          newCount++;
        }
      }
      console.log(`  Page ${page}: ${newCount} products added`);
      if (newCount === 0 && page > 1) break;
    }
  }

  console.log(`\nTotal unique product pages to fetch: ${productMap.size}`);

  const products = [];
  let index = 0;

  for (const [link, cat] of productMap.entries()) {
    index++;
    const parts = link.replace(/\/$/, '').split('/');
    const slug = parts[parts.length - 1];
    console.log(`[${index}/${productMap.size}] Processing ${slug}...`);

    const html = await fetchUrl(link);
    if (!html) continue;

    // Title
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    let title = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : slug.toUpperCase();
    if (!title || title.toLowerCase().includes('gone') || title.toLowerCase().includes('error') || title.toLowerCase().includes('whoops')) continue;

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
    const rawImgs = html.match(/(https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png))/gi) || [];
    const epImgs = [...new Set(rawImgs.filter(u => 
      (u.includes('cdn.ep-portal.net') || u.includes('wp-content/uploads')) && 
      !u.includes('logo') && !u.includes('icon') && !u.includes('flag') && !u.includes('badge') && !u.endsWith('.svg')
    ))];

    // Priority for main image: attr_5 or main product WebP
    let mainImage = epImgs.find(i => i.includes('attr_5')) || epImgs[0] || 'https://cdn.ep-portal.net/products/attr_5/1758185452375-2j5v1u.webp';
    let galleryImages = epImgs.filter(i => i !== mainImage).slice(0, 6);

    // Specs fields
    const rawCap = specs['Rated capacity'] || specs['Capacity'] || specs['Load Capacity'] || specs['Rated Load Capacity'];
    const rawLift = specs['Max lift height'] || specs['Lift height'] || specs['Lift'] || specs['Max. lift height'];
    const rawVolt = specs['Battery voltage'] || specs['Voltage'] || specs['Battery'];
    const rawBattType = specs['Battery type'] || 'Li-Ion';
    const rawRadius = specs['Turning radius'] || specs['Turning Radius'] || '1.350 mm';
    const rawSpeed = specs['Travel speed, laden/unladen'] || specs['Travel Speed'] || '4.5 / 5.0 km/h';

    const capacity = formatCapacity(rawCap);
    const liftingHeight = formatLift(rawLift);
    const batteryVoltage = formatVoltage(rawVolt, title);

    // Type classification refinement
    let productType = cat.typeDefault;
    const lowerTitle = title.toLowerCase();

    if (cat.slug === 'empilhadeiras-eletricas') {
      if (lowerTitle.includes('3') || lowerTitle.startsWith('tvl') || lowerTitle.startsWith('tcl') || lowerTitle.startsWith('efs')) {
        productType = '3 Rodas Li-Ion';
      } else {
        productType = '4 Rodas Li-Ion';
      }
    } else if (cat.slug === 'paleteiras-eletricas') {
      productType = 'Paleteira Elétrica';
    } else if (cat.slug === 'empilhadeiras-patoladas') {
      productType = 'Empilhadeira Patolada (Stacker)';
    }

    // Subtitle
    let categoryPTName = cat.name.slice(0, -1); // remove 's'
    if (cat.slug === 'empilhadeiras-eletricas') categoryPTName = 'Empilhadeira Elétrica';
    if (cat.slug === 'paleteiras-eletricas') categoryPTName = 'Paleteira Elétrica';
    if (cat.slug === 'empilhadeiras-patoladas') categoryPTName = 'Empilhadeira Patolada';
    if (cat.slug === 'selecionadoras-pedidos') categoryPTName = 'Selecionadora de Pedidos';

    const subtitle = `${categoryPTName} EP ${title} • ${capacity}`;
    const description = `A ${categoryPTName.toLowerCase()} EP ${title} é projetada para entregar alta performance, segurança e máxima eficiência operacional com bateria Li-Ion recarregável.`;

    const item = {
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
        "Centros de distribuição e armazenagem",
        "Carga, descarga e movimentação interna",
        "Operação contínua com bateria Íon-Lítio"
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
    };

    products.push(item);
  }

  const jsonPath = path.join(__dirname, '..', 'lib', 'data', 'electric-forklifts.json');
  fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf-8');

  console.log(`\n==================================================`);
  console.log(`SUCCESS! Total ${products.length} products saved to:`);
  console.log(jsonPath);
  console.log(`==================================================`);
}

run();
