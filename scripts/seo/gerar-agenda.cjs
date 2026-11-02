// Gera a agenda de conteúdo da Venda Forte (blog, redes, páginas, revisões, prazos e datas especiais)
// a partir das regras do calendário (aba "Calendário" do documento). Saídas:
//   docs/seo/agenda-conteudo.json               lista única: aba "Agenda dia a dia", Kanban e Google Agenda
//   docs/seo/agenda-conteudo-venda-forte.ics    tudo, para quem produz o conteúdo
//   docs/seo/agenda-cliente-venda-forte.ics     só posts, páginas, revisões, prazos e datas (Paulo e Rodrigo)
// Uso: node scripts/seo/gerar-agenda.cjs
// Para confirmar ou cancelar uma data especial, mude `confirmado` em ESPECIAIS e rode de novo.
// Os ids são estáveis: o Kanban e o Google Agenda reconhecem o mesmo item depois de uma mudança.
const fs = require('node:fs')
const path = require('node:path')

const RAIZ = path.resolve(__dirname, '../..')
const SITE = 'https://www.grupovendaforte.com'
const DOC = 'https://claude.ai/artifact/K9fLHGUWLwLzU9YZ3yQ27T'
const INICIO = '2026-10-26'

// confirmado: null = a confirmar com o cliente, true = vai acontecer, false = não vai
const ESPECIAIS = {
  blackFriday: { confirmado: null },
  natal: { confirmado: null },
  // Projeto de lei do governo estadual (Alesc, fev/2026) cria feriado em 25/11; sem aprovação confirmada em 23/10/2026
  feriadoSC: { confirmado: null },
  // O post 5 (aluguel) troca de data com o post 3 se o Rodrigo passar os dados da locação até 28/10
  locacaoAntecipada: { confirmado: null },
}
const sim = (k) => ESPECIAIS[k].confirmado === true
const nao = (k) => ESPECIAIS[k].confirmado === false
const talvez = (k) => ESPECIAIS[k].confirmado === null

const FERIADOS = { '2026-11-02': 'Finados', '2026-11-20': 'Consciência Negra', '2026-12-25': 'Natal', '2027-01-01': 'Ano Novo' }
if (sim('feriadoSC')) FERIADOS['2026-11-25'] = 'Dia de Santa Catarina'
const PAUSA = ['2026-12-24', '2027-01-04'] // o blog para de 24/12 a 04/01

