/**
 * Dicionário de tradução e categorização para Fichas Técnicas da EP Equipment
 */

export interface FormattedSpecGroup {
  id: string
  title: string
  iconName: 'Zap' | 'Ruler' | 'Battery' | 'Truck' | 'Settings'
  items: { label: string; value: string }[]
}

const SPEC_LABELS_PT: Record<string, string> = {
  "Manufacturer": "Fabricante",
  "Model designation": "Modelo do Equipamento",
  "Drive": "Tipo de Propulsão / Tração",
  "Operator type": "Modo de Operação",
  "Rated capacity": "Capacidade Nominal de Carga",
  "Load centre distance": "Centro de Gravidade da Carga (c)",
  "Load distance, centre of drive axle to fork": "Distância do Eixo de Tração aos Garfos (x)",
  "Wheelbase": "Distância entre Eixos (y)",
  "Service weight": "Peso Operacional (com bateria)",
  "Axle loading, laden front/rear": "Carga por Eixo Carregado (Diant. / Tras.)",
  "Axle loading, unladen front/rear": "Carga por Eixo Vazio (Diant. / Tras.)",
  "Tyres": "Material das Rodas / Pneus",
  "Tyre size, front": "Dimensão das Rodas Dianteiras",
  "Tyre size, rear": "Dimensão das Rodas Traseiras",
  "Additional wheels (castor wheels)": "Rodas de Apoio Adicionais (Castores)",
  "Wheels, number front/rear (x=drive wheels)": "Qtd. de Rodas Diant./Tras. (x=tração)",
  "Tread width, rear": "Bitola Traseira (b11)",
  "Tread width, front": "Bitola Dianteira (b10)",
  "Tread width_front": "Bitola Dianteira (b10)",
  "Tread width_rear": "Bitola Traseira (b11)",
  "Lift": "Altura de Elevação dos Garfos (h3)",
  "Max lift height": "Elevação Máxima (h3)",
  "Height drawbar in driving position min./max.": "Altura do Timão em Posição de Condução (Mín/Máx)",
  "Height, lowered": "Altura dos Garfos Abaixados (h13)",
  "Height, mast lowered": "Altura com Mastro Recolhido (h1)",
  "Height, mast extended": "Altura com Mastro Estendido (h4)",
  "Free lift": "Elevação Livre (h2)",
  "Overall height": "Altura Total do Equipamento",
  "Overall length": "Comprimento Total (l1)",
  "Length to face of forks": "Comprimento até a Face dos Garfos (l2)",
  "Overall width": "Largura Total (b1/b2)",
  "Fork dimensions": "Dimensões dos Garfos (Espessura x Largura x Comp.)",
  "Fork carriage width": "Largura do Porta-Garfos (b3)",
  "Distance between fork-arms": "Distância Externa entre Braços dos Garfos",
  "Ground clearance, centre of wheelbase": "Distância do Solo no Entre-eixos (m2)",
  "Ground clearance, laden, below mast": "Distância do Solo sob o Mastro (m1)",
  "Aisle width for pallets 1000×1200 crossways": "Corredor Operacional (Palete 1.000 × 1.200 transversal - Ast)",
  "Aisle width for pallets 800 × 1200 lengthways": "Corredor Operacional (Palete 800 × 1.200 longitudinal - Ast)",
  "Turning radius": "Raio de Giro Mínimo (Wa)",
  "Internal turning radius": "Raio de Giro Interno",
  "Travel speed, laden/unladen": "Velocidade de Deslocamento (Com / Sem Carga)",
  "Lift speed, laden/unladen": "Velocidade de Elevação (Com / Sem Carga)",
  "Lowering speed, laden/unladen": "Velocidade de Descida (Com / Sem Carga)",
  "Max. gradeability, laden/unladen": "Capacidade Máxima de Rampa (Com / Sem Carga)",
  "Service brake": "Freio de Serviço",
  "Parking brake": "Freio de Estacionamento",
  "Drive motor rating S2 60 min": "Potência do Motor de Tração (S2 60 min)",
  "Lift motor rating at S3 15%": "Potência do Motor de Elevação (S3 15%)",
  "Battery voltage": "Tensão da Bateria",
  "Battery nominal capacity K5": "Capacidade da Bateria (K5)",
  "Battery type": "Tecnologia da Bateria",
  "Battery weight": "Peso da Bateria",
  "Battery voltage/nominal capacity": "Tensão e Capacidade da Bateria",
  "Charger output current": "Corrente do Carregador",
  "Steering design": "Sistema de Direção",
  "Sound pressure level at the driver's seat": "Nível de Ruído no Posto do Operador",
  "Type of drive unit": "Tipo da Unidade de Tração",
  "Width of loading surface": "Largura da Plataforma de Carga",
  "Length of loading surface": "Comprimento da Plataforma de Carga",
  "Distance between wheel arms/loading surfaces": "Distância entre Braços de Roda",
  "Seat height relating to SIP/stand height": "Altura do Assento / Posição do Operador",
  "Tilt of mast/fork carriage forward/backward": "Inclinação do Mastro (Frente / Trás)",
  "Height of overhead guard (cabin)": "Altura da Grade de Proteção / Cabine (h6)",
  "Coupling height": "Altura do Engate de Reboque",
  "Fork carriage ISO 2328, class/type A, B": "Classe do Porta-Garfos (ISO 2328)",
  "Oil volume for attachments": "Vazão de Óleo para Implementos Hidráulicos",
  "Operating pressure for attachments": "Pressão de Operação para Implementos",
  "Initial lift": "Elevação Inicial dos Braços de Apoio",
  "Height of wheel arms": "Altura dos Braços de Roda",
  "Reach distance": "Distância de Alcance dos Garfos",
  "Reaching speed, laden /unladen": "Velocidade de Alcance dos Garfos",
  "Loading height, unladen": "Altura de Carregamento",
  "Overhang": "Balanço Dianteiro",
  "Stand height, elevated": "Altura da Plataforma Elevada",
  "Drawbar pull, laden/unladen": "Força de Tração no Engate",
  "Max. drawbar pull, laden/unladen": "Força Máxima de Tração",
  "Energy consumption according to DIN EN 16796": "Consumo de Energia (Norma DIN EN 16796)",
  "Turnover output according to VDI 2198": "Rendimento Operacional (Norma VDI 2198)",
  "Turnover efficiency according to VDI 2198": "Eficiência Operacional (Norma VDI 2198)",
  "Transmission type": "Tipo de Transmissão",
  "Cylinder count/Displacement": "Qtd. de Cilindros / Cilindrada",
  "Max. torque/Speed": "Torque Máximo / Rotação",
  "Gear position, front/rear": "Posições de Marcha (Frente / Ré)",
  "Fuel tank capacity": "Capacidade do Tanque",
  "Length across wheel arms": "Comprimento entre Braços de Roda",
  "Axle loading, fork advanced, laden front/rear": "Carga por Eixo (Garfo Avançado)",
  "Axle loading, fork retracted, laden front/rear": "Carga por Eixo (Garfo Retraído)"
}

