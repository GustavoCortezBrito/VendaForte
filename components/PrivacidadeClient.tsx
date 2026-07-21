'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText, Users, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function PrivacidadeClient() {
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
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Política de Privacidade</h1>
            <p className="text-xl text-gray-200">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl p-8 md:p-12">

            {/* Introdução */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introdução</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                O Grupo Venda Forte está comprometido em proteger a privacidade e a segurança dos dados pessoais de nossos clientes, parceiros e visitantes do nosso site. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Ao utilizar nossos serviços e/ou nosso website, você concorda com a coleta e uso de informações de acordo com esta política.
              </p>
            </div>

            {/* Informações que Coletamos */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">1. Informações que Coletamos</h2>
              </div>
              <div className="space-y-4 ml-11">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1.1. Informações Fornecidas Voluntariamente</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Nome completo</li>
                    <li>E-mail</li>
                    <li>Telefone</li>
                    <li>Empresa/Razão Social</li>
                    <li>Cidade e Estado</li>
                    <li>Mensagens e solicitações enviadas através dos formulários de contato</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1.2. Informações Coletadas Automaticamente</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador</li>
                    <li>Páginas visitadas</li>
                    <li>Tempo de permanência no site</li>
                    <li>Sistema operacional</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Como Usamos */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">2. Como Usamos suas Informações</h2>
              </div>
              <div className="ml-11 space-y-3 text-gray-600">
                <p>Utilizamos as informações coletadas para:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Responder às suas solicitações de contato e orçamentos</li>
                  <li>Fornecer informações sobre nossos produtos e serviços</li>
                  <li>Processar pedidos e transações</li>
                  <li>Melhorar nosso site e experiência do usuário</li>
                  <li>Enviar comunicações de marketing (com seu consentimento)</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                  <li>Prevenir fraudes e garantir a segurança</li>
                  <li>Realizar análises estatísticas e pesquisas de mercado</li>
                </ul>
              </div>
            </div>

            {/* Compartilhamento */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">3. Compartilhamento de Informações</h2>
              </div>
              <div className="ml-11 space-y-3 text-gray-600">
                <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto nas seguintes situações:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Fornecedores de Serviços:</strong> Compartilhamos com empresas que nos auxiliam em operações como hospedagem de site, análise de dados e processamento de pagamentos</li>
                  <li><strong>Obrigações Legais:</strong> Quando exigido por lei ou para proteger nossos direitos legais</li>
                  <li><strong>Parceiros Comerciais:</strong> Com seu consentimento explícito, para ofertas relevantes</li>
                  <li><strong>Transferência de Negócios:</strong> Em caso de fusão, aquisição ou venda de ativos</li>
                </ul>
              </div>
            </div>

            {/* Segurança */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">4. Segurança dos Dados</h2>
              </div>
              <div className="ml-11 space-y-3 text-gray-600">
                <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Criptografia de dados sensíveis (SSL/TLS)</li>
                  <li>Controles de acesso restritos</li>
                  <li>Monitoramento contínuo de sistemas</li>
                  <li>Backups regulares</li>
                  <li>Treinamento de equipe sobre proteção de dados</li>
                  <li>Atualizações de segurança regulares</li>
                </ul>
                <p className="mt-4">
                  No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro. Embora nos esforcemos para proteger suas informações, não podemos garantir segurança absoluta.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies e Tecnologias Similares</h2>
              <div className="ml-11 space-y-3 text-gray-600">
                <p>Utilizamos cookies para melhorar sua experiência em nosso site. Cookies são pequenos arquivos armazenados em seu dispositivo que nos ajudam a:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Lembrar suas preferências</li>
                  <li>Entender como você usa nosso site</li>
                  <li>Melhorar o desempenho do site</li>
                  <li>Personalizar conteúdo</li>
                </ul>
                <p className="mt-4">Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.</p>
              </div>
            </div>

            {/* Direitos LGPD */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">6. Seus Direitos (LGPD)</h2>
              </div>
              <div className="ml-11 space-y-3 text-gray-600">
                <p>De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), você tem os seguintes direitos:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Acesso:</strong> Solicitar informações sobre os dados que mantemos sobre você</li>
                  <li><strong>Retificação:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li><strong>Exclusão:</strong> Solicitar a eliminação de seus dados pessoais</li>
                  <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                  <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                  <li><strong>Oposição:</strong> Opor-se ao tratamento de seus dados</li>
                  <li><strong>Informação:</strong> Conhecer as entidades com as quais compartilhamos dados</li>
                </ul>
                <p className="mt-4">
                  Para exercer seus direitos, entre em contato conosco através do e-mail:{' '}
                  <a href="mailto:comercial@grupovendaforte.com" className="text-red-600 hover:text-red-700 font-semibold">comercial@grupovendaforte.com</a>
                </p>
              </div>
            </div>

            {/* Retenção */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retenção de Dados</h2>
              <div className="ml-11 text-gray-600">
                <p>Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, incluindo requisitos legais, contábeis ou de relatórios.</p>
              </div>
            </div>

            {/* Menores */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Menores de Idade</h2>
              <div className="ml-11 text-gray-600">
                <p>Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente informações de menores. Se você acredita que coletamos dados de um menor, entre em contato conosco imediatamente.</p>
              </div>
            </div>

            {/* Alterações */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Alterações nesta Política</h2>
              <div className="ml-11 text-gray-600">
                <p>Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas através do nosso site ou por e-mail. Recomendamos que você revise esta página regularmente.</p>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border-l-4 border-red-600">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contato do Encarregado de Dados (DPO)</h2>
              <p className="text-gray-600 mb-4">Para questões sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato:</p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Grupo Venda Forte</strong></p>
                <p>E-mail: <a href="mailto:comercial@grupovendaforte.com" className="text-red-600 hover:text-red-700 font-semibold">comercial@grupovendaforte.com</a></p>
                <p>Telefone: <a href="tel:+554933239050" className="text-red-600 hover:text-red-700 font-semibold">(49) 3323-9050</a></p>
                <p>Endereço: Chapecó - SC</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold">
              ← Voltar para o site
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
