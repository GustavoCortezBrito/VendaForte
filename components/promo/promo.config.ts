import type { FrameSequence } from "./ScrollSequence";

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
export const PONTOS_ATENDIMENTO = ["Chapecó", "Joinville", "Itajaí"] as const;

/** Âncora do hero em vídeo. O header muda de estado quando ele termina. */
export const HERO_ID = "palco";

/** Menu da campanha, usado no header e no rodapé. */
export const PROMO_NAV = [
  { href: "#ds3", label: "DS3" },
  { href: "#efl302b3", label: "EFL302 B3" },
  { href: "#f4", label: "F4" },
  { href: "#economia", label: "Economia" },
  { href: "#cotacao", label: "Cotação" },
] as const;

/** Site principal. A LP roda num subdomínio próprio, então o link é absoluto. */
export const MAIN_SITE_URL = "https://www.grupovendaforte.com";

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
    file: "/promo/ds3-giro-15s.mp4",
    src: "/promo/ds3-giro-15s.mp4",
    label: "Giro 360° da DS3 (Seedance 2.5)",
    spec: "Original 1920 × 1080 · 15 s · 361 quadros em /promo/giro/ · versão mobile 1280 × 720 H.264",
    alt: "Empilhadeira elétrica EP DS3 girando 360 graus",
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
  desenhoTecnico: {
    file: "/promo/ds3-desenho-tecnico.webp",
    src: null,
    label: "Desenho técnico cotado da DS3",
    spec: "1600 × 1600 · traço claro sobre fundo escuro",
    alt: "Desenho técnico cotado da EP DS3, vistas lateral e superior",
    kind: "image",
  },
};

/* -------------------------------------------------------------------------- */
/* Fotos da DS3                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Quadros do giro do Seedance, recortados em quadrado e centrados no produto.
 * O fundo é o mesmo `ink` da página, então a foto não forma retângulo.
 *
 * Os cinco com sufixo `-hd` aparecem com zoom de câmera em "Detalhe construtivo":
 * foram ampliados 4× com Real-ESRGAN e salvos em 3240 px. Os demais têm 1080 px.
 */
export const DS3_SHOTS = {
  frente: { src: "/promo/ds3/ds3-frente-hd.webp", alt: "EP DS3 de frente, com o timão de comando" },
  tresQuartos: {
    src: "/promo/ds3/ds3-34-frente-hd.webp",
    alt: "EP DS3 em três quartos, com a carenagem vermelha da bateria",
  },
  perfil: { src: "/promo/ds3/ds3-perfil.webp", alt: "EP DS3 de perfil, com o mastro e os garfos" },
  mastro: {
    src: "/promo/ds3/ds3-mastro-hd.webp",
    alt: "Mastro da EP DS3 com correntes e grade de proteção",
  },
  traseira: { src: "/promo/ds3/ds3-traseira-hd.webp", alt: "Garfos e patolas da EP DS3 vistos de trás" },
  lateral: { src: "/promo/ds3/ds3-lateral-hd.webp", alt: "Lateral da EP DS3 com rodas e chassi" },
  // Do giro de 15 s, ampliados 4× com Real-ESRGAN e salvos em 2160 px
  tresQuartosGarfos: {
    src: "/promo/ds3/ds3-34-garfos-hd.webp",
    alt: "EP DS3 em três quartos, com a carenagem vermelha e os garfos",
  },
  tresQuartosLogo: {
    src: "/promo/ds3/ds3-34-logo-hd.webp",
    alt: "EP DS3 em três quartos pela direita, com o logo EP na carenagem",
  },
} as const;

export type DS3ShotKey = keyof typeof DS3_SHOTS;


/* -------------------------------------------------------------------------- */
/* Catálogo da campanha                                                        */
/* -------------------------------------------------------------------------- */

export type ProductId = "ds3" | "efl302b3" | "f4";
// "outro" leva a conversa do formulário para consultoria de frota.
export type PromoProductId = ProductId | "outro";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface PromoProduct {
  id: ProductId;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  capacity: string;
  /** `null` enquanto o valor não estiver aprovado: a página mostra a condição de lote. */
  price: string | null;
  /** Preço anterior, mostrado riscado antes do preço da campanha. */
  listPrice?: string;
  installment: string;
  highlights: string[];
  /** Ficha técnica do catálogo EP (`lib/data/electric-forklifts.json`). */
  specs: ProductSpec[];
}

