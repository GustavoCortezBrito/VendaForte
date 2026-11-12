---
name: venda-forte-visual
description: Visual do site e do painel do Grupo Venda Forte (tema escuro da /promo). Use ao criar ou mudar qualquer página, seção, botão, cartão, imagem ou vídeo do site ou do /admin, para sair igual ao que já existe.
---

# Visual do site Venda Forte

Tema criado com a ideia do theme-factory ("Venda Forte Ink") sobre a campanha `/promo`. Vale também para o painel `/admin`, os termos e a privacidade. O guia completo,
com as peças e o passo a passo das imagens e vídeos do Higgsfield, é `docs/site/README.md`. Leia a seção
que interessa antes de mexer; abaixo está só o que não pode ser esquecido.

## Cores

| Papel | Valor | Classe |
|---|---|---|
| Fundo | `#0D0D0D` | `bg-ink` |
| Cartão | `#151515` | `bg-ink-raised` |
| Texto secundário pequeno | `#8C8C8C` (5,4:1 no cartão) | `text-ink-muted` |
| Texto de corpo | neutral-400 / neutral-300 | `text-neutral-400` |
| Acento | vermelho da marca | `red-500` (texto), `red-600` (botão) |
| WhatsApp | verde só no WhatsApp | `green-600`; o botão flutuante usa o oficial `#25D366` |

Nunca usar `text-neutral-500` ou mais escuro em texto pequeno: não chega a 4,5:1. Sem degradê em botão,
sem sombra colorida, sem caixa alta, sem segundo acento.

## Peças (importar de `components/site/styles.ts` e `components/promo/ui.tsx`)

Seção `SECTION` + `CONTAINER`, título `TITLE`, rótulo `EYEBROW`, texto `LEAD`, cartão `CARD` / `CARD_LINK`,
botões `BTN_PRIMARY` / `BTN_GHOST` / `BTN_WHATSAPP`, campo `INPUT` + `LABEL`, entrada ao rolar `Reveal`.
Cartão `rounded-[28px] border-white/10`, botão em pílula, título com `tracking-[-0.035em]`.

## Painel administrativo

Mesmo fundo e mesmas peças. Use `components/admin/AdminNav.tsx` (cápsula com `crumb`, `progress` e ações), as classes de `components/admin/ui.ts`
(`BTN_PRIMARY`, `BTN_ICON`, `CHIP_ON/OFF`, `BADGE_*`) e, no lugar de `alert` e `confirm`, `notify` e `askConfirm` de `components/admin/Feedback.tsx`.
Páginas de texto longo usam `components/site/LegalLayout.tsx`. Foto de produto usa `PHOTO_STUDIO`.

## Regras de leitura (o usuário pediu pouca informação por tela)

- Uma ideia por seção: rótulo, título, uma frase, e o conteúdo. Lista longa vira "Ver todas".
- Título todo branco; o vermelho fica em rótulo, ícone e botão.
- Foto de produto tem fundo branco (`mix-blend-mode: multiply`): moldura clara com `PHOTO_STUDIO` (ou `bg-white` em miniatura).

## Acessibilidade (ui-ux-pro-max + Vercel Web Interface Guidelines)

- Alvo de toque de pelo menos 44 px (`h-11 w-11`) e 8 px entre alvos.
- Foco visível em tudo que clica; `cursor-pointer` em botão que não é `<button>` padrão.
- Nada de `transition: all`: liste as propriedades. `touch-action: manipulation` já vem do CSS global.
- Movimento reduzido: vídeo e animações contínuas param (`useReducedMotion`). Vídeo que toca sozinho
  tem botão de pausar e só roda com a seção na tela (ver `components/Hero.tsx`).
- Reticências `…` nos textos, `autoComplete`/`inputMode`/`spellCheck` nos campos, `width`/`height` em imagens.

## Não fazer

- Não copiar a paleta clara azul-marinho nem a Plus Jakarta Sans que o ui-ux-pro-max sugere: contraria a `/promo`.
- Não inventar número, preço ou foto de gente identificável. Confirmar com o Paulo o que não estiver nos docs.
- Não commitar nem dar push sem o usuário pedir.
