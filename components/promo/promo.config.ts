/**
 * Configuração central da campanha promocional (promo.grupovendaforte.com).
 *
 * Números, catálogo, time comercial e registro de mídias vivem aqui para que os
 * componentes de `components/promo/` nunca dupliquem dados.
 *
 * Especificação de referência: docs/promo/
 */

/* -------------------------------------------------------------------------- */
/* Contato                                                                     */
/* -------------------------------------------------------------------------- */

/** Número comercial real, o mesmo usado no site principal. */
export const WHATSAPP_CENTRAL = "5549988395635";
export const WHATSAPP_DISPLAY = "(49) 98839-5635";

export const CONTATO = {
  chapeco: "(49) 3323-9050",
  joinville: "(47) 3842-3333",
  email: "comercial@grupovendaforte.com",
} as const;

/** Pontos de atendimento reais. A campanha não promete cobertura nacional. */
export const PONTOS_ATENDIMENTO = [
  "Chapecó",
  "Itajaí",
  "Joinville",
  "Maringá",
  "Seberi",
  "Esteio",
] as const;

/* -------------------------------------------------------------------------- */
/* Registro de mídias                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Toda imagem e vídeo da campanha passa por aqui. Enquanto `src` for `null`, o
 * componente `PromoMediaSlot` renderiza um slot marcado no lugar, com o caminho
 * de destino e a especificação de produção.
 *
 * As peças finais serão geradas depois. Ao entregar um arquivo, basta preencher
 * o `src` correspondente.
 */
export interface MediaAsset {
  /** Caminho de destino dentro de `public/`. */
  file: string;
  /** Preenchido quando o arquivo existe. `null` mantém o slot marcado. */
  src: string | null;
  label: string;
  spec: string;
  alt: string;
  kind: "image" | "video";
}