export const PRODUCTS: Record<ProductId, PromoProduct> = {
  ds3: {
    id: "ds3",
    name: "Empilhadeira Patolada EP DS3",
    shortName: "DS3",
    category: "Empilhadeira patolada",
    tagline: "Verticalização em corredor estreito",
    capacity: "1.500 kg",
    price: "R$ 19.900",
    listPrice: "R$ 29.900",
    installment: "Até 48x via BNDES e Finame",
    highlights: [
      "Recarga de oportunidade em qualquer tomada",
      "Zero manutenção de água e ácido",
      "Timão ergonômico com comando progressivo",
    ],
    specs: [
      { label: "Capacidade nominal", value: "1.500 kg" },
      { label: "Altura de elevação", value: "3,9 metros" },
      { label: "Bateria", value: "24 V de íon-lítio" },
      { label: "Garantia da bateria", value: "Até 5 anos de fábrica" },
      { label: "Raio de giro", value: "1.470 mm" },
      { label: "Velocidade com/sem carga", value: "4,0/4,5 km/h" },
      { label: "Peso do equipamento", value: "540 kg" },
      { label: "Comprimento × largura", value: "1.727 × 834 mm" },
    ],
  },
  efl302b3: {
    id: "efl302b3",
    name: "Empilhadeira Contrabalançada EP EFL302 B3",
    shortName: "EFL302 B3",
    category: "Empilhadeira contrabalançada",
    tagline: "Força de 3 toneladas, 100% elétrica",
    capacity: "3.000 kg",
    price: null,
    installment: "Faturamento direto, BNDES e Finame",
    highlights: [
      "3 toneladas com bateria de lítio de 80 V",
      "Até 12 km/h e rampa de até 15%",
      "Pneus pneumáticos para pátio e piso irregular",
    ],
    specs: [
      { label: "Capacidade nominal", value: "3.000 kg" },
      { label: "Altura máxima de elevação", value: "6.000 mm" },
      { label: "Bateria", value: "80 V de íon-lítio, 205 Ah" },
      { label: "Velocidade com/sem carga", value: "11/12 km/h" },
      { label: "Rampa máxima", value: "15%" },
      { label: "Raio de giro", value: "2.437 mm" },
      { label: "Peso do equipamento", value: "4.100 kg" },
      { label: "Comprimento × largura", value: "3.735 × 1.230 mm" },
    ],
  },
  f4: {
    id: "f4",
    name: "Paleteira Elétrica EP F4",
    shortName: "F4",
    category: "Paleteira elétrica",
    tagline: "Compacta para o giro do dia a dia",
    capacity: "1.500 kg",
    price: "R$ 14.890",
    installment: "Até 12x no cartão CNPJ",
    highlights: [
      "Compacta para docas, caminhões e corredores",
      "Bateria de lítio de 24 V sem manutenção",
      "Apenas 120 kg e raio de giro de 1.360 mm",
    ],
    specs: [
      { label: "Capacidade nominal", value: "1.500 kg" },
      { label: "Elevação", value: "105 mm" },
      { label: "Bateria", value: "24 V de íon-lítio, 20 Ah" },
      { label: "Velocidade com/sem carga", value: "4/4,5 km/h" },
      { label: "Raio de giro", value: "1.360 mm" },
      { label: "Peso do equipamento", value: "120 kg" },
      { label: "Garfos", value: "55 × 150 × 1.150 mm" },
      { label: "Comprimento × largura", value: "1.550 × 590 mm" },
    ],
  },
};

export const PROMO_PRODUCTS: PromoProduct[] = [PRODUCTS.ds3, PRODUCTS.efl302b3, PRODUCTS.f4];

/* -------------------------------------------------------------------------- */
/* Sequências de quadros                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Versão dos arquivos das animações, na URL. O next.config.ts manda o navegador
 * guardá-los por um ano: ao trocar quadros ou vídeos, suba este número.
 */
export const ASSET_VERSION = "3";

const pad3 = (index: number) => String(index).padStart(3, "0");

/**
 * Quadros tirados do upscale 4K do vídeo: AVIF de 1920 e 2560 px nas pastas
 * `avif-<largura>` e WebP de 2560 px como reserva.
 */