/**
 * Mapeamento de categorias de especificações para organizar a tabela em blocos lógicos
 */
const SPEC_CATEGORIES: { id: string; title: string; iconName: FormattedSpecGroup['iconName']; keys: string[] }[] = [
  {
    id: 'performance',
    title: 'Desempenho & Operação',
    iconName: 'Zap',
    keys: [
      'Rated capacity', 'Travel speed, laden/unladen', 'Lift speed, laden/unladen',
      'Lowering speed, laden/unladen', 'Max. gradeability, laden/unladen', 'Service brake',
      'Parking brake', 'Drive', 'Operator type', 'Steering design',
      'Turning radius', 'Internal turning radius', "Sound pressure level at the driver's seat",
      'Drawbar pull, laden/unladen', 'Max. drawbar pull, laden/unladen'
    ]
  },
  {
    id: 'dimensions',
    title: 'Dimensões & Pesos',
    iconName: 'Ruler',
    keys: [
      'Lift', 'Max lift height', 'Height, lowered', 'Height, mast lowered',
      'Height, mast extended', 'Free lift', 'Overall length', 'Length to face of forks',
      'Overall width', 'Fork dimensions', 'Fork carriage width', 'Distance between fork-arms',
      'Service weight', 'Load centre distance', 'Load distance, centre of drive axle to fork',
      'Ground clearance, centre of wheelbase', 'Ground clearance, laden, below mast',
      'Aisle width for pallets 1000×1200 crossways', 'Aisle width for pallets 800 × 1200 lengthways',
      'Height drawbar in driving position min./max.', 'Height of overhead guard (cabin)',
      'Overall height', 'Seat height relating to SIP/stand height', 'Reach distance',
      'Reaching speed, laden /unladen', 'Tilt of mast/fork carriage forward/backward'
    ]
  },
  {
    id: 'battery_electrical',
    title: 'Bateria & Sistema Elétrico',
    iconName: 'Battery',
    keys: [
      'Battery voltage', 'Battery nominal capacity K5', 'Battery type',
      'Battery weight', 'Battery voltage/nominal capacity', 'Charger output current',
      'Drive motor rating S2 60 min', 'Lift motor rating at S3 15%', 'Type of drive unit',
      'Energy consumption according to DIN EN 16796', 'Turnover output according to VDI 2198',
      'Turnover efficiency according to VDI 2198'
    ]
  },
  {
    id: 'chassis_wheels',
    title: 'Rodas, Freios & Chassi',
    iconName: 'Truck',
    keys: [
      'Tyres', 'Tyre size, front', 'Tyre size, rear', 'Wheelbase',
      'Additional wheels (castor wheels)', 'Wheels, number front/rear (x=drive wheels)',
      'Tread width, front', 'Tread width, rear', 'Tread width_front', 'Tread width_rear',
      'Axle loading, laden front/rear', 'Axle loading, unladen front/rear',
      'Axle loading, fork advanced, laden front/rear', 'Axle loading, fork retracted, laden front/rear'
    ]
  }
]

