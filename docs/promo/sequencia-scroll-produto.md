# Sequência de produto controlada por scroll — seções 01 e 02

**Componente:** `components/promo/PromoProductStage.tsx`
**Consumido por:** `PromoHero.tsx` (fase A) e `PromoCloseUp.tsx` (fase B)

A DS3 entra na tela uma única vez e permanece durante as duas primeiras seções. O
scroll não troca de imagem, ele controla um único movimento contínuo do produto.
Terminada a fase B, o palco é liberado e a página volta a rolar normalmente para os
destaques rápidos.

## 1. Estrutura

```
<section id="palco" ref={wrapperRef}>        // altura 320vh no desktop
  <div className="sticky top-0 h-screen">    // palco fixo
     <ProductCanvas />                       // canvas da sequência de frames
     <HeroCopy />                            // texto da fase A
     <CloseUpCallouts />                     // legendas da fase B
     <AmbientLighting />                     // orbes e vinheta
  </div>
</section>
```

O wrapper tem `320vh`. O palco interno é `sticky top-0 h-screen`. O progresso vem de
`useScroll({ target: wrapperRef, offset: ["start start", "end end"] })`.

## 2. Mapa de progresso

`scrollYProgress` vai de 0 a 1 ao longo dos 320vh. As faixas abaixo são a coreografia
completa. Use `useTransform` para cada propriedade.

| Faixa | Fase | Produto | Texto |
|---|---|---|---|
| 0.00 – 0.08 | A, entrada | Frame 0, três quartos, escala 1.0 | Título e métricas entram escalonados |
| 0.08 – 0.24 | A, repouso | Flutuação leve, frames 0 a 6 | Hero totalmente visível |
| 0.24 – 0.34 | Transição | Frames 6 a 30, gira para o perfil, escala 1.0 → 1.18 | Hero sai: `opacity 1→0`, `y 0→-40` |
| 0.34 – 0.42 | Transição | Frames 30 a 40, translada para a esquerda no desktop | Título da fase B entra |
| 0.42 – 0.92 | B, detalhes | Frames 40 a 71, mastro sobe, 5 legendas em sequência | Uma legenda por vez, ver tabela abaixo |
| 0.92 – 1.00 | Saída | Escala 1.18 → 1.0, `opacity 1→0` | Legendas somem, CTA da fase B permanece |

### Legendas da fase B

Cada legenda ocupa uma fatia da faixa 0.42–0.92 e entra com `opacity 0→1`, `x -16→0`.
A legenda anterior sai com `opacity 1→0` antes de a seguinte entrar. Sobreposição de
0.02 para não haver quadro vazio.

| Ponto | Faixa | Frame alvo |
|---|---|---|
| Timão de comando | 0.42 – 0.52 | 44 |
| Bateria de lítio 24V | 0.52 – 0.62 | 50 |
| Patolas | 0.62 – 0.72 | 56 |
| Mastro | 0.72 – 0.84 | 64 |
| Rodas e chassi | 0.84 – 0.92 | 70 |

## 3. Sequência de frames

| Item | Especificação |
|---|---|
| Quantidade | 72 frames, índice 000 a 071 |
| Movimento | Giro de 90 graus de três quartos para perfil, seguido de elevação do mastro até 3,3 m |
| Nome do arquivo | `public/promo/sequencia/ds3-000.webp` até `ds3-071.webp` |
| Dimensão | 1600 × 1600 px, produto centralizado com 8% de margem |
| Formato | WebP, qualidade 80, alvo de 45 a 60 KB por frame |
| Peso total | Máximo de 4 MB para os 72 frames |
| Fundo | Transparente. A iluminação vem das camadas de CSS, não do render |
| Iluminação | Chave lateral quente à esquerda, preenchimento frio à direita, sem sombra projetada no chão |

Se a produção dos frames não estiver pronta, usar o modo degradado da seção 6 sem
alterar a coreografia.

### Desenho no canvas

