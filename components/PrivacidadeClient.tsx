import LegalLayout, { type LegalSection } from '@/components/site/LegalLayout'

const SECTIONS: LegalSection[] = [
  {
    id: 'informacoes-coletadas',
    title: '1. Informações que Coletamos',
    body: (
      <>
        <h3>1.1. Informações Fornecidas Voluntariamente</h3>
        <ul>
          <li>Nome completo</li>
          <li>E-mail</li>
          <li>Telefone</li>
          <li>Empresa/Razão Social</li>
          <li>Cidade e Estado</li>
          <li>Mensagens e solicitações enviadas através dos formulários de contato</li>
        </ul>
        <h3>1.2. Informações Coletadas Automaticamente</h3>
        <ul>
          <li>Endereço IP</li>
          <li>Tipo de navegador</li>
          <li>Páginas visitadas</li>
          <li>Tempo de permanência no site</li>
          <li>Sistema operacional</li>
          <li>Cookies e tecnologias similares</li>
        </ul>
      </>
    ),
  },
  {
    id: 'como-usamos',
    title: '2. Como Usamos suas Informações',
    body: (
      <>
        <p>Utilizamos as informações coletadas para:</p>
        <ul>
          <li>Responder às suas solicitações de contato e orçamentos</li>
          <li>Fornecer informações sobre nossos produtos e serviços</li>
          <li>Processar pedidos e transações</li>
          <li>Melhorar nosso site e experiência do usuário</li>
          <li>Enviar comunicações de marketing (com seu consentimento)</li>
          <li>Cumprir obrigações legais e regulatórias</li>
          <li>Prevenir fraudes e garantir a segurança</li>
          <li>Realizar análises estatísticas e pesquisas de mercado</li>
        </ul>
      </>
    ),
  },
  {
    id: 'compartilhamento',
    title: '3. Compartilhamento de Informações',
    body: (
      <>
        <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto nas seguintes situações:</p>
        <ul>
          <li><strong>Fornecedores de Serviços:</strong> Compartilhamos com empresas que nos auxiliam em operações como hospedagem de site, análise de dados e processamento de pagamentos</li>
          <li><strong>Obrigações Legais:</strong> Quando exigido por lei ou para proteger nossos direitos legais</li>
          <li><strong>Parceiros Comerciais:</strong> Com seu consentimento explícito, para ofertas relevantes</li>
          <li><strong>Transferência de Negócios:</strong> Em caso de fusão, aquisição ou venda de ativos</li>
        </ul>
      </>
    ),
  },
  {
    id: 'seguranca',
    title: '4. Segurança dos Dados',
    body: (
      <>
        <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais:</p>
        <ul>
          <li>Criptografia de dados sensíveis (SSL/TLS)</li>
          <li>Controles de acesso restritos</li>
          <li>Monitoramento contínuo de sistemas</li>
          <li>Backups regulares</li>
          <li>Treinamento de equipe sobre proteção de dados</li>
          <li>Atualizações de segurança regulares</li>
        </ul>
        <p>
          No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro. Embora nos esforcemos para proteger suas informações, não podemos garantir segurança absoluta.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '5. Cookies e Tecnologias Similares',
    body: (
      <>
        <p>Utilizamos cookies para melhorar sua experiência em nosso site. Cookies são pequenos arquivos armazenados em seu dispositivo que nos ajudam a:</p>
        <ul>
          <li>Lembrar suas preferências</li>
          <li>Entender como você usa nosso site</li>
          <li>Melhorar o desempenho do site</li>
          <li>Personalizar conteúdo</li>
        </ul>
        <p>Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.</p>
      </>
    ),
  },
  {
    id: 'direitos',
    title: '6. Seus Direitos (LGPD)',
    body: (
      <>
        <p>De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), você tem os seguintes direitos:</p>
        <ul>
          <li><strong>Acesso:</strong> Solicitar informações sobre os dados que mantemos sobre você</li>
          <li><strong>Retificação:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li><strong>Exclusão:</strong> Solicitar a eliminação de seus dados pessoais</li>
          <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
          <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
          <li><strong>Oposição:</strong> Opor-se ao tratamento de seus dados</li>
          <li><strong>Informação:</strong> Conhecer as entidades com as quais compartilhamos dados</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato conosco através do e-mail:{' '}
          <a href="mailto:comercial@grupovendaforte.com">comercial@grupovendaforte.com</a>
        </p>
      </>
    ),
  },
  {
    id: 'retencao',
    title: '7. Retenção de Dados',
    body: (
      <p>Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, incluindo requisitos legais, contábeis ou de relatórios.</p>
    ),
  },
  {
    id: 'menores',
    title: '8. Menores de Idade',
    body: (
      <p>Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente informações de menores. Se você acredita que coletamos dados de um menor, entre em contato conosco imediatamente.</p>
    ),
  },
  {
    id: 'alteracoes',
    title: '9. Alterações nesta Política',
    body: (
      <p>Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas através do nosso site ou por e-mail. Recomendamos que você revise esta página regularmente.</p>
    ),
  },
]

export default function PrivacidadeClient() {
  return (
    <LegalLayout
      eyebrow="LGPD"
      title="Política de Privacidade"
      updated={`Última atualização: ${new Date().toLocaleDateString('pt-BR')}`}
      intro={
        <>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">Introdução</h2>
          <p>
            O Grupo Venda Forte está comprometido em proteger a privacidade e a segurança dos dados pessoais de nossos clientes, parceiros e visitantes do nosso site. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
          </p>
          <p>
            Ao utilizar nossos serviços e/ou nosso website, você concorda com a coleta e uso de informações de acordo com esta política.
          </p>
        </>
      }
      sections={SECTIONS}
      contact={{
        title: '10. Contato do Encarregado de Dados (DPO)',
        lines: (
          <>
            <p>Para questões sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato:</p>
            <p><strong>Grupo Venda Forte</strong></p>
            <p>E-mail: <a href="mailto:comercial@grupovendaforte.com">comercial@grupovendaforte.com</a></p>
            <p>Telefone: <a href="tel:+554933239050">(49) 3323-9050</a></p>
            <p>Endereço: Chapecó - SC</p>
          </>
        ),
      }}
    />
  )
}
