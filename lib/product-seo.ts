/**
 * Títulos, descrições e dados estruturados das páginas de produto. Ficam num módulo comum
 * para a página (servidor) e o catálogo (navegador) usarem os mesmos nomes de tipo.
 */
import { SITE_URL } from '@/lib/site'

interface ProductLike {
  slug: string
  title: string
  subtitle?: string
  type: string
  category?: string
  capacity: string
  liftingHeight: string
  batteryVoltage: string
  batteryType: string
  turningRadius?: string
  description: string
  mainImage: string
}

/** Nome do tipo em português, mostrado no cartão, no título e na descrição. */
export const TYPE_LABELS: Record<string, string> = {
  'Paleteira Elétrica': 'Paleteira elétrica',
  'Empilhadeira Patolada (Stacker)': 'Empilhadeira patolada',
  // A contagem de rodas no catálogo da EP é inconsistente (a EFL302 B3 aparece como 3 rodas e tem 4): não a afirmamos
  '3 Rodas Li-Ion': 'Empilhadeira contrabalançada',
  '4 Rodas Li-Ion': 'Empilhadeira contrabalançada',
  'Empilhadeira Retrátil (Reach Truck)': 'Empilhadeira retrátil',
  'Selecionadora de Pedidos': 'Selecionadora de pedidos',
  'Empilhadeira VNA / Especial': 'Corredor estreito (VNA)',
  'Rebocador Elétrico': 'Rebocador elétrico',
}

export const typeLabel = (type: string): string => TYPE_LABELS[type] ?? type

/** "7.500 mm" vira "7,5 m"; alturas pequenas (paleteiras) seguem em mm. */
export function formatLift(value: string): string {
  // Tira o ponto de milhar ("7.500") antes de ler o número
  const mm = parseInt((value || '').split('.').join('').match(/[0-9]+/)?.[0] ?? '', 10)
  if (!mm) return value
  return mm >= 1000 ? `${(mm / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} m` : `${mm} mm`
}

const batteryKind = (batteryType: string) =>
  /li/i.test(batteryType) ? 'lítio' : /chumbo/i.test(batteryType) ? 'chumbo-ácido' : batteryType.toLowerCase()

/** Título único por modelo (absoluto: já leva a marca, para não repeti-la). */
export const productTitle = (p: ProductLike) => `EP ${p.title} ${p.capacity}: ${typeLabel(p.type)} | Venda Forte`

/** Descrição de até 160 caracteres, com o tipo de bateria real do modelo. */
export function productDescription(p: ProductLike): string {
  const base = `EP ${p.title}: ${typeLabel(p.type).toLowerCase()} de ${p.capacity}, elevação de ${formatLift(p.liftingHeight)}, bateria ${p.batteryVoltage} (${batteryKind(p.batteryType)}).`
  const full = `${base} Veja a ficha técnica e peça cotação.`
  return full.length <= 160 ? full : base.slice(0, 157).trimEnd() + '...'
}

const absolute = (src: string) => (src.startsWith('http') ? src : `${SITE_URL}${src}`)

/** Product e BreadcrumbList do modelo. Sem `offers`: o site não publica preço, e preço inventado viola a política do Google. */
export function productJsonLd(p: ProductLike, photos: string[] = []) {
  const url = `${SITE_URL}/produtos/${p.slug}`
  const images = [...photos.slice(0, 4), p.mainImage].filter(Boolean).map(absolute)
  const prop = (name: string, value: string) => ({ '@type': 'PropertyValue', name, value })
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `EP ${p.title}`,
      // Descrição própria: o texto do catálogo diz "Íon-Lítio" também nos modelos de chumbo-ácido
      description: productDescription(p),
      sku: p.slug,
      mpn: p.title,
      url,
      image: images,
      category: typeLabel(p.type),
      brand: { '@type': 'Brand', name: 'EP Equipment' },
      additionalProperty: [
        prop('Capacidade de carga', p.capacity),
        prop('Elevação máxima', formatLift(p.liftingHeight)),
        prop('Bateria', `${p.batteryVoltage}, ${batteryKind(p.batteryType)}`),
        ...(p.turningRadius ? [prop('Raio de giro', p.turningRadius)] : []),
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Produtos', item: `${SITE_URL}/produtos` },
        { '@type': 'ListItem', position: 3, name: `EP ${p.title}`, item: url },
      ],
    },
  ]
}