const frameSequence = (
  dir: string,
  frames: number,
  webpName: (index: number) => string = pad3
): FrameSequence => ({
  frames,
  avif: (index, width) => `/promo/${dir}/avif-${width}/${pad3(index)}.avif?v=${ASSET_VERSION}`,
  webp: (index) => `/promo/${dir}/${webpName(index)}.webp?v=${ASSET_VERSION}`,
});

/** Giro de 360° da DS3 em 15 s a 24 fps: 1° por quadro. */
export const DS3_SEQUENCE = frameSequence("giro", 361, (index) => `ds3-${pad3(index)}`);

/** Vídeo do mobile: AV1 para quem decodifica, H.264 como reserva. */
export interface PromoVideo {
  av1?: string;
  h264: string;
}

const promoVideo = (name: string, { av1 }: { av1: boolean }): PromoVideo => ({
  ...(av1 && { av1: `/promo/${name}-av1.mp4?v=${ASSET_VERSION}` }),
  h264: `/promo/${name}.mp4?v=${ASSET_VERSION}`,
});

/** Giro da DS3 em loop, para o mobile. */
export const DS3_VIDEO = promoVideo("ds3-giro-15s", { av1: true });

/** Produtos que ganham uma animação própria depois da DS3. */
export type MotionProductId = Exclude<ProductId, "ds3">;

export interface ProductMotion {
  sequence: FrameSequence;
  /** A mesma animação em vídeo, para o mobile. */
  video: PromoVideo;
  label: string;
  /** Frase curta que acompanha o nome no fim do movimento. */
  line: string;
}

export const PRODUCT_MOTION: Record<MotionProductId, ProductMotion> = {
  efl302b3: {
    sequence: frameSequence("movimento-efl302b3", 241),
    video: promoVideo("efl302b3-movimento", { av1: true }),
    label: "Empilhadeira EP EFL302 B3 chegando de perfil e parando no centro",
    line: "3.000 kg · 6 m de elevação · lítio 80 V",
  },
  f4: {
    sequence: frameSequence("revelacao-f4", 241),
    video: promoVideo("f4-revelacao", { av1: true }),
    label: "Paleteira elétrica EP F4 revelada por uma faixa de luz",
    line: "1.500 kg · 120 kg de peso · lítio 24 V",
  },
};

export interface ProductPhoto {
  src: string;
  alt: string;
}

/**
 * Fotos das seções de informações. As da EFL302 B3 têm fundo transparente
 * (`contain`); as da F4 são de operação real em armazém (`cover`).
 */
export const PRODUCT_PHOTOS: Record<MotionProductId, { fit: "contain" | "cover"; photos: ProductPhoto[] }> = {
  efl302b3: {
    fit: "contain",
    photos: [
      { src: "/promo/EFL302B3/recorte/2.webp", alt: "EP EFL302 B3 em três quartos pela frente, lado esquerdo" },
      { src: "/promo/EFL302B3/recorte/3.webp", alt: "EP EFL302 B3 em três quartos pela frente, lado direito" },
      { src: "/promo/EFL302B3/recorte/8.webp", alt: "EP EFL302 B3 de perfil" },
      { src: "/promo/EFL302B3/recorte/1.webp", alt: "EP EFL302 B3 em três quartos por trás, com o contrapeso" },
      { src: "/promo/EFL302B3/recorte/4.webp", alt: "EP EFL302 B3 de frente, com o mastro e os garfos" },
    ],
  },
  f4: {
    fit: "cover",
    photos: [
      { src: "/promo/F4/1.webp", alt: "EP F4 em três quartos no corredor do armazém" },
      { src: "/promo/F4/2.webp", alt: "EP F4 de frente, com o timão" },
      { src: "/promo/F4/4.webp", alt: "EP F4 entre os porta-pallets" },
      { src: "/promo/F4/3.webp", alt: "Timão da EP F4 na mão do operador" },
      { src: "/promo/F4/5.webp", alt: "Técnico conferindo a bateria da EP F4" },
    ],
  },
};

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

/** Horário de atendimento comercial, o mesmo do site principal. */
export const HORARIO_ATENDIMENTO = ["Segunda a sexta, 8h às 18h", "Sábado, 8h às 12h"] as const;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

export function whatsappUrl(message: string, number: string = WHATSAPP_CENTRAL): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_GENERAL_MESSAGE =
  "Olá! Vim pela campanha promocional da EP Equipment e quero falar com um consultor.";