// Peças das redes: as frases vêm da aba "Posts, um a um"
const POSTS = [
  { n: 1, data: '2026-10-27', titulo: 'Paleteira elétrica: 1.500 ou 2.000 kg?', slug: 'paleteira-eletrica-1500-ou-2000-kg', pergunta: 'Na sua operação, a paleteira é de 1.500 ou de 2.000 kg?', carrossel: '1.500 ou 2.000 kg? 5 perguntas antes de escolher' },
  { n: 2, data: '2026-10-29', titulo: 'Empilhadeira retrátil: o que é, como funciona e quando usar', slug: 'empilhadeira-retratil-o-que-e', linkedin: 'com o dado do corredor', reel: 'Quanto corredor a retrátil economiza', nota: 'Conferir os números da CQD20LB na ficha oficial' },
  { n: 3, data: '2026-11-03', titulo: 'Empilhadeira patolada: o que é e a diferença para a semi-elétrica', slug: 'empilhadeira-patolada-o-que-e', carrossel: 'Patolada, paleteira ou retrátil: quando usar cada uma', nota: 'Confirmar se o catálogo tem modelo semi-elétrico' },
  { n: 4, data: '2026-11-05', titulo: 'Paleteira elétrica ou manual: quando a troca compensa', slug: 'paleteira-eletrica-ou-manual', reel: 'Manual contra elétrica, com a F4' },
  { n: 5, data: '2026-11-10', titulo: 'Aluguel de empilhadeira: o que entra no valor e como pedir proposta', slug: 'aluguel-de-empilhadeira-o-que-entra-no-valor', pergunta: 'Comprar ou alugar: o que pesa mais na sua decisão?', carrossel: 'O que entra no valor do aluguel', nota: 'Rodrigo: frota, prazo mínimo, cidades, o que está incluso e operador (até 05/11)' },
  { n: 6, data: '2026-11-12', titulo: 'Manutenção de empilhadeira elétrica: o que revisar e quando', slug: 'manutencao-de-empilhadeira-eletrica', reel: '3 verificações do operador antes de ligar', nota: 'Paulo: intervalos de revisão da EP, região e prazo de atendimento (até 06/11)' },
  { n: 7, data: '2026-11-17', titulo: 'Empilhadeira elétrica de 2 a 3 toneladas: o que pesa no preço', slug: 'preco-empilhadeira-eletrica-2-a-3-toneladas', pergunta: 'Na hora de comprar, o que pesa mais: capacidade, altura ou bateria?', carrossel: 'O que pesa no preço de uma empilhadeira' },
  { n: 8, data: '2026-11-19', titulo: 'Bateria da empilhadeira elétrica: carga, vida útil e troca', slug: 'bateria-empilhadeira-eletrica', linkedin: 'com a pergunta "Lítio ou chumbo-ácido: o que sua frota usa hoje?"', reel: 'Como carregar a bateria com segurança', nota: 'Rodrigo: baterias em estoque (até 12/11)' },
  { n: 9, data: '2026-11-24', titulo: 'Selecionadora de pedidos: o que é e quando compensa', slug: 'selecionadora-de-pedidos', pergunta: 'Quantos pedidos sua equipe separa por dia?', carrossel: 'Selecionadora: 4 sinais de que compensa' },
  { n: 10, data: '2026-11-26', titulo: 'EP JX1: a ficha técnica explicada', slug: 'ep-jx1-ficha-tecnica-explicada', reel: 'O JX1 em 30 segundos', nota: 'Conferir a ficha oficial do JX1 (bateria e peso)' },
  { n: 11, data: '2026-12-01', titulo: 'Rebocador elétrico: o que é e quando usar', slug: 'rebocador-eletrico', pergunta: 'Quantas viagens por turno levam carga do recebimento à linha?', carrossel: 'Quando o rebocador compensa' },
  { n: 12, data: '2026-12-03', titulo: 'EP ESL122: a ficha técnica explicada', slug: 'ep-esl122-ficha-tecnica-explicada', reel: 'A ESL122 em operação', nota: 'Conferir a ficha oficial da ESL122' },
  { n: 13, data: '2026-12-08', titulo: 'Empilhadeira a diesel: quando escolher e quais capacidades', slug: 'empilhadeira-a-diesel', pergunta: 'Sua operação é interna, externa ou as duas?', carrossel: 'Diesel ou elétrica: 4 critérios', nota: 'Rodrigo (até 01/12): a empresa vende diesel? Se não, a data recebe outro tema' },
  { n: 14, data: '2026-12-10', titulo: 'Guia do operador: como ligar, operar e carregar', slug: 'como-operar-empilhadeira-eletrica', reel: 'Checklist do operador em 30 segundos' },
  { n: 15, data: '2026-12-15', titulo: 'Checklist para pedir cotação de empilhadeira ou paleteira', slug: 'checklist-cotacao-empilhadeira', pergunta: 'Qual informação sempre falta quando você pede cotação?', carrossel: 'O que informar para pedir cotação', nota: 'Rodrigo confere a lista (até 10/12)' },
  { n: 16, data: '2026-12-17', titulo: 'EP CQD20LB: a retrátil de 12 metros explicada', slug: 'ep-cqd20lb-ficha-tecnica-explicada', linkedin: 'com a pergunta "Qual a altura do seu porta-paletes?"', reel: '12 metros de elevação', nota: 'Conferir a ficha oficial da CQD20LB' },
  { n: 17, data: '2026-12-22', titulo: 'Empilhadeira usada ou nova: o que avaliar', slug: 'empilhadeira-usada-ou-nova', pergunta: 'Usada ou nova: o que pesa mais para você?', carrossel: 'Usada ou nova: 5 pontos para avaliar', nota: 'Rodrigo (até 15/12): a empresa vende seminovas? Se não, o post vira "Quando trocar de empilhadeira: 5 sinais"' },
  { n: 18, data: '2027-01-05', titulo: 'Como comparar duas empilhadeiras pela ficha técnica', slug: 'como-comparar-empilhadeiras-ficha-tecnica', pergunta: 'Na hora de escolher, o que pesa mais: preço, prazo ou assistência?', carrossel: '4 números da ficha técnica' },
  { n: 19, data: '2027-01-07', titulo: 'Locação com ou sem operador: como funciona', slug: 'locacao-com-ou-sem-operador', reel: 'Com ou sem operador: o que muda', nota: 'Rodrigo (até 30/12): a empresa aluga com operador? Se não, o post vira "Empilhadeira com plataforma: quando usar"' },
  { n: 20, data: '2027-01-12', titulo: 'Caso de cliente: a operação antes e depois', slug: 'caso-nome-do-cliente', perguntaLivre: 'Pergunta ligada ao caso do cliente', carrossel: 'Antes e depois na operação do cliente', nota: 'Os dois (até 05/01): cliente que autorize o caso por escrito. Sem caso, a data recebe a revisão do guia de frigoríficos e câmaras frias' },
  { n: 21, data: '2027-01-14', titulo: 'EP TVL151 e TVL181: as fichas explicadas', slug: 'ep-tvl151-tvl181-fichas-explicadas', reel: 'TVL151 e TVL181 lado a lado', nota: 'Conferir as fichas oficiais da TVL151 e da TVL181' },
  { n: 22, data: '2027-01-19', titulo: 'Tema escolhido pelos dados do Google', slug: null, perguntaLivre: 'Pergunta sobre o tema escolhido', carrosselLivre: 'Carrossel sobre o tema escolhido', nota: 'Tema definido em 05/01 pelos dados do Search Console' },
  { n: 23, data: '2027-01-21', titulo: 'Locação de empilhadeira ou compra (post ampliado)', slug: 'locar-ou-comprar-empilhadeira-guia-decisao', reel: 'Alugar ou comprar em 30 segundos', nota: 'Post que já existe, ampliado com os dados da locação' },
]

