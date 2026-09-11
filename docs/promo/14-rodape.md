# Seção 14 — Rodapé e notas

**Componente:** `components/promo/PromoFooter.tsx`

## 1. Objetivo

Encerrar com credenciamento institucional e sustentar juridicamente as afirmações
comerciais feitas ao longo da página. É aqui que moram as notas que dão lastro aos
números das seções 04 e 05.

## 2. Layout

### Desktop, ≥ 768 px

Três faixas, container `max-w-7xl`, seção com `py-12`, borda superior branca a 6%.

1. **Faixa 1:** logo e selo de representante à esquerda, contatos à direita
2. **Faixa 2:** notas obrigatórias, `text-xs text-neutral-600`, em duas colunas
3. **Faixa 3:** direitos autorais à esquerda, links à direita, separada por borda

### Mobile, < 768 px

Tudo centralizado e empilhado, `gap-6`. Notas em coluna única. Reservar `pb-20` para a
barra fixa de WhatsApp não cobrir os links.

## 3. Copy

- **Assinatura:** Grupo Venda Forte · Representante oficial EP Equipment
- **Selo:** Faturamento direto com nota fiscal

### Contatos

- WhatsApp: (49) 98839-5635
- Chapecó: (49) 3323-9050
- Joinville: (47) 3842-3333
- comercial@grupovendaforte.com

### Notas obrigatórias

1. Condições válidas para o lote da campanha, enquanto durar o estoque, até [data].
2. Preços sujeitos a alteração sem aviso prévio e não incluem frete nem impostos quando
   aplicável. Confirmar redação com [responsável jurídico].
3. Financiamento BNDES e Finame sujeito a análise de crédito da instituição financeira.
4. Metodologia dos números de economia: [premissas de turno, tarifa e preço do GLP].
5. Garantia de 5 anos aplicável à bateria conforme os termos da EP Equipment. Verificar
   cobertura por componente.
6. Imagens meramente ilustrativas. O equipamento entregue segue a configuração da
   proposta comercial.

- **Direitos:** © [ano] Grupo Venda Forte. Todos os direitos reservados.
- **Links:** Termos · Privacidade · Site principal

## 4. Animações

Nenhuma. O rodapé não anima. Entrada animada em rodapé só atrasa quem está procurando um
telefone.

Única transição: cor dos links no hover, 300 ms.

## 5. Imagens

| Arquivo | Descrição | Dimensão | Tratamento | Alt |
|---|---|---|---|---|
| `public/logo.png` | Logo do Grupo Venda Forte | Exibido a 128 × 36 | `object-contain`, `loading="lazy"` | Grupo Venda Forte |

Sem selo de bandeira de cartão, sem imagem de certificado que a empresa não possua.

## 6. Acessibilidade

- Telefones e e-mail como links de discagem e de correio
- Contraste das notas precisa passar em 4.5:1. O cinza mais escuro da paleta reprova em
  texto pequeno, usar o tom imediatamente mais claro
- O ano dos direitos autorais é calculado, não escrito à mão

## 7. Critérios de aceite

1. Nenhuma nota fica atrás de link ou acordeão. Todas visíveis sem interação
2. A nota de metodologia existe sempre que a seção 04 exibir barras com números
3. A barra fixa de WhatsApp não cobre os links do rodapé em nenhuma altura de tela
4. Os telefones são os reais e conferem com os do site principal