export const MEDIA: Record<string, MediaAsset> = {
  heroFundo: {
    file: "/promo/bg-dark.png",
    src: null,
    label: "Fundo industrial do hero",
    spec: "2560 × 1440 · WebP",
    alt: "",
    kind: "image",
  },
  heroVideo: {
    file: "/promo/higgsfield-hero.mp4",
    src: null,
    label: "Vídeo cinematográfico do hero",
    spec: "1920 × 1080 · H.264 · 8 a 12 s · sem áudio",
    alt: "",
    kind: "video",
  },
  ds3Render: {
    file: "/promo/ds3_1.webp",
    src: "/promo/ds3_1.webp",
    label: "Foto de referência da DS3 (rascunho, substituir por render final)",
    spec: "Referência real do produto · trocar pelo render/3D final",
    alt: "Empilhadeira patolada EP DS3 de 1.500 kg com bateria de lítio",
    kind: "image",
  },
  detalheTimao: {
    file: "/promo/detalhe-timao.webp",
    src: null,
    label: "Close do timão de comando",
    spec: "1200 × 900 · WebP",
    alt: "Timão de comando da EP DS3 com os botões de elevação",
    kind: "image",
  },
  detalheBateria: {
    file: "/promo/detalhe-bateria.webp",
    src: null,
    label: "Bateria de lítio removida",
    spec: "1200 × 900 · WebP",
    alt: "Bateria de lítio de 24V removível da EP DS3",
    kind: "image",
  },
  detalhePatolas: {
    file: "/promo/detalhe-patolas.webp",
    src: null,
    label: "Patolas, vista frontal baixa",
    spec: "1200 × 900 · WebP",
    alt: "Patolas de estabilização da EP DS3",
    kind: "image",
  },
  detalheMastro: {
    file: "/promo/detalhe-mastro.webp",
    src: null,
    label: "Mastro elevado com pallet",
    spec: "1200 × 900 · WebP",
    alt: "Mastro da EP DS3 elevando um pallet a 3,9 metros",
    kind: "image",
  },
  detalheRodas: {
    file: "/promo/detalhe-rodas.webp",
    src: null,
    label: "Rodas e chassi em piso industrial",
    spec: "1200 × 900 · WebP",
    alt: "Rodas e chassi da EP DS3 em piso industrial",
    kind: "image",
  },
  setorArmazem: {
    file: "/promo/setor-armazem.webp",
    src: null,
    label: "Armazém e centro de distribuição",
    spec: "1600 × 1200 · WebP",
    alt: "Empilhadeira elétrica posicionando pallet em porta-pallets de armazém",
    kind: "image",
  },
  setorFrigorifico: {
    file: "/promo/setor-frigorifico.webp",
    src: null,
    label: "Frigorífico e câmara fria",
    spec: "1600 × 1200 · WebP",
    alt: "Empilhadeira elétrica operando em câmara fria",
    kind: "image",
  },
  setorIndustria: {
    file: "/promo/setor-industria.webp",
    src: null,
    label: "Indústria alimentícia",
    spec: "1600 × 1200 · WebP",
    alt: "Empilhadeira elétrica abastecendo linha de produção",
    kind: "image",
  },
  setorAgro: {
    file: "/promo/setor-agro.webp",
    src: null,
    label: "Agronegócio e cooperativa",
    spec: "1600 × 1200 · WebP",
    alt: "Empilhadeira elétrica em armazém de insumos agrícolas",
    kind: "image",
  },
  setorVarejo: {
    file: "/promo/setor-varejo.webp",
    src: null,
    label: "Varejo e atacado",
    spec: "1600 × 1200 · WebP",
    alt: "Empilhadeira elétrica em reposição de atacado",
    kind: "image",
  },
  produtoF4: {
    file: "/promo/produto-f4.webp",
    src: "https://cdn.ep-portal.net/products/attr_5/1757324457309-ket0ve.webp",
    label: "Paleteira F4 recortada",
    spec: "1200 × 1200 · fundo transparente · hoje vem do CDN da EP",
    alt: "Paleteira Elétrica EP F4 de 1.500 kg",
    kind: "image",
  },
  produtoEfl302: {
    file: "/promo/produto-efl302.webp",
    src: "https://cdn.ep-portal.net/products/attr_5/1766563537248-z8brck.webp",
    label: "Contrabalançada EFL302 recortada",
    spec: "1200 × 1200 · fundo transparente · hoje vem do CDN da EP",
    alt: "Empilhadeira Contrabalançada EP EFL302 de 3 toneladas",
    kind: "image",
  },
  desenhoTecnico: {
    file: "/promo/ds3-desenho-tecnico.webp",
    src: null,
    label: "Desenho técnico cotado da DS3",
    spec: "1600 × 1600 · traço claro sobre fundo escuro",
    alt: "Desenho técnico cotado da EP DS3, vistas lateral e superior",
    kind: "image",
  },
  consultorRodrigo: {
    file: "/promo/consultor-rodrigo.webp",
    src: null,
    label: "Retrato de Rodrigo Schilke",
    spec: "800 × 800 · ombros para cima · fundo escuro",
    alt: "Rodrigo Schilke, gestão comercial do Grupo Venda Forte",
    kind: "image",
  },
  consultorTecnico: {
    file: "/promo/consultor-tecnico.webp",
    src: null,
    label: "Retrato do consultor técnico",
    spec: "800 × 800 · ombros para cima · fundo escuro",
    alt: "Consultor técnico do Grupo Venda Forte",
    kind: "image",
  },
  consultorFinanciamento: {
    file: "/promo/consultor-financiamento.webp",
    src: null,
    label: "Retrato do consultor de financiamento",
    spec: "800 × 800 · ombros para cima · fundo escuro",
    alt: "Consultor de financiamento do Grupo Venda Forte",
    kind: "image",
  },
};

/** Catálogo de PDF. `null` esconde o botão de download, para não gerar link quebrado. */
export const CATALOGO_PDF: string | null = null;

/* -------------------------------------------------------------------------- */
/* Catálogo da campanha                                                        */
/* -------------------------------------------------------------------------- */

export type PromoProductId = "ds3" | "f4" | "efl302" | "outro";

export interface PromoProduct {
  id: Exclude<PromoProductId, "outro">;
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
  badgeClass: string;
  capacity: string;
  lifting: string;
  battery: string;
  price: string;
  installment: string;
  mediaKey: keyof typeof MEDIA;
  highlights: string[];
  featured: boolean;
}