const PAGINAS = [
  { key: 'locacao', data: '2026-11-09', nome: 'Locação de empilhadeiras', url: '/locacao-de-empilhadeiras', nota: 'Depende dos dados do Rodrigo' },
  { key: 'assistencia', data: '2026-11-11', nome: 'Assistência técnica EP', url: '/assistencia-tecnica-ep', nota: 'Depende dos dados do Paulo' },
  { key: 'paleteiras', data: '2026-11-13', nome: 'Paleteiras elétricas' },
  { key: 'patoladas', data: '2026-11-13', nome: 'Empilhadeiras patoladas' },
  { key: 'retrateis', data: '2026-11-13', nome: 'Empilhadeiras retráteis' },
  { key: 'pecas', data: '2026-11-16', nome: 'Peças e baterias', url: '/pecas-e-baterias', nota: 'Depende dos dados do Rodrigo' },
  { key: 'contrabalancadas', data: '2026-11-20', nome: 'Empilhadeiras contrabalançadas' },
  { key: 'selecionadoras', data: '2026-11-20', nome: 'Selecionadoras e rebocadores' },
  { key: 'ep-equipment', data: '2026-12-04', nome: 'EP Equipment, dealer oficial', url: '/ep-equipment', nota: 'Depende do texto do Paulo' },
  { key: 'diesel', data: '2026-12-11', nome: 'Empilhadeiras a diesel', nota: 'Só se o Rodrigo confirmar que a empresa vende diesel (até 01/12)' },
]

const PRAZOS = [
  { key: 'conversa', data: '2026-10-23', quem: 'Paulo e Rodrigo', texto: 'conversa sobre as datas especiais' },
  { key: 'revisor', data: '2026-10-30', quem: 'Paulo', texto: 'indicar quem faz a revisão técnica dos posts' },
  { key: 'acessos', data: '2026-10-30', quem: 'Paulo e Rodrigo', texto: 'acesso de administrador ao Instagram, Facebook, LinkedIn e Perfil da Empresa no Google' },
  { key: 'locacao', data: '2026-11-05', quem: 'Rodrigo', texto: 'dados da locação (frota, prazo mínimo, cidades, o que está incluso e operador)' },
  { key: 'assistencia', data: '2026-11-06', quem: 'Paulo', texto: 'dados da assistência técnica EP (região, prazo, marcas, frase de dealer oficial e se o "24h" do site é real)' },
  { key: 'pecas', data: '2026-11-12', quem: 'Rodrigo', texto: 'dados de peças e baterias (estoque, marcas e o que o cliente informa para cotar)' },
  { key: 'dealer', data: '2026-11-27', quem: 'Paulo', texto: 'texto de dealer oficial e endereço completo de cada unidade' },
  { key: 'diesel', data: '2026-12-01', quem: 'Rodrigo', texto: 'a empresa vende os 14 modelos a diesel do catálogo?' },
  { key: 'cotacao', data: '2026-12-10', quem: 'Rodrigo', texto: 'conferir o checklist de cotação do post 15' },
  { key: 'seminovas', data: '2026-12-15', quem: 'Rodrigo', texto: 'a empresa vende seminovas? (post 17)' },
  { key: 'operador', data: '2026-12-30', quem: 'Rodrigo', texto: 'a empresa aluga com operador? (post 19)' },
  { key: 'caso', data: '2027-01-05', quem: 'Paulo e Rodrigo', texto: 'um cliente que autorize, por escrito, o caso do post 20' },
]

