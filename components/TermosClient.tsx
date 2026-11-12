import LegalLayout, { type LegalSection } from '@/components/site/LegalLayout'

const SECTIONS: LegalSection[] = [
  {
    id: 'definicoes',
    title: '1. Definições',
    body: (
      <ul>
        <li><strong>“Empresa”, “Nós”, “Nosso”:</strong> Refere-se ao Grupo Venda Forte, com sede em Chapecó - SC</li>
        <li><strong>“Usuário”, “Você”, “Cliente”:</strong> Pessoa física ou jurídica que acessa nosso site ou utiliza nossos serviços</li>
        <li><strong>“Site”:</strong> O website localizado em grupovendaforte.com e todos os seus subdomínios</li>
        <li><strong>“Serviços”:</strong> Venda, locação, fornecimento de peças e manutenção de empilhadeiras e equipamentos industriais</li>
        <li><strong>“Conteúdo”:</strong> Textos, imagens, vídeos, dados e demais materiais disponíveis no site</li>
      </ul>
    ),
  },
  {
    id: 'condicoes-de-uso',
    title: '2. Condições de Uso',
    body: (
      <>
        <p>Ao navegar pelo site do Grupo Venda Forte, você concorda em:</p>
        <ul>
          <li>Fornecer dados verídicos, precisos e atualizados ao solicitar orçamentos ou entrar em contato</li>
          <li>Não tentar interferir na segurança, integridade ou funcionamento do site ou sistemas relacionados</li>
          <li>Não utilizar scrapers, robôs ou ferramentas automáticas de coleta de dados sem autorização expressa</li>
          <li>Respeitar os direitos de propriedade intelectual de todo conteúdo publicado</li>
          <li>Não utilizar o site para fins ilícitos ou que violem a legislação brasileira vigente</li>
          <li>Não transmitir vírus, malware ou qualquer código de natureza destrutiva</li>
          <li>Não se passar por outra pessoa ou entidade</li>
        </ul>
      </>
    ),
  },
  {
    id: 'orcamentos',
    title: '3. Orçamentos e Propostas Comerciais',
    body: (
      <>
        <p>
          As especificações técnicas, valores e disponibilidade de empilhadeiras e equipamentos divulgados no site têm caráter informativo e estão sujeitos a confirmação mediante proposta formal emitida por nossa equipe comercial.
        </p>
        <ul>
          <li>Os preços apresentados podem variar conforme condições de mercado, estoque e negociação</li>
          <li>A proposta formal enviada por e-mail ou WhatsApp é o documento válido para fins contratuais</li>
          <li>Orçamentos têm validade especificada em cada proposta individual</li>
          <li>Solicitações de orçamento não implicam obrigação de compra por parte do usuário</li>
          <li>O aceite da proposta está sujeito à aprovação cadastral do cliente</li>
        </ul>
      </>
    ),
  },
  {
    id: 'propriedade-intelectual',
    title: '4. Propriedade Intelectual',
    body: (
      <>
        <p>
          Todo o conteúdo disponível no site do Grupo Venda Forte, incluindo mas não se limitando a textos, imagens, logotipos, marcas, vídeos, layouts e código-fonte, é de propriedade exclusiva do Grupo Venda Forte ou de seus licenciantes.
        </p>
        <ul>
          <li>É proibida a reprodução, distribuição ou modificação sem autorização prévia e por escrito</li>
          <li>As marcas registradas exibidas são de propriedade de seus respectivos titulares</li>
          <li>O uso não autorizado pode resultar em ações legais cabíveis</li>
        </ul>
      </>
    ),
  },
  {
    id: 'responsabilidade',
    title: '5. Limitação de Responsabilidade',
    body: (
      <>
        <p>O Grupo Venda Forte não se responsabiliza por:</p>
        <ul>
          <li>Danos resultantes do uso ou impossibilidade de uso do site</li>
          <li>Interrupções temporárias do serviço por razões técnicas ou de manutenção</li>
          <li>Imprecisões ou erros tipográficos no conteúdo do site</li>
          <li>Links externos que possam direcionar a sites de terceiros</li>
          <li>Danos causados por vírus, malware ou outros elementos prejudiciais que possam infectar seu equipamento</li>
          <li>Perdas decorrentes de decisões tomadas com base em informações do site sem confirmação formal</li>
        </ul>
      </>
    ),
  },
  {
    id: 'servicos',
    title: '6. Condições Específicas dos Serviços',
    body: (
      <>
        <h3>6.1 Venda de Equipamentos</h3>
        <ul>
          <li>Sujeito a condições e prazos de entrega definidos em contrato</li>
          <li>Garantia conforme especificada na proposta e legislação vigente</li>
          <li>Prazo de cancelamento conforme Código de Defesa do Consumidor</li>
        </ul>
        <h3>6.2 Locação de Equipamentos</h3>
        <ul>
          <li>Prazo mínimo de locação definido em contrato</li>
          <li>Responsabilidade por danos ao equipamento durante o período de locação</li>
          <li>Seguro de equipamento pode ser exigido conforme análise</li>
        </ul>
        <h3>6.3 Manutenção e Peças</h3>
        <ul>
          <li>Laudos técnicos emitidos por profissionais habilitados</li>
          <li>Peças com garantia do fabricante conforme especificado</li>
          <li>Mão de obra garantida conforme condições do contrato de serviço</li>
        </ul>
      </>
    ),
  },
  {
    id: 'modificacoes',
    title: '7. Modificações nos Termos',
    body: (
      <p>
        O Grupo Venda Forte reserva-se o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação no site. O uso continuado de nossos serviços após a publicação das alterações constitui sua aceitação dos novos termos.
      </p>
    ),
  },
  {
    id: 'foro',
    title: '8. Lei Aplicável e Foro',
    body: (
      <p>
        Estes Termos de Uso são regidos pela legislação brasileira. As partes elegem o foro da comarca de Chapecó - SC como o foro competente para dirimir quaisquer controvérsias oriundas destes termos, com renúncia a qualquer outro, por mais privilegiado que seja.
      </p>
    ),
  },
]

export default function TermosClient() {
  return (
    <LegalLayout
      eyebrow="Condições de uso do site"
      title="Termos de Uso"
      updated={`Última atualização: ${new Date().toLocaleDateString('pt-BR')}`}
      intro={
        <>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">Bem-vindo ao Grupo Venda Forte</h2>
          <p>
            Estes Termos de Uso regem o acesso e utilização do website do Grupo Venda Forte, bem como todos os serviços relacionados oferecidos pela empresa, incluindo venda, locação e manutenção de empilhadeiras e equipamentos industriais.
          </p>
          <p>
            Ao acessar ou usar nosso site e serviços, você declara que leu, entendeu e concorda em cumprir estes Termos de Uso. Se você não concordar com estes termos, por favor, não utilize nossos serviços.
          </p>
        </>
      }
      sections={SECTIONS}
      contact={{
        title: '9. Contato',
        lines: (
          <>
            <p>Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:</p>
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
