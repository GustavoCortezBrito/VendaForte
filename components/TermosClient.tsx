import { FileText, CheckCircle, XCircle, AlertTriangle, Shield, Gavel, Phone } from 'lucide-react'
import Link from 'next/link'
import PageHeader from '@/components/site/PageHeader'

export default function TermosClient() {
  return (
    <div className="min-h-screen bg-ink">
      <PageHeader
        eyebrow="Condições de uso do site"
        title="Termos de Uso"
        lead={<p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>}
      />

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-[28px] border border-white/10 bg-ink-raised p-8 md:p-12"
          >
            {/* Introdução */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Bem-vindo ao Grupo Venda Forte</h2>
              <p className="text-neutral-400 leading-relaxed mb-4">
                Estes Termos de Uso regem o acesso e utilização do website do Grupo Venda Forte, bem como todos os serviços relacionados oferecidos pela empresa, incluindo venda, locação e manutenção de empilhadeiras e equipamentos industriais.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                Ao acessar ou usar nosso site e serviços, você declara que leu, entendeu e concorda em cumprir estes Termos de Uso. Se você não concordar com estes termos, por favor, não utilize nossos serviços.
              </p>
            </div>

            {/* Definições */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-red-500" size={28} />
                <h2 className="text-2xl font-bold text-white">1. Definições</h2>
              </div>
              <div className="ml-11 space-y-3 text-neutral-400">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>“Empresa”, “Nós”, “Nosso”:</strong> Refere-se ao Grupo Venda Forte, com sede em Chapecó - SC</li>
                  <li><strong>“Usuário”, “Você”, “Cliente”:</strong> Pessoa física ou jurídica que acessa nosso site ou utiliza nossos serviços</li>
                  <li><strong>“Site”:</strong> O website localizado em grupovendaforte.com e todos os seus subdomínios</li>
                  <li><strong>“Serviços”:</strong> Venda, locação, fornecimento de peças e manutenção de empilhadeiras e equipamentos industriais</li>
                  <li><strong>“Conteúdo”:</strong> Textos, imagens, vídeos, dados e demais materiais disponíveis no site</li>
                </ul>
              </div>
            </div>

            {/* Aceitação dos Termos */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-red-500" size={28} />
                <h2 className="text-2xl font-bold text-white">2. Condições de Uso</h2>
              </div>
              <div className="ml-11 space-y-3 text-neutral-400">
                <p>Ao navegar pelo site do Grupo Venda Forte, você concorda em:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Fornecer dados verídicos, precisos e atualizados ao solicitar orçamentos ou entrar em contato</li>
                  <li>Não tentar interferir na segurança, integridade ou funcionamento do site ou sistemas relacionados</li>
                  <li>Não utilizar scrapers, robôs ou ferramentas automáticas de coleta de dados sem autorização expressa</li>
                  <li>Respeitar os direitos de propriedade intelectual de todo conteúdo publicado</li>
                  <li>Não utilizar o site para fins ilícitos ou que violem a legislação brasileira vigente</li>
                  <li>Não transmitir vírus, malware ou qualquer código de natureza destrutiva</li>
                  <li>Não se passar por outra pessoa ou entidade</li>
                </ul>
              </div>
            </div>

            {/* Orçamentos e Propostas */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500" size={28} />
                <h2 className="text-2xl font-bold text-white">3. Orçamentos e Propostas Comerciais</h2>
              </div>
              <div className="ml-11 space-y-3 text-neutral-400">
                <p>
                  As especificações técnicas, valores e disponibilidade de empilhadeiras e equipamentos divulgados no site têm caráter informativo e estão sujeitos a confirmação mediante proposta formal emitida por nossa equipe comercial.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                  <li>Os preços apresentados podem variar conforme condições de mercado, estoque e negociação</li>
                  <li>A proposta formal enviada por e-mail ou WhatsApp é o documento válido para fins contratuais</li>
                  <li>Orçamentos têm validade especificada em cada proposta individual</li>
                  <li>Solicitações de orçamento não implicam obrigação de compra por parte do usuário</li>
                  <li>O aceite da proposta está sujeito à aprovação cadastral do cliente</li>
                </ul>
              </div>
            </div>

            {/* Propriedade Intelectual */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-red-500" size={28} />
                <h2 className="text-2xl font-bold text-white">4. Propriedade Intelectual</h2>
              </div>
              <div className="ml-11 space-y-3 text-neutral-400">
                <p>
                  Todo o conteúdo disponível no site do Grupo Venda Forte, incluindo mas não se limitando a textos, imagens, logotipos, marcas, vídeos, layouts e código-fonte, é de propriedade exclusiva do Grupo Venda Forte ou de seus licenciantes.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                  <li>É proibida a reprodução, distribuição ou modificação sem autorização prévia e por escrito</li>
                  <li>As marcas registradas exibidas são de propriedade de seus respectivos titulares</li>
                  <li>O uso não autorizado pode resultar em ações legais cabíveis</li>
                </ul>
              </div>
            </div>

            {/* Limitação de Responsabilidade */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="text-red-500" size={28} />
                <h2 className="text-2xl font-bold text-white">5. Limitação de Responsabilidade</h2>
              </div>
              <div className="ml-11 space-y-3 text-neutral-400">
                <p>O Grupo Venda Forte não se responsabiliza por:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Danos resultantes do uso ou impossibilidade de uso do site</li>
                  <li>Interrupções temporárias do serviço por razões técnicas ou de manutenção</li>
                  <li>Imprecisões ou erros tipográficos no conteúdo do site</li>
                  <li>Links externos que possam direcionar a sites de terceiros</li>
                  <li>Danos causados por vírus, malware ou outros elementos prejudiciais que possam infectar seu equipamento</li>
                  <li>Perdas decorrentes de decisões tomadas com base em informações do site sem confirmação formal</li>
                </ul>
              </div>
            </div>

            {/* Serviços de Empilhadeiras */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="text-red-500" size={28} />
                <h2 className="text-2xl font-bold text-white">6. Condições Específicas dos Serviços</h2>
              </div>
              <div className="ml-11 space-y-4 text-neutral-400">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.1 Venda de Equipamentos</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Sujeito a condições e prazos de entrega definidos em contrato</li>
                    <li>Garantia conforme especificada na proposta e legislação vigente</li>
                    <li>Prazo de cancelamento conforme Código de Defesa do Consumidor</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.2 Locação de Equipamentos</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Prazo mínimo de locação definido em contrato</li>
                    <li>Responsabilidade por danos ao equipamento durante o período de locação</li>
                    <li>Seguro de equipamento pode ser exigido conforme análise</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.3 Manutenção e Peças</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Laudos técnicos emitidos por profissionais habilitados</li>
                    <li>Peças com garantia do fabricante conforme especificado</li>
                    <li>Mão de obra garantida conforme condições do contrato de serviço</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modificações nos Termos */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">7. Modificações nos Termos</h2>
              <div className="ml-11 text-neutral-400">
                <p>
                  O Grupo Venda Forte reserva-se o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação no site. O uso continuado de nossos serviços após a publicação das alterações constitui sua aceitação dos novos termos.
                </p>
              </div>
            </div>

            {/* Lei Aplicável */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">8. Lei Aplicável e Foro</h2>
              <div className="ml-11 text-neutral-400">
                <p>
                  Estes Termos de Uso são regidos pela legislação brasileira. As partes elegem o foro da comarca de Chapecó - SC como o foro competente para dirimir quaisquer controvérsias oriundas destes termos, com renúncia a qualquer outro, por mais privilegiado que seja.
                </p>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-gradient-to-r from-red-500/10 to-orange-50 p-6 rounded-2xl border-l-4 border-red-600">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="text-red-500" size={24} />
                <h2 className="text-2xl font-bold text-white">9. Contato</h2>
              </div>
              <p className="text-neutral-400 mb-4">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="space-y-2 text-neutral-300">
                <p><strong>Grupo Venda Forte</strong></p>
                <p>E-mail: <a href="mailto:comercial@grupovendaforte.com" className="text-red-500 hover:text-red-300 font-semibold">comercial@grupovendaforte.com</a></p>
                <p>Telefone: <a href="tel:+554933239050" className="text-red-500 hover:text-red-300 font-semibold">(49) 3323-9050</a></p>
                <p>Endereço: Chapecó - SC</p>
              </div>
            </div>
          </div>

          <div
            className="mt-8 text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-red-500 hover:text-red-300 font-semibold"
            >
              ← Voltar para o site principal
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