const MARCOS = [
  { key: '30-dias', data: '2026-11-23', texto: 'Revisão de 30 dias: números do Search Console e do Analytics' },
  { key: '90-dias', data: '2027-01-22', texto: 'Revisão de 90 dias e plano do próximo trimestre' },
]

// Locação antecipada: o post 5 sai em 03/11 com a página de locação, e o post 3 vai para 10/11
if (sim('locacaoAntecipada')) {
  const p3 = POSTS.find((p) => p.n === 3)
  const p5 = POSTS.find((p) => p.n === 5)
  ;[p3.data, p5.data] = [p5.data, p3.data]
  PAGINAS.find((pg) => pg.key === 'locacao').data = '2026-11-03'
  PRAZOS.find((pz) => pz.key === 'locacao').data = '2026-10-28'
}

// ---------- datas ----------
const dia = (s) => new Date(s + 'T12:00:00Z')
const iso = (d) => d.toISOString().slice(0, 10)
const soma = (s, n) => { const d = dia(s); d.setUTCDate(d.getUTCDate() + n); return iso(d) }
const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const ddmm = (s) => `${s.slice(8, 10)}/${s.slice(5, 7)}`
const rotulo = (s) => `${DIAS[dia(s).getUTCDay()]} ${ddmm(s)}`
const semana = (s) => Math.floor((dia(s) - dia(INICIO)) / 864e5 / 7) + 1
const mes = (s) => (s <= '2026-11-20' ? 1 : s <= '2026-12-18' ? 2 : 3)
const util = (s) => { const w = dia(s).getUTCDay(); return w !== 0 && w !== 6 && !FERIADOS[s] }
const campanha = (s) => (mes(s) === 1 ? 'conteudo-nov26' : mes(s) === 2 ? 'conteudo-dez26' : 'conteudo-jan27')
const linkPost = (p) => (p.slug ? `${SITE}/blog/${p.slug}` : null)
const utm = (p, source, medium, s) => (p.slug ? `${linkPost(p)}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campanha(s)}&utm_content=${p.slug}` : null)

// Revisão do cliente: o D-3 da aba "Como publicar e divulgar", contado em dias úteis.
// Nunca antes de 26/10; o que cairia na pausa vai para 23/12.
function revisao(s) {
  let d = s, n = 0
  while (n < 3) { d = soma(d, -1); if (util(d)) n++ }
  if (d < '2026-10-26') d = '2026-10-26'
  if (d > '2026-12-23' && d < PAUSA[1]) d = '2026-12-23'
  return d
}
// Peça que cairia num feriado: o carrossel vai para o dia seguinte e o Reel para a segunda
const fugaFeriado = (s, passo) => { let d = s; while (FERIADOS[d]) d = soma(d, passo); return d }

// ---------- itens ----------
const itens = []
const ids = new Set()
function add(id, o) {
  if (ids.has(id)) throw new Error(`id repetido: ${id}`)
  ids.add(id)
  itens.push({ id, condicional: false, ...o })
}
const pp = (n) => `p${String(n).padStart(2, '0')}`