export const PROMO_PRODUCTS: PromoProduct[] = [
  {
    id: "ds3",
    name: "Empilhadeira Patolada EP DS3",
    shortName: "DS3",
    tagline: "Verticalização em corredor estreito",
    badge: "Destaque · 1.500 kg",
    badgeClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white",
    capacity: "1.500 kg",
    lifting: "3,9 metros",
    battery: "24V Li-Ion",
    price: "A partir de R$ 39.900",
    installment: "Até 48x via BNDES e Finame",
    mediaKey: "ds3Render",
    highlights: [
      "Recarga de oportunidade em qualquer tomada",
      "Zero manutenção de água e ácido",
      "Timão ergonômico com comando progressivo",
    ],
    featured: true,
  },
  {
    id: "f4",
    name: "Paleteira Elétrica EP F4",
    shortName: "F4",
    tagline: "A campeã de vendas do armazém",
    badge: "Mais vendida",
    badgeClass: "bg-amber-400 text-black",
    capacity: "1.500 kg",
    lifting: "200 mm",
    battery: "24V Li-Ion",
    price: "A partir de R$ 14.890",
    installment: "Até 12x no cartão CNPJ",
    mediaKey: "produtoF4",
    highlights: [
      "Compacta para docas e caminhões",
      "Bateria removível de troca rápida",
      "Operação silenciosa para turno noturno",
    ],
    featured: false,
  },
  {
    id: "efl302",
    name: "Contrabalançada EP EFL302",
    shortName: "EFL302",
    tagline: "Força pesada 100% elétrica",
    badge: "3 toneladas",
    badgeClass: "bg-sky-500 text-white",
    capacity: "3.000 kg",
    lifting: "6 metros",
    battery: "80V Li-Ion",
    price: "Condição de lote",
    installment: "Faturamento direto e BNDES",
    mediaKey: "produtoEfl302",
    highlights: [
      "Substitui a combustão sem perder desempenho",
      "Cabine ampla com coluna de direção ajustável",
      "Frenagem regenerativa que devolve carga",
    ],
    featured: false,
  },
];

export const MODEL_OPTIONS: { id: PromoProductId; label: string }[] = [
  ...PROMO_PRODUCTS.map((product) => ({
    id: product.id as PromoProductId,
    label: `${product.name} (${product.capacity})`,
  })),
  { id: "outro", label: "Outro modelo / consultoria de frota" },
];

/* -------------------------------------------------------------------------- */
/* Time comercial                                                              */
/* -------------------------------------------------------------------------- */

export interface SalesConsultant {
  id: string;
  name: string;
  role: string;
  region: string;
  specialty: string;
  phoneDisplay: string;
  whatsappNumber: string;
  initials: string;
  mediaKey: keyof typeof MEDIA;
  accent: "red" | "orange" | "emerald";
}

export const SALES_TEAM: SalesConsultant[] = [
  {
    id: "rodrigo",
    name: "Rodrigo Schilke",
    role: "Gestão comercial e grandes frotas",
    region: "Atendimento corporativo no Sul do Brasil",
    specialty: "Contratos de frota e locação",
    phoneDisplay: WHATSAPP_DISPLAY,
    whatsappNumber: WHATSAPP_CENTRAL,
    initials: "RS",
    mediaKey: "consultorRodrigo",
    accent: "red",
  },
  {
    id: "tecnico",
    name: "Consultor técnico",
    role: "Linha elétrica e armazenagem vertical",
    region: "Chapecó, Itajaí e Joinville",
    specialty: "Dimensionamento da DS3 e da F4",
    phoneDisplay: WHATSAPP_DISPLAY,
    whatsappNumber: WHATSAPP_CENTRAL,
    initials: "CT",
    mediaKey: "consultorTecnico",
    accent: "orange",
  },
  {
    id: "financiamento",
    name: "Consultor de financiamento",
    role: "Faturamento CNPJ, leasing e Finame",
    region: "Maringá, Seberi e Esteio",
    specialty: "Simulação BNDES em até 60x",
    phoneDisplay: WHATSAPP_DISPLAY,
    whatsappNumber: WHATSAPP_CENTRAL,
    initials: "CF",
    mediaKey: "consultorFinanciamento",
    accent: "emerald",
  },
];

/* -------------------------------------------------------------------------- */
/* Prova social                                                                */
/* -------------------------------------------------------------------------- */

/** Logos já presentes em `public/images/clients/`. */
export const CLIENTES = [
  { name: "Adami", file: "/images/clients/adami.png" },
  { name: "BRF", file: "/images/clients/brf.png" },
  { name: "Copacol", file: "/images/clients/copacol.png" },
  { name: "GT Foods", file: "/images/clients/gtfoods.png" },
  { name: "JBS", file: "/images/clients/jbs.png" },
  { name: "Muffato", file: "/images/clients/muffato.png" },
  { name: "Randon", file: "/images/clients/randon.png" },
  { name: "Seara", file: "/images/clients/seara.png" },
] as const;

/** Somente números já publicados e assumidos pela empresa no site principal. */
export const NUMEROS = [
  { value: "1000+", label: "Equipamentos vendidos" },
  { value: "20+", label: "Anos de mercado" },
  { value: "6", label: "Pontos de atendimento" },
  { value: "3", label: "Estados no Sul do Brasil" },
] as const;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

export function whatsappUrl(message: string, number: string = WHATSAPP_CENTRAL): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_GENERAL_MESSAGE =
  "Olá! Vim pela campanha promocional da EP Equipment e quero falar com um consultor.";
