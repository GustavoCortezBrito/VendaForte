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
  specs?: Record<string, string | undefined>
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

/** A ficha da EP diz como a máquina é movida: nos modelos a diesel o catálogo traz "24 V, Li-Ion" por engano. */
export const isDiesel = (p: Pick<ProductLike, 'specs'>) => p.specs?.Drive === 'Diesel'

/** "bateria 48 V (lítio)" ou "motor a diesel", conforme o modelo. */
export const powerText = (p: ProductLike) =>
  isDiesel(p) ? 'motor a diesel' : `bateria ${p.batteryVoltage} (${batteryKind(p.batteryType)})`

/** Título único por modelo (absoluto: já leva a marca, para não repeti-la). */
export const productTitle = (p: ProductLike) => `EP ${p.title} ${p.capacity}: ${typeLabel(p.type)} | Venda Forte`

/** Descrição de até 160 caracteres, com o tipo de bateria real do modelo. */
export function productDescription(p: ProductLike): string {
  const base = `EP ${p.title}: ${typeLabel(p.type).toLowerCase()} de ${p.capacity}, elevação de ${formatLift(p.liftingHeight)}, ${powerText(p)}.`
  const full = `${base} Veja a ficha técnica e peça cotação.`
  return full.length <= 160 ? full : base.slice(0, 157).trimEnd() + '...'
}

/**
 * Só a BreadcrumbList. O Product exige `offers`, `review` ou `aggregateRating`; o site não publica preço
 * (e preço inventado viola a política do Google), então o Product só gerava erro nos dados estruturados.
 */
export function productJsonLd(p: ProductLike, typeCrumb?: { name: string; path: string }) {
  const url = `${SITE_URL}/produtos/${p.slug}`
  const trail = [
    { name: 'Início', item: SITE_URL },
    { name: 'Produtos', item: `${SITE_URL}/produtos` },
    ...(typeCrumb ? [{ name: typeCrumb.name, item: `${SITE_URL}${typeCrumb.path}` }] : []),
    { name: `EP ${p.title}`, item: url },
  ]
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((step, index) => ({ '@type': 'ListItem', position: index + 1, ...step })),
    },
  ]
}

// ---------- texto de abertura da ficha ----------

const mm = (n: number) => `${n.toLocaleString('pt-BR')} mm`
const dec = (value: string) => value.replace('.', ',')

/** Lê um campo da ficha só se ele tiver o formato esperado; valores múltiplos ("1242|1340 kg") ficam de fora. */
const spec = (p: ProductLike, key: string, pattern: RegExp): RegExpMatchArray | null => {
  const value = p.specs?.[key]
  return value ? value.trim().match(pattern) : null
}

const OPERATOR: Record<string, string> = {
  Seated: 'o operador conduz sentado',
  Pedestrian: 'a máquina é conduzida a pé',
  Standing: 'o operador conduz em pé',
  'Stand-on': 'o operador conduz em pé, na plataforma',
  'Order-picker': 'o operador sobe junto com a plataforma, para separar pedidos',
}

/** Frases de aplicação escritas para modelos que o Google já mostra nas buscas. Usam só dados da própria ficha. */
const MODEL_NOTES: Record<string, (p: ProductLike) => string> = {
  f4: () => 'A bateria de lítio é removível e pesa só 5 kg, e a máquina aceita uma segunda bateria para maior autonomia.',
  esl122: (p) => `Atende a quem precisa empilhar em estantes de até cerca de ${formatLift(p.liftingHeight)} com uma máquina compacta, em piso plano.`,
  cqd20lb: (p) => `Atende a armazéns com porta-paletes de até ${formatLift(p.liftingHeight)}, em corredor estreito e piso regular.`,
  jx1: (p) => `Atende a quem separa pedidos item a item, com elevação de até cerca de ${formatLift(p.liftingHeight)}.`,
  tvl151: () => 'É da mesma linha da TVL181, que levanta 1.800 kg.',
  tvl181: () => 'É da mesma linha da TVL151, que levanta 1.500 kg.',
}

/**
 * Parágrafos de abertura da ficha, montados com os dados reais do modelo. Substituem o texto padrão do
 * catálogo, igual em 212 fichas e com a bateria errada nos modelos a diesel e de chumbo-ácido.
 */
export function productIntro(p: ProductLike): string[] {
  const radius = p.turningRadius && /^\d+ mm$/.test(p.turningRadius.trim()) ? mm(parseInt(p.turningRadius, 10)) : ''
  const lead = `A EP ${p.title} (${typeLabel(p.type).toLowerCase()}) tem capacidade de ${p.capacity}, elevação de ${formatLift(p.liftingHeight)}, ${powerText(p)}${radius ? ` e raio de giro de ${radius}` : ''}.`

  const facts: string[] = []
  const weight = spec(p, 'Service weight', /^(\d+) kg$/)
  if (weight) facts.push(`pesa ${parseInt(weight[1], 10).toLocaleString('pt-BR')} kg`)
  const speed = spec(p, 'Travel speed, laden/unladen', /^(\d+(?:\.\d)?) ?\/ ?(\d+(?:\.\d)?) km\/h$/)
  if (speed) facts.push(`anda a ${dec(speed[1])} km/h com carga e ${dec(speed[2])} km/h sem carga`)
  const ramp = spec(p, 'Max. gradeability, laden/unladen', /^(\d+(?:\.\d)?) ?\/ ?(\d+(?:\.\d)?) ?%$/)
  if (ramp) facts.push(`vence rampa de ${dec(ramp[1])}% com carga e ${dec(ramp[2])}% sem carga`)
  const aisle = spec(p, 'Aisle width for pallets 1000×1200 crossways', /^(\d+) mm$/)
  if (aisle) facts.push(`pede corredor de ${mm(parseInt(aisle[1], 10))} para palete de 1.000 × 1.200 mm carregado de través`)

  const paragraphs = [lead]
  const operator = OPERATOR[p.specs?.['Operator type'] ?? '']
  if (operator) paragraphs.push(`Pela ficha da EP, ${operator}.`)
  if (facts.length) {
    const list = facts.join(', ').replace(/, ([^,]*)$/, ' e $1')
    paragraphs.push(`${operator ? 'A máquina' : 'Pela ficha da EP, a máquina'} ${list}.`)
  }

  const battery = spec(p, 'Battery nominal capacity K5', /^(\d+) Ah$/)
  const batteryWeight = spec(p, 'Battery weight', /^(\d+(?:\.\d)?) kg$/)
  if (!isDiesel(p) && battery && batteryWeight) {
    paragraphs.push(`A bateria tem ${battery[1]} Ah e pesa ${dec(batteryWeight[1])} kg.`)
  }

  const note = MODEL_NOTES[p.slug]
  if (note) paragraphs.push(note(p))
  return paragraphs
}