for (const p of POSTS) {
  const k = pp(p.n)
  const terca = dia(p.data).getUTCDay() === 2
  const base = { post: p.n, tituloPost: p.titulo }
  add(`${k}-revisao`, { ...base, data: revisao(p.data), canal: 'Revisão', titulo: `Revisar o post ${p.n}: ${p.titulo}`, responsavel: 'Paulo e Rodrigo', nota: 'Texto técnico com o Paulo, prazos e serviços com o Rodrigo, pelo WhatsApp e em até 24 horas' })
  add(`${k}-blog`, { ...base, data: p.data, hora: '09:00', canal: 'Blog', titulo: `Post ${p.n} no ar às 9h: ${p.titulo}`, link: linkPost(p), responsavel: 'Gustavo', nota: ['Pedir indexação no Search Console', p.nota].filter(Boolean).join('. ') })
  if (terca) {
    const seg = soma(p.data, -1)
    if (!FERIADOS[seg]) {
      add(`${k}-linkedin-pergunta`, { ...base, data: seg, canal: 'LinkedIn', titulo: p.pergunta ? `Pergunta: "${p.pergunta}"` : p.perguntaLivre || 'Pergunta ligada ao post da semana', responsavel: 'Gustavo' })
      add(`${k}-instagram-stories`, { ...base, data: seg, canal: 'Instagram', titulo: 'Stories com enquete, com a mesma pergunta', responsavel: 'Gustavo' })
    }
    add(`${k}-linkedin-link`, { ...base, data: p.data, canal: 'LinkedIn', titulo: `Link do post ${p.n}`, link: utm(p, 'linkedin', 'social', p.data), responsavel: 'Gustavo' })
    add(`${k}-facebook-link`, { ...base, data: p.data, canal: 'Facebook', titulo: `Link do post ${p.n}`, link: utm(p, 'facebook', 'social', p.data), responsavel: 'Gustavo', nota: p.n === 20 ? 'Marcar o cliente se ele autorizar' : undefined })
    const qua = fugaFeriado(soma(p.data, 1), 1)
    add(`${k}-instagram-carrossel`, { ...base, data: qua, canal: 'Instagram', titulo: p.carrossel ? `Carrossel "${p.carrossel}"` : p.carrosselLivre, responsavel: 'Gustavo' })
    add(`${k}-facebook-carrossel`, { ...base, data: qua, canal: 'Facebook', titulo: 'O mesmo carrossel do Instagram', responsavel: 'Gustavo' })
  } else {
    add(`${k}-linkedin-link`, { ...base, data: p.data, canal: 'LinkedIn', titulo: `Link do post ${p.n}${p.linkedin ? ' ' + p.linkedin : ''}`, link: utm(p, 'linkedin', 'social', p.data), responsavel: 'Gustavo' })
    add(`${k}-perfil-google`, { ...base, data: p.data, canal: 'Perfil Google', titulo: `Atualização com o link do post ${p.n}`, link: utm(p, 'perfil-google', 'organic', p.data), responsavel: 'Gustavo', nota: 'Foto real, duas frases e o botão "Saiba mais"' })
    const sex = fugaFeriado(soma(p.data, 1), 3)
    add(`${k}-instagram-reel`, { ...base, data: sex, canal: 'Instagram', titulo: `Reel "${p.reel}"`, responsavel: 'Gustavo' })
    add(`${k}-facebook-reel`, { ...base, data: sex, canal: 'Facebook', titulo: 'O mesmo Reel do Instagram', responsavel: 'Gustavo' })
  }
}

add('balanco-linkedin', { data: '2026-12-28', canal: 'LinkedIn', titulo: 'Balanço do ano e os guias mais lidos', responsavel: 'Gustavo' })

// Horário especial no Perfil da Empresa no Google, com o horário que o cliente passar
add('horario-finados', { data: '2026-10-30', canal: 'Perfil Google', titulo: 'Horário especial de 02/11 (Finados)', responsavel: 'Gustavo' })
add('horario-consciencia-negra', { data: '2026-11-18', canal: 'Perfil Google', titulo: `Horário especial de 20/11 (Consciência Negra)${sim('feriadoSC') ? ' e de 25/11' : ''}`, responsavel: 'Gustavo' })
add('horario-fim-de-ano', { data: '2026-12-18', canal: 'Perfil Google', titulo: 'Horário especial de 24/12 a 01/01', responsavel: 'Gustavo' })

for (const pg of PAGINAS) {
  add(`pagina-${pg.key}`, { data: pg.data, canal: 'Site', titulo: `Prazo da página: ${pg.nome}`, pagina: pg.nome, link: pg.url ? SITE + pg.url : null, responsavel: 'Gustavo', nota: [`No ar até ${ddmm(pg.data)}`, pg.nota].filter(Boolean).join('. ') })
}

