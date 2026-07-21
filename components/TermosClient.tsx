'use client'

import { motion } from 'framer-motion'
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, Shield, Gavel, Phone } from 'lucide-react'
import Link from 'next/link'

export default function TermosClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-red-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <Scale className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Termos de Uso</h1>
            <p className="text-xl text-gray-200">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            {/* Introdução */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bem-vindo ao Grupo Venda Forte</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Estes Termos de Uso regem o acesso e utilização do website do Grupo Venda Forte, bem como todos os serviços relacionados oferecidos pela empresa, incluindo venda, locação e manutenção de empilhadeiras e equipamentos industriais.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Ao acessar ou usar nosso site e serviços, você declara que leu, entendeu e concorda em cumprir estes Termos de Uso. Se você não concordar com estes termos, por favor, não utilize nossos serviços.
              </p>
            </div>

            {/* Definições */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">1. Definições</h2>
              </div>
              <div className="ml-11 space-y-3 text-gray-600">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>"Empresa", "Nós", "Nosso":</strong> Refere-se ao Grupo Venda Forte, com sede em Chapecó - SC</li>
                  <li><strong>"Usuário", "Você", "Cliente":</strong> Pessoa física ou jurídica que acessa nosso site ou utiliza nossos serviços</li>
                  <li><strong>"Site":</strong> O website localizado em grupovendaforte.com e todos os seus subdomínios</li>
                  <li><strong>"Serviços":</strong> Venda, locação, fornecimento de peças e manutenção de empilhadeiras e equipamentos industriais</li>
                  <li><strong>"Conteúdo":</strong> Textos, imagens, vídeos, dados e demais materiais disponíveis no site</li>
                </ul>
              </div>
            </div>

            {/* Aceitação dos Termos */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">2. Condições de Uso</h2>
              </div>
              <div className="ml-11 space-y-3 text-gray-600">
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
                <AlertTriangle className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">3. Orçamentos e Propostas Comerciais</h2>
              </div>
              <div className="ml-11 space-y-3 text-gray-600">
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
                <Shield className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">4. Propriedade Intelectual</h2>
              </div>
              <div className="ml-11 space-y-3 text-gray-600">
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
                <XCircle className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">5. Limitação de Responsabilidade</h2>
              </div>
              <div className="ml-11 space-y-3 text-gray-600">
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
                <Gavel className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">6. Condições Específicas dos Serviços</h2>
              </div>
              <div className="ml-11 space-y-4 text-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">6.1 Venda de Equipamentos</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Sujeito a condições e prazos de entrega definidos em contrato</li>
                    <li>Garantia conforme especificada na proposta e legislação vigente</li>
                    <li>Prazo de cancelamento conforme Código de Defesa do Consumidor</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">6.2 Locação de Equipamentos</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Prazo mínimo de locação definido em contrato</li>
                    <li>Responsabilidade por danos ao equipamento durante o período de locação</li>
                    <li>Seguro de equipamento pode ser exigido conforme análise</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">6.3 Manutenção e Peças</h3>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modificações nos Termos</h2>
              <div className="ml-11 text-gray-600">
                <p>
                  O Grupo Venda Forte reserva-se o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação no site. O uso continuado de nossos serviços após a publicação das alterações constitui sua aceitação dos novos termos.
                </p>
              </div>
            </div>

            {/* Lei Aplicável */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Lei Aplicável e Foro</h2>
              <div className="ml-11 text-gray-600">
                <p>
                  Estes Termos de Uso são regidos pela legislação brasileira. As partes elegem o foro da comarca de Chapecó - SC como o foro competente para dirimir quaisquer controvérsias oriundas destes termos, com renúncia a qualquer outro, por mais privilegiado que seja.
                </p>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border-l-4 border-red-600">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="text-red-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">9. Contato</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Grupo Venda Forte</strong></p>
                <p>E-mail: <a href="mailto:comercial@grupovendaforte.com" className="text-red-600 hover:text-red-700 font-semibold">comercial@grupovendaforte.com</a></p>
                <p>Telefone: <a href="tel:+554933239050" className="text-red-600 hover:text-red-700 font-semibold">(49) 3323-9050</a></p>
                <p>Endereço: Chapecó - SC</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
            >
              ← Voltar para o site principal
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