/**
 * Limpa valores brutos corrompidos por parsing (ex: '["105"] mm' -> '105 mm') e traduz termos em inglês
 */
export function cleanSpecValue(rawVal: string | undefined): string {
  if (!rawVal) return '—'
  
  let val = String(rawVal).trim()
  
  // Limpeza de arrays serializados como string: ["105"] mm ou ["2000"]
  val = val.replace(/\[\s*\\?"\s*([^"\\]+)\s*\\?"\s*\]/g, '$1')
  val = val.replace(/\[\s*"([^"]+)"\s*\]/g, '$1')
  val = val.replace(/\[\s*(\d+)\s*\]/g, '$1')
  val = val.replace(/\\"/g, '')
  val = val.replace(/|，/g, ' ')

  // Dicionário de traduções de valores comuns
  const valueTranslations: [RegExp, string][] = [
    [/^Electric$/i, 'Elétrico (Bateria Li-Ion)'],
    [/^Pedestrian$/i, 'Operador a Pé (Pedestre / Walkie)'],
    [/^Rider seated$/i, 'Operador Sentado'],
    [/^Rider stand-on$/i, 'Operador Embarcado (Plataforma)'],
    [/^Stand-on$/i, 'Operador em Pé / Embarcado'],
    [/^Polyurethane$/i, 'Poliuretano (PU de Alta Resistência)'],
    [/^Solid rubber$/i, 'Superelástico / Borracha Maciça'],
    [/^Pneumatic$/i, 'Pneumático'],
    [/^Electromagnetic$/i, 'Eletromagnético Regenerativo'],
    [/^Hydraulic$/i, 'Hidráulico'],
    [/^Mechanical$/i, 'Mecânico'],
    [/^Li-Ion$/i, 'Íon-Lítio (Li-Ion EP)'],
    [/^Lead-acid$/i, 'Chumbo-Ácido'],
    [/^AC$/i, 'Corrente Alternada (AC Brushless)'],
    [/^DC$/i, 'Corrente Contínua (DC)'],
    [/^Mechanical steering$/i, 'Direção Mecânica com Timão Ergonômico'],
    [/^Electric power steering$/i, 'Direção Elétrica Assistida (EPS)'],
    [/^Automatic$/i, 'Automático']
  ]

  for (const [pattern, translation] of valueTranslations) {
    if (pattern.test(val)) {
      return translation
    }
  }

  return val
}

/**
 * Traduz o nome da chave técnica para português
 */
export function getSpecLabel(key: string): string {
  // Tratamento para variações com caracteres especiais
  const cleanKey = key.replace(/|，/g, ', ').trim()
  return SPEC_LABELS_PT[cleanKey] || SPEC_LABELS_PT[key] || key
}

/**
 * Agrupa todas as especificações de um produto em seções organizadas e traduzidas
 */
export function getOrganizedSpecs(specs: Record<string, string | undefined>): FormattedSpecGroup[] {
  if (!specs || Object.keys(specs).length === 0) return []

  const categorizedKeys = new Set<string>()
  const groups: FormattedSpecGroup[] = []

  // Preenche os grupos principais conhecidos
  for (const cat of SPEC_CATEGORIES) {
    const items: { label: string; value: string }[] = []
    
    for (const key of cat.keys) {
      if (specs[key] !== undefined && specs[key] !== null && specs[key] !== '') {
        items.push({
          label: getSpecLabel(key),
          value: cleanSpecValue(specs[key])
        })
        categorizedKeys.add(key)
      }
    }

    if (items.length > 0) {
      groups.push({
        id: cat.id,
        title: cat.title,
        iconName: cat.iconName,
        items
      })
    }
  }

  // Coleta quaisquer outras especificações que não caíram nos grupos principais
  const otherItems: { label: string; value: string }[] = []
  for (const [key, val] of Object.entries(specs)) {
    if (!categorizedKeys.has(key) && val !== undefined && val !== null && val !== '') {
      otherItems.push({
        label: getSpecLabel(key),
        value: cleanSpecValue(val)
      })
    }
  }

  if (otherItems.length > 0) {
    groups.push({
      id: 'others',
      title: 'Outras Características Técnicas',
      iconName: 'Settings',
      items: otherItems
    })
  }

  return groups
}