// Black Friday: só com oferta real; página com endereço fixo, criada antes e com link na home
if (!nao('blackFriday')) {
  const c = talvez('blackFriday')
  add('bf-data', { data: '2026-11-27', canal: 'Data especial', titulo: 'Black Friday', condicional: c })
  add('cm-data', { data: '2026-11-30', canal: 'Data especial', titulo: 'Cyber Monday', condicional: c })
  add('bf-pagina', { data: '2026-11-13', canal: 'Site', titulo: 'Prazo da página /black-friday, com link na home', link: SITE + '/black-friday', responsavel: 'Gustavo', condicional: c, nota: 'Endereço fixo, sem o ano, reaproveitado todo ano' })
  add('bf-instagram-aviso', { data: '2026-11-23', canal: 'Instagram', titulo: 'Stories com o aviso da oferta', responsavel: 'Gustavo', condicional: c })
  add('bf-linkedin', { data: '2026-11-27', canal: 'LinkedIn', titulo: 'Post da oferta com o link da página', link: SITE + '/black-friday?utm_source=linkedin&utm_medium=social&utm_campaign=black-friday', responsavel: 'Gustavo', condicional: c })
  add('bf-instagram', { data: '2026-11-27', canal: 'Instagram', titulo: 'Post e Stories da oferta', responsavel: 'Gustavo', condicional: c })
  add('bf-facebook', { data: '2026-11-27', canal: 'Facebook', titulo: 'Post da oferta com o link da página', link: SITE + '/black-friday?utm_source=facebook&utm_medium=social&utm_campaign=black-friday', responsavel: 'Gustavo', condicional: c })
  add('bf-whatsapp', { data: '2026-11-27', canal: 'WhatsApp', titulo: 'Oferta para a base de clientes', link: SITE + '/black-friday?utm_source=whatsapp&utm_medium=referral&utm_campaign=black-friday', responsavel: 'Rodrigo', condicional: c })
  add('bf-instagram-ultimo-dia', { data: '2026-11-30', canal: 'Instagram', titulo: 'Stories com o último dia da oferta', responsavel: 'Gustavo', condicional: c })
}

if (!nao('natal')) {
  const c = talvez('natal')
  for (const canal of ['LinkedIn', 'Instagram', 'Facebook']) {
    add(`natal-${canal.toLowerCase()}`, { data: '2026-12-24', canal, titulo: 'Mensagem de Natal com o horário de fim de ano', responsavel: 'Gustavo', condicional: c, nota: 'Com o plantão da assistência técnica, se houver' })
  }
}

if (talvez('feriadoSC')) {
  add('feriado-sc', { data: '2026-11-25', canal: 'Data especial', titulo: 'Possível feriado estadual de Santa Catarina', rotulo: 'feriado estadual', condicional: true, nota: 'Se virar feriado, o carrossel do post 9 vai para 26/11' })
}
if (talvez('locacaoAntecipada')) {
  add('prazo-locacao-antecipada', { data: '2026-10-28', canal: 'Prazo', titulo: 'Rodrigo: dados da locação, para antecipar o post de aluguel para 03/11', responsavel: 'Rodrigo', condicional: true })
}

for (const [d, nome] of Object.entries(FERIADOS)) add(`feriado-${d}`, { data: d, canal: 'Feriado', titulo: nome, nota: 'Nada sai no blog nem nas redes' })
add('pausa', { data: PAUSA[0], canal: 'Marco', titulo: 'Começa a pausa do blog, que volta em 05/01', nota: 'Até 04/01 só sai o balanço do ano no LinkedIn, em 28/12' })
for (const pz of PRAZOS) add(`prazo-${pz.key}`, { data: pz.data, canal: 'Prazo', titulo: `${pz.quem}: ${pz.texto}`, responsavel: pz.quem })
for (const m of MARCOS) add(`marco-${m.key}`, { data: m.data, canal: 'Marco', titulo: m.texto, responsavel: 'Gustavo' })

// Ordem: data, depois canal
const ORDEM = ['Feriado', 'Data especial', 'Marco', 'Prazo', 'Revisão', 'Site', 'Blog', 'LinkedIn', 'Instagram', 'Facebook', 'Perfil Google', 'WhatsApp']
itens.sort((a, b) => a.data.localeCompare(b.data) || ORDEM.indexOf(a.canal) - ORDEM.indexOf(b.canal) || (a.post || 0) - (b.post || 0))
const CLIENTE = new Set(['Feriado', 'Data especial', 'Marco', 'Prazo', 'Revisão', 'Site', 'Blog', 'WhatsApp'])
for (const it of itens) {
  it.dia = rotulo(it.data)
  it.semana = semana(it.data)
  it.mes = mes(it.data)
  it.cliente = CLIENTE.has(it.canal)
}

