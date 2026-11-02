/**
 * Catálogo EP em um só lugar: tipos de equipamento (uma página para cada), estatísticas calculadas dos
 * dados, modelos parecidos e a versão enxuta que o catálogo envia ao navegador. Sem "use client" nem `fs`:
 * serve a servidor e navegador.
 */
import forkliftsData from '@/lib/data/electric-forklifts.json'
import { formatLift } from '@/lib/product-seo'

export interface ForkliftProduct {
  id: string
  slug: string
  title: string
  subtitle: string
  category?: string
  categorySlug?: string
  type: string
  capacity: string
  liftingHeight: string
  batteryVoltage: string
  batteryType: string
  turningRadius: string
  travelSpeed: string
  description: string
  applications: string[]
  url: string
  mainImage: string
  galleryImages: string[]
  specs: Record<string, string | undefined>
  highlights: { title: string; desc: string }[]
}

/**
 * O que a lista do catálogo precisa de cada modelo. A ficha completa (especificações, galeria, destaques)
 * pesa 722 KB nos 222 modelos; só estes campos somam cerca de 90 KB e é o que vai no HTML de /produtos.
 */
export type CatalogItem = Pick<
  ForkliftProduct,
  'id' | 'slug' | 'title' | 'subtitle' | 'category' | 'categorySlug' | 'type' | 'capacity' | 'liftingHeight' | 'batteryVoltage' | 'batteryType' | 'mainImage'
> & {
  /** Acionamento da ficha ("Electric" ou "Diesel"): é ele que diz se a energia é bateria ou motor a diesel. */
  drive?: string
}

export const allProducts = forkliftsData as unknown as ForkliftProduct[]

export const toCatalogItem = (p: ForkliftProduct): CatalogItem => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  subtitle: p.subtitle,
  category: p.category,
  categorySlug: p.categorySlug,
  type: p.type,
  capacity: p.capacity,
  liftingHeight: p.liftingHeight,
  batteryVoltage: p.batteryVoltage,
  batteryType: p.batteryType,
  drive: p.specs?.Drive,
  mainImage: p.mainImage,
})

// ---------- leitura dos campos ----------

/** "1.500 kg" vira 1500; "12.500 mm" vira 12500. */
export const numberOf = (value: string | undefined): number => {
  const digits = (value ?? '').split('.').join('').match(/\d+/)?.[0]
  return digits ? parseInt(digits, 10) : 0
}

export const isDiesel = (p: Pick<ForkliftProduct, 'specs'>) => p.specs?.Drive === 'Diesel'

export const formatKg = (kg: number) => `${kg.toLocaleString('pt-BR')} kg`

/** Energia do modelo, como aparece na tabela: "24 V lítio", "48 V chumbo-ácido" ou "Diesel". */
export function energyLabel(p: Pick<ForkliftProduct, 'specs' | 'batteryVoltage' | 'batteryType'>): string {
  if (isDiesel(p)) return 'Diesel'
  return `${p.batteryVoltage} ${/chumbo/i.test(p.batteryType) ? 'chumbo-ácido' : 'lítio'}`
}

/** Alguns modelos trazem mais de um raio ("1360|1460 mm"): mostra separados por barra. */
export const turningLabel = (value: string | undefined) => (value ?? '').replace(/\|/g, ' / ')

// ---------- páginas por tipo ----------

export interface TypeStats {
  count: number
  minKg: number
  maxKg: number
  minLift: string
  maxLift: string
  lithium: number
  lead: number
  diesel: number
  selecionadoras: number
  rebocadores: number
}

export interface TypeFaq {
  q: string
  a: string
  /** Leitura que aprofunda a resposta; só com posts que já estão no ar. */
  link?: { href: string; label: string }
}

