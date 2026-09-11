# Seção 01 — Hero, fase A da sequência de produto

**Componente:** `components/promo/PromoHero.tsx`
**Palco compartilhado:** ver [sequencia-scroll-produto.md](sequencia-scroll-produto.md)
**Faixa de progresso:** 0.00 a 0.34

## 1. Objetivo

Posicionar a tecnologia, entregar a condição comercial e converter quem já chegou
decidido, sem exigir rolagem.

## 2. Layout

### Desktop, ≥ 1024 px

Palco fixo de altura `100vh`, container `max-w-7xl px-8`, grade de duas colunas
`1.05fr 0.95fr`, alinhamento central, `gap-14`.

- **Coluna esquerda:** selo, título, apoio, dois botões, três métricas, selos de confiança
- **Coluna direita:** canvas do produto, conforme o documento do palco

### Mobile, < 768 px

- Coluna única, texto acima e produto abaixo
- Título em `text-5xl`, apoio em `text-base`
- Botões em largura total, empilhados, 16 px entre eles
- Métricas em três colunas estreitas, número em `text-2xl`
- Sem palco fixo, conforme a seção 5 do documento do palco

## 3. Copy

- **Selo:** Representante oficial EP Equipment
- **Título:** Empilhadeira elétrica de lítio, 1.500 kg, com pronta entrega.
  - Variação A para teste: Sua operação sem sala de baterias, sem GLP e sem parada de turno.
  - Variação B para teste: A EP DS3 eleva 1.500 kg a 3,3 metros. E recarrega em qualquer tomada.
  - A palavra "lítio" recebe gradiente âmbar para vermelho
- **Apoio:** Empilhadeiras e paleteiras elétricas EP com bateria de lítio, garantia de
  fábrica de até 5 anos e faturamento direto para CNPJ via BNDES e Finame. Estoque
  pronto para despacho.
- **Botão primário:** Ver modelos em oferta, âncora `#ofertas`
- **Botão secundário:** Falar com um consultor, WhatsApp geral
- **Métricas:** 1.500 kg / Capacidade da DS3 · 5 anos / Garantia da bateria de lítio ·
  60x / Financiamento BNDES e Finame
- **Selos de confiança:** Pronta entrega · Garantia de fábrica EP · Lítio sem manutenção

## 4. Animações

| Elemento | Comportamento |
|---|---|
| Entrada do bloco de texto | Escalonamento de 0.09 com atraso inicial de 0.1. Cada filho em `opacity 0→1`, `y 24→0`, `duration 0.5`, `ease "easeOut"` |
| Contador das métricas | Anima de 0 até o valor em 1.6 s, disparado por `useInView` uma única vez. O valor final é renderizado no servidor, para não haver divergência de hidratação |
| Saída no scroll | Faixa 0.24 a 0.34: `opacity 1→0`, `y 0→-40`. Controlado pelo progresso do palco, não por `whileInView` |
| Selo | Ponto vermelho com pulso contínuo |
| Botão primário | Escala de 1.02 no hover e seta deslocando 4 px, via CSS |

Com movimento reduzido: entradas imediatas, contador exibe o valor final, sem saída animada.

## 5. Imagens

| Arquivo | Descrição | Dimensão | Tratamento | Alt |
|---|---|---|---|---|
| `public/promo/bg-dark.png` | Fundo industrial escuro, camada base sempre presente | 2560 × 1440 | `object-cover`, opacidade 40%, `preload` | vazio, é decorativa |
| `public/promo/higgsfield-hero.mp4` | Vídeo em loop da DS3 em operação, 8 a 12 s, sem áudio e sem texto embutido | 1920 × 1080, H.264, alvo de 3 MB | `object-cover`, opacidade 45% apenas após confirmar reprodução | não se aplica, marcado como decorativo |
| `public/promo/hero-ds3.png` | Render 3D da DS3 em três quartos, fundo transparente | 1600 × 1600 | `object-contain` com sombra projetada vermelha | Empilhadeira patolada EP DS3 de 1.500 kg com bateria de lítio |
| `public/promo/sequencia/ds3-000.webp` | Primeiro frame da sequência | 1600 × 1600 | Pré-carregado junto com o poster | ver documento do palco |

Regra de fallback: o fundo estático e o render sempre existem no DOM. O vídeo e o canvas
só ganham opacidade quando confirmam que podem ser exibidos. Nenhum arquivo ausente
produz espaço vazio.

### Iluminação volumétrica

Três orbes com `blur-[120px]`, sem imagem:

- Laranja a 20%, 520 px, à esquerda e acima
- Vermelho a 20%, 560 px, à direita e abaixo
- Âmbar a 10%, 380 px, centro superior

Mais uma grade industrial de 72 px com máscara radial a 15% de opacidade, e duas
vinhetas lineares que garantem contraste do texto sobre qualquer frame do vídeo.

## 6. Acessibilidade

- Um único `<h1>` na página inteira, e ele fica aqui
- Vídeo marcado como decorativo, sem informação exclusiva
- Contraste do apoio precisa passar em 4.5:1 no ponto mais claro do vídeo
- Métricas legíveis por leitor de tela com a unidade junto do número

## 7. Critérios de aceite

1. Sem o arquivo de vídeo no diretório, o hero permanece completo e sem erro no console
2. O título é o maior elemento de texto e é o LCP da página
3. Os contadores não causam salto de layout ao animar
4. Em 360 px de largura, nenhum texto quebra em mais de três linhas