fs.writeFileSync(path.join(RAIZ, 'docs/seo/agenda-conteudo.json'), JSON.stringify(itens, null, 1) + '\n')

// ---------- Google Agenda (.ics) ----------
const esc = (t) => String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
// Linhas de no máximo 75 bytes, quebradas sem cortar um caractere ao meio
function dobra(linha) {
  const out = []
  let s = linha
  while (Buffer.byteLength(s, 'utf8') > 74) {
    let cut = 74
    while (Buffer.byteLength(s.slice(0, cut), 'utf8') > 74) cut--
    out.push(s.slice(0, cut))
    s = ' ' + s.slice(cut)
  }
  out.push(s)
  return out.join('\r\n')
}
const ymd = (s) => s.replace(/-/g, '')
const agora = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'

function resumo(it, publico) {
  const c = it.condicional ? '(a confirmar) ' : ''
  if (it.canal === 'Revisão') return c + (publico === 'cliente' ? it.titulo : `Cliente: ${it.titulo.replace('Revisar', 'revisa')}`)
  if (it.canal === 'Prazo') return `${c}Prazo · ${it.titulo}`
  if (it.canal === 'Feriado') return `Feriado · ${it.titulo}`
  if (it.canal === 'Marco' || it.canal === 'Data especial') return c + it.titulo
  return `${c}${it.canal} · ${it.titulo}`
}

function ics(lista, publico, nome, arquivo) {
  const linhas = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Venda Forte//Agenda de conteudo//PT', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    dobra(`X-WR-CALNAME:${esc(nome)}`), 'X-WR-TIMEZONE:America/Sao_Paulo',
    // Brasília sem horário de verão
    'BEGIN:VTIMEZONE', 'TZID:America/Sao_Paulo', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:-0300', 'TZOFFSETTO:-0300', 'TZNAME:-03', 'END:STANDARD', 'END:VTIMEZONE',
  ]
  for (const it of lista) {
    const desc = [
      it.tituloPost && it.canal !== 'Blog' && it.canal !== 'Revisão' ? `Post ${it.post}: ${it.tituloPost}` : null,
      it.nota,
      it.link ? `Link: ${it.link}` : null,
      it.responsavel ? `Responsável: ${it.responsavel}` : null,
      it.condicional ? 'A confirmar com Paulo e Rodrigo' : null,
      `Calendário completo: ${DOC}`,
    ].filter(Boolean).join('\n')
    linhas.push('BEGIN:VEVENT', `UID:${it.id}@agenda-conteudo.grupovendaforte.com`, `DTSTAMP:${agora}`)
    if (it.hora) {
      const [h, m] = it.hora.split(':')
      const fim = String(Number(m) + 30).padStart(2, '0')
      linhas.push(`DTSTART;TZID=America/Sao_Paulo:${ymd(it.data)}T${h}${m}00`, `DTEND;TZID=America/Sao_Paulo:${ymd(it.data)}T${h}${fim}00`)
    } else {
      linhas.push(`DTSTART;VALUE=DATE:${ymd(it.data)}`, `DTEND;VALUE=DATE:${ymd(soma(it.data, 1))}`, 'TRANSP:TRANSPARENT')
    }
    linhas.push(dobra(`SUMMARY:${esc(resumo(it, publico))}`), dobra(`DESCRIPTION:${esc(desc)}`))
    if (it.link) linhas.push(dobra(`URL:${it.link}`))
    linhas.push('END:VEVENT')
  }
  linhas.push('END:VCALENDAR')
  fs.writeFileSync(path.join(RAIZ, 'docs/seo', arquivo), linhas.join('\r\n') + '\r\n')
  console.log(`${arquivo}: ${lista.length} eventos`)
}

ics(itens, 'equipe', 'Conteúdo Venda Forte', 'agenda-conteudo-venda-forte.ics')
ics(itens.filter((it) => it.cliente), 'cliente', 'Venda Forte: datas do conteúdo', 'agenda-cliente-venda-forte.ics')

const porCanal = itens.reduce((m, it) => ((m[it.canal] = (m[it.canal] || 0) + 1), m), {})
console.log(`itens: ${itens.length}`, porCanal)
console.log(`a confirmar: ${itens.filter((i) => i.condicional).length}`)