export interface TypePage {
  /** Parte do endereço: /produtos/tipo/<slug> */
  slug: string
  label: string
  /** Nome curto, para botões e listas de links. */
  short: string
  categorySlug: string
  /** Frase de busca que a página atende. */
  keyword: string
  intro: (stats: TypeStats) => string[]
  metaDescription: (stats: TypeStats) => string
  faq: (stats: TypeStats) => TypeFaq[]
  /** Posts do blog sobre o assunto (só os publicados). */
  reading: { href: string; label: string }[]
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
const batteries = (s: TypeStats) => {
  const parts: string[] = []
  if (s.lithium) parts.push(`${s.lithium} com bateria de lítio`)
  if (s.lead) parts.push(`${s.lead} com chumbo-ácido`)
  if (s.diesel) parts.push(`${s.diesel} a diesel`)
  return parts.join(', ').replace(/, ([^,]*)$/, ' e $1')
}

export const TYPE_PAGES: TypePage[] = [
  {
    slug: 'paleteiras-eletricas',
    label: 'Paleteiras elétricas',
    short: 'Paleteiras',
    categorySlug: 'paleteiras-eletricas',
    keyword: 'paleteira elétrica',
    intro: (s) => [
      'A paleteira elétrica leva o palete na horizontal: levanta a carga só o suficiente para tirá-la do chão e se desloca com motor, sem esforço do operador. Também é chamada de transpaleteira ou patinha elétrica.',
      'Serve para recebimento, expedição e abastecimento de linha, em piso regular. Ela não empilha: para colocar paletes em estantes, veja as empilhadeiras patoladas ou as retráteis.',
      `Neste catálogo são ${s.count} modelos, de ${formatKg(s.minKg)} a ${formatKg(s.maxKg)} de capacidade: ${batteries(s)}.`,
    ],
    metaDescription: (s) =>
      `Paleteiras elétricas EP Equipment de ${formatKg(s.minKg)} a ${formatKg(s.maxKg)}: compare capacidade, bateria e raio de giro de ${s.count} modelos e peça cotação na Venda Forte.`,
    faq: () => [
      {
        q: 'A paleteira elétrica empilha?',
        a: 'Não. Ela transporta o palete na horizontal e o levanta só o bastante para andar. Para colocar a carga em estantes, use uma empilhadeira patolada ou uma retrátil.',
      },
      {
        q: 'Como escolher a capacidade?',
        a: 'Pelo peso do palete carregado mais pesado da sua operação, com folga. A capacidade nominal das paleteiras EP vale para um centro de carga de 600 mm, com a carga bem apoiada no garfo.',
        link: { href: '/blog/capacidade-empilhadeira-centro-de-carga', label: 'Capacidade e centro de carga' },
      },
      {
        q: 'Lítio ou chumbo-ácido?',
        a: 'A bateria de lítio dispensa a manutenção de água e permite recarga rápida; a de chumbo-ácido costuma custar menos na compra. A escolha depende de quantos turnos a máquina trabalha e de como você carrega.',
        link: { href: '/blog/bateria-litio-vs-chumbo-acido-empilhadeiras', label: 'Bateria de lítio ou chumbo-ácido' },
      },
      {
        q: 'O que informar para pedir cotação?',
        a: 'O peso do palete carregado, a largura do corredor, a rampa mais íngreme que a máquina vai subir e o número de turnos. Com isso, o consultor indica o modelo certo.',
      },
    ],
    reading: [
      { href: '/blog/tipos-de-empilhadeira', label: 'Tipos de empilhadeira: qual usar em cada operação' },
      { href: '/blog/ep-f4-ficha-tecnica-explicada', label: 'EP F4: a ficha técnica explicada' },
    ],
  },
  {
    slug: 'empilhadeiras-patoladas',
    label: 'Empilhadeiras patoladas',
    short: 'Patoladas',
    categorySlug: 'empilhadeiras-patoladas',
    keyword: 'empilhadeira patolada',
    intro: (s) => [
      'A empilhadeira patolada, também chamada de stacker, é conduzida a pé e levanta o palete para empilhá-lo em estantes. As patolas são as pernas fixas na frente da máquina, que ficam dos dois lados do palete e dão estabilidade à carga levantada.',
      'Ela ocupa o espaço entre a paleteira, que só transporta, e a retrátil, que alcança prateleiras mais altas em corredor estreito. É a máquina de armazéns com prateleira baixa ou média, volume moderado e piso plano.',
      `Neste catálogo são ${s.count} modelos, de ${formatKg(s.minKg)} a ${formatKg(s.maxKg)}, com elevação de ${s.minLift} a ${s.maxLift}: ${batteries(s)}.`,
    ],
    metaDescription: (s) =>
      `Empilhadeiras patoladas EP Equipment de ${formatKg(s.minKg)} a ${formatKg(s.maxKg)}, elevação de ${s.minLift} a ${s.maxLift}: compare ${s.count} modelos e peça cotação na Venda Forte.`,
    faq: (s) => [
      {
        q: 'Patolada ou paleteira elétrica?',
        a: 'A paleteira só transporta o palete na horizontal. A patolada também o levanta a ponto de empilhar em estante. Se o palete nunca sobe do chão, a paleteira basta.',
      },
      {
        q: 'Patolada ou retrátil?',
        a: 'A patolada serve a prateleiras baixas e médias, em corredor mais largo. A retrátil trabalha em corredor estreito e alcança prateleiras muito mais altas, mas exige piso regular.',
        link: { href: '/blog/empilhadeira-retratil-ou-contrabalancada', label: 'Retrátil ou contrabalançada' },
      },
      {
        q: 'Até que altura a patolada levanta?',
        a: `Depende do modelo: de ${s.minLift} a ${s.maxLift} neste catálogo. A DS3 e a ESL122 chegam a cerca de 3 m.`,
        link: { href: '/blog/ep-ds3-ficha-tecnica-explicada', label: 'EP DS3: a ficha técnica explicada' },
      },
      {
        q: 'Semi-elétrica ou elétrica?',
        a: 'A semi-elétrica tem só a elevação elétrica, e o operador empurra a máquina; a elétrica também anda por motor. Todas as patoladas deste catálogo trazem motor de tração na ficha.',
      },
    ],
    reading: [
      { href: '/blog/tipos-de-empilhadeira', label: 'Tipos de empilhadeira: qual usar em cada operação' },
      { href: '/blog/ep-ds3-ficha-tecnica-explicada', label: 'EP DS3: a ficha técnica explicada' },
    ],
  },
  {
    slug: 'empilhadeiras-contrabalancadas',
    label: 'Empilhadeiras contrabalançadas',
    short: 'Contrabalançadas',
    categorySlug: 'empilhadeiras-eletricas',
    keyword: 'empilhadeira contrabalançada',
    intro: (s) => [
      'A empilhadeira contrabalançada leva a carga à frente das rodas dianteiras e usa o peso da própria máquina, com a bateria ou o motor atrás, como contrapeso. Anda e faz curva como um carro, entra em docas, sobe rampas e circula no pátio.',
      'É a máquina mais versátil do catálogo, dentro e fora do galpão, e a que cobre as maiores capacidades. Para corredores estreitos e prateleiras altas, a retrátil costuma ser a melhor escolha.',
      `São ${s.count} modelos, de ${formatKg(s.minKg)} a ${formatKg(s.maxKg)}, em versões de 3 e de 4 rodas: ${batteries(s)}.`,
    ],
    metaDescription: (s) =>
      `Empilhadeiras contrabalançadas EP Equipment de ${formatKg(s.minKg)} a ${formatKg(s.maxKg)}: compare ${s.count} modelos elétricos e a diesel e peça cotação na Venda Forte.`,
    faq: () => [
      {
        q: 'Contrabalançada ou retrátil?',
        a: 'A contrabalançada faz de tudo, dentro e fora do galpão, e carrega mais. A retrátil trabalha em corredor estreito e sobe mais alto, mas pede piso regular e uso interno.',
        link: { href: '/blog/empilhadeira-retratil-ou-contrabalancada', label: 'Retrátil ou contrabalançada: qual escolher?' },
      },
      {
        q: 'Elétrica ou a combustão?',
        a: 'A elétrica não emite gases e dispensa combustível; a combustão é mais usada em pátio externo e cargas muito pesadas. A diferença de custo ao longo dos anos depende do uso.',
        link: { href: '/blog/comparativo-custos-empilhadeira-eletrica-vs-glp', label: 'Elétrica de lítio ou GLP: custos em 5 anos' },
      },
      {
        q: 'Qual capacidade escolher?',
        a: 'A que cobre a carga mais pesada com folga, considerando o centro de carga e a altura de elevação, que reduzem a capacidade real da máquina.',
        link: { href: '/blog/capacidade-empilhadeira-centro-de-carga', label: 'Capacidade e centro de carga' },
      },
      {
        q: 'Lítio ou chumbo-ácido?',
        a: 'A bateria de lítio dispensa a sala de bateria e a manutenção de água; a de chumbo-ácido costuma custar menos na compra. A escolha depende de turnos e de como você carrega.',
        link: { href: '/blog/bateria-litio-vs-chumbo-acido-empilhadeiras', label: 'Bateria de lítio ou chumbo-ácido' },
      },
    ],
    reading: [
      { href: '/blog/tipos-de-empilhadeira', label: 'Tipos de empilhadeira: qual usar em cada operação' },
      { href: '/blog/ep-efl302-b3-ficha-tecnica-explicada', label: 'EP EFL302 B3: a ficha técnica explicada' },
    ],
  },
  {
    slug: 'empilhadeiras-retrateis',
    label: 'Empilhadeiras retráteis',
    short: 'Retráteis',
    categorySlug: 'empilhadeiras-retrateis',
    keyword: 'empilhadeira retrátil',
    intro: (s) => [
      'A empilhadeira retrátil trabalha em corredor estreito e alcança prateleiras altas: em vez de entrar no corredor com a carga na frente, ela avança o mastro para pegar o palete e o traz de volta para dentro da base.',
      'O preço dessa compactação são rodas pequenas e a necessidade de piso regular e de uso interno. Para pátio, rampa forte ou piso irregular, veja as contrabalançadas.',
      `Neste catálogo são ${s.count} modelos, de ${formatKg(s.minKg)} a ${formatKg(s.maxKg)}, com elevação de ${s.minLift} a ${s.maxLift}: ${batteries(s)}.`,
    ],
    metaDescription: (s) =>
      `Empilhadeiras retráteis EP Equipment de ${formatKg(s.minKg)} a ${formatKg(s.maxKg)}, elevação de ${s.minLift} a ${s.maxLift}: compare ${s.count} modelos e peça cotação na Venda Forte.`,
    faq: (s) => [
      {
        q: 'Quanto corredor a retrátil precisa?',
        a: 'Pelas fichas da EP, 2.726 mm na CQE15R e 2.835 mm na CQD20LB, para palete de 1.000 × 1.200 mm carregado de través. Uma contrabalançada de 3 t pede cerca de 4,1 m.',
        link: { href: '/blog/empilhadeira-retratil-ou-contrabalancada', label: 'Retrátil ou contrabalançada: qual escolher?' },
      },
      {
        q: 'Até que altura a retrátil levanta?',
        a: `Depende do modelo: de ${s.minLift} a ${s.maxLift} neste catálogo.`,
      },
      {
        q: 'Posso usar a retrátil no pátio?',
        a: 'Não é o indicado. As rodas pequenas e a compactação pedem piso regular e uso interno; no pátio, a contrabalançada trabalha melhor.',
      },
    ],
    reading: [
      { href: '/blog/empilhadeira-retratil-ou-contrabalancada', label: 'Empilhadeira retrátil ou contrabalançada: qual escolher?' },
      { href: '/blog/tipos-de-empilhadeira', label: 'Tipos de empilhadeira: qual usar em cada operação' },
    ],
  },
  {
    slug: 'selecionadoras-e-rebocadores',
    label: 'Selecionadoras de pedidos e rebocadores',
    short: 'Selecionadoras e rebocadores',
    categorySlug: 'selecionadoras-pedidos',
    keyword: 'selecionadora de pedidos',
    intro: (s) => [
      'Este grupo reúne dois equipamentos diferentes. A selecionadora de pedidos eleva o operador junto com a plataforma, para separar pedidos item a item nas prateleiras. O rebocador elétrico puxa carretas em comboio, levando carga entre recebimento, produção e expedição.',
      `São ${plural(s.count, 'modelo', 'modelos')} no catálogo: ${plural(s.selecionadoras, 'selecionadora', 'selecionadoras')} e ${plural(s.rebocadores, 'rebocador', 'rebocadores')}. ${batteries(s).replace(/^./, (c) => c.toUpperCase())}.`,
    ],
    metaDescription: (s) =>
      `Selecionadoras de pedidos e rebocadores elétricos EP Equipment: ${s.selecionadoras} selecionadoras e ${s.rebocadores} rebocadores. Compare os modelos e peça cotação na Venda Forte.`,
    faq: () => [
      {
        q: 'Selecionadora ou empilhadeira?',
        a: 'A selecionadora é feita para quem separa pedidos item a item, com o operador subindo junto com a carga. A empilhadeira movimenta paletes inteiros.',
        link: { href: '/blog/tipos-de-empilhadeira', label: 'Tipos de empilhadeira: qual usar em cada operação' },
      },
      {
        q: 'Rebocador ou empilhadeira?',
        a: 'O rebocador serve a quem leva muita carga em comboio por trajetos fixos, como do recebimento à linha de produção. A empilhadeira serve a quem levanta e empilha.',
      },
      {
        q: 'O que informar para pedir cotação?',
        a: 'Para a selecionadora: a altura das prateleiras e o número de pedidos por dia. Para o rebocador: o peso a rebocar, o trajeto e a rampa mais íngreme.',
      },
    ],
    reading: [{ href: '/blog/tipos-de-empilhadeira', label: 'Tipos de empilhadeira: qual usar em cada operação' }],
  },
]

export const typePageBySlug = (slug: string) => TYPE_PAGES.find((page) => page.slug === slug)

/** A página do tipo do modelo, se existir (o único modelo "especial/VNA" não tem página própria). */
export const typePageOf = (product: Pick<ForkliftProduct, 'categorySlug'>) =>
  TYPE_PAGES.find((page) => page.categorySlug === product.categorySlug)

export const productsOfType = (page: TypePage, products: ForkliftProduct[] = allProducts) =>
  products.filter((product) => product.categorySlug === page.categorySlug)

/** Estatísticas calculadas dos modelos de um tipo: os números dos textos vêm daqui, não de memória. */
export function statsOf(products: ForkliftProduct[]): TypeStats {
  const kg = products.map((p) => numberOf(p.capacity)).filter(Boolean)
  const lifts = products.map((p) => numberOf(p.liftingHeight)).filter(Boolean)
  return {
    count: products.length,
    minKg: Math.min(...kg),
    maxKg: Math.max(...kg),
    minLift: formatLift(`${Math.min(...lifts)} mm`),
    maxLift: formatLift(`${Math.max(...lifts)} mm`),
    lithium: products.filter((p) => !isDiesel(p) && !/chumbo/i.test(p.batteryType)).length,
    lead: products.filter((p) => /chumbo/i.test(p.batteryType)).length,
    diesel: products.filter(isDiesel).length,
    selecionadoras: products.filter((p) => p.type === 'Selecionadora de Pedidos').length,
    rebocadores: products.filter((p) => p.type === 'Rebocador Elétrico').length,
  }
}

export const TYPE_PAGE_SIZE = 24

/**
 * Modelos parecidos com o de uma ficha: do mesmo tipo (e da mesma energia, quando houver), os de
 * capacidade mais próxima. Sempre `count` modelos, para toda ficha ganhar os mesmos links.
 */
export function similarProducts(product: ForkliftProduct, count = 4, products: ForkliftProduct[] = allProducts): ForkliftProduct[] {
  const capacity = numberOf(product.capacity)
  const distance = (p: ForkliftProduct) => Math.abs(numberOf(p.capacity) - capacity)
  const sameType = products.filter((p) => p.slug !== product.slug && p.categorySlug === product.categorySlug)
  const sameEnergy = sameType.filter((p) => isDiesel(p) === isDiesel(product))
  const pool = sameEnergy.length >= count ? sameEnergy : sameType
  return [...pool].sort((a, b) => distance(a) - distance(b) || a.slug.localeCompare(b.slug)).slice(0, count)
}

/**
 * Post do blog que explica a ficha do modelo, quando existe e está no ar. Os de ESL122, CQD20LB, JX1,
 * TVL151 e TVL181 entram aqui assim que forem publicados.
 */
const MODEL_GUIDES: Record<string, { href: string; label: string }> = {
  f4: { href: '/blog/ep-f4-ficha-tecnica-explicada', label: 'Leia a ficha técnica da EP F4 explicada' },
  ds3: { href: '/blog/ep-ds3-ficha-tecnica-explicada', label: 'Leia a ficha técnica da EP DS3 explicada' },
  efl302b3: { href: '/blog/ep-efl302-b3-ficha-tecnica-explicada', label: 'Leia a ficha técnica da EP EFL302 B3 explicada' },
}

export const guideFor = (slug: string) => MODEL_GUIDES[slug]