- Um único `<canvas>` com `width`/`height` de 1600, escalado por CSS
- `requestAnimationFrame` para desenhar, nunca desenhe direto no callback do scroll
- Guardar o frame corrente em `useRef` e só redesenhar quando o índice mudar
- `ctx.drawImage` com `imageSmoothingQuality: "high"`

### Pré-carregamento

1. Frame 0 é `<link rel="preload">` no `head`, junto com o poster estático
2. Os demais começam a carregar no evento `load` da janela, com fila de concorrência 6
3. Enquanto menos de 100% dos frames estiverem prontos, o palco mostra o PNG estático
   `hero-ds3.png` com a coreografia CSS do modo degradado
4. Ao completar, faz `crossfade` de 400 ms do PNG para o canvas

Nunca bloqueie o primeiro paint esperando a sequência.

## 4. Comportamento por dispositivo

| Contexto | Comportamento |
|---|---|
| Desktop, largura ≥ 1024 px | Sequência completa, palco fixo de 320vh |
| Tablet, 768 a 1023 px | Sequência completa, palco reduzido para 260vh, legendas abaixo do produto |
| Mobile, < 768 px | **Sem sequência de frames.** Ver seção 5 |
| `prefers-reduced-motion` | Sem palco fixo, sem sequência. Ver seção 6 |
| Conexão econômica (`navigator.connection.saveData`) | Trata como mobile |

## 5. Mobile

O tráfego da campanha é majoritariamente celular em rede móvel. Baixar 4 MB de frames
antes de o visitante ver a oferta custa conversão e piora o LCP. No mobile a
sequência é substituída:

- O palco fixo é desativado. Hero e Veja de perto voltam a ser duas seções normais
- O hero usa o render estático `hero-ds3.png` com flutuação de `y: [0,-10,0]`
- O Veja de perto vira carrossel horizontal com deslize, um cartão por ponto quente,
  cada um com a foto de detalhe correspondente e indicador de posição
- Nenhum frame da sequência é baixado. O carregamento é condicional, não apenas oculto
  por CSS

## 6. Modo degradado e movimento reduzido

Vale quando os frames não existem, falham ao carregar ou o visitante pede menos
movimento.

- **Sem frames disponíveis:** mantém o palco fixo, mas anima o PNG estático com
  `rotate`, `scale` e `translate` derivados do mesmo `scrollYProgress`. A coreografia e
  as faixas da seção 2 continuam idênticas, muda só a fidelidade
- **`prefers-reduced-motion: reduce`:** desativa o palco fixo. As duas seções são
  renderizadas empilhadas, com o produto estático e todas as legendas visíveis de uma
  vez, sem entrada animada
- **Falha de carregamento do canvas:** o PNG estático permanece, sem erro visível

## 7. Acessibilidade

- O canvas recebe `role="img"` e `aria-label` com a descrição do produto
- As legendas da fase B existem no DOM em um `<ul>` sempre presente. A animação controla
  só a opacidade, não a montagem, para que o leitor de tela leia todas
- O palco fixo não captura o foco. Navegação por teclado rola a página normalmente
- Nenhuma informação existe apenas dentro da animação. Todo texto da fase B está no HTML

## 8. Orçamento de desempenho

| Métrica | Alvo |
|---|---|
| LCP | Abaixo de 2,5 s no 4G, medindo o render estático, não a sequência |
| Peso antes da interação | Abaixo de 600 KB no mobile |
| Frames por segundo durante o scroll | 60 no desktop, sem queda abaixo de 50 |
| Trabalho na thread principal por frame | Abaixo de 8 ms |

## 9. Critérios de aceite

1. Rolando do topo até 320vh, o produto nunca some nem salta de posição
2. O texto do hero sai completamente antes de a primeira legenda da fase B entrar
3. Com a rede em 4G simulado, a primeira tela aparece sem esperar a sequência
4. No mobile, nenhum arquivo de `public/promo/sequencia/` é requisitado
5. Com movimento reduzido ativo, as duas seções são legíveis sem nenhum pin
6. Removendo o diretório da sequência, a página continua funcionando no modo degradado
