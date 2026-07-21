'use client'

import { motion } from 'framer-motion'
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, Shield } from 'lucide-react'
import Link from 'next/link'

export default function TermosPage() {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Scale className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Termos de Uso
            </h1>
            <p className="text-xl text-gray-200">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
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
                Estes Termos de Uso regem o acesso e utilização do website do Grupo Venda Forte, localizado em grupovendaforte.com, bem como todos os serviços relacionados oferecidos pela empresa.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Ao acessar ou usar nosso site e serviços, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso site ou serviços.
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
                  <li><strong>"Empresa", "Nós", "Nosso":</strong> Refere-se ao Grupo Venda Forte</li>
                  <li><strong>"Usuário", "Você", "Seu":</strong> Refere-se à pessoa física ou jurídica que acessa ou utiliza nossos serviços</li>
                  <li><strong>"Site":</strong> Refere-se ao website grupovendaforte.com e todas as suas páginas</li>
                  <li><strong>"Serviços":</strong> Incluem venda, locação, manutenção de empilhadeiras e equipamentos industriais</li>
                  <li><strong>"Conteúdo":</strong> Todo material disponível no site, incluindo textos, imagens, vídeos e documentos</li>
                </ul>
              </div>
            </div>

            {/* Aceitação dos Termos */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">2. Aceitação dos Termos</h2>
              </div>
              
              <div className="ml-11 space-y-3 text-gray-600">
                <p>Ao utilizar nosso site ou serviços, você confirma que:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Tem capacidade legal para celebrar contratos vinculativos</li>
                  <li>É maior de 18 anos</li>
                  <li>Fornecerá informações verdadeiras, precisas e completas</li>
                  <li>Cumprirá todas as leis e regulamentos aplicáveis</li>
                  <li>Leu, compreendeu e concordou com estes Termos de Uso</li>
                </ul>
              </div>
            </div>

            {/* Uso do Site */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Uso do Site</h2>
              
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1. Uso Permitido</h3>
                  <p className="text-gray-600 mb-2">Você pode usar nosso site para:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Visualizar informações sobre nossos produtos e serviços</li>
                    <li>Solicitar orçamentos e informações comerciais</li>
                    <li>Entrar em contato com nossa equipe</li>
                    <li>Acessar conteúdo educativo e informativo</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2. Uso Proibido</h3>
                  <p className="text-gray-600 mb-2">Você NÃO pode:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Usar o site para fins ilegais ou não autorizados</li>
                    <li>Tentar obter acesso não autorizado a sistemas ou redes</li>
                    <li>Transmitir vírus, malware ou códigos maliciosos</li>
                    <li>Coletar dados de outros usuários sem consentimento</li>
                    <li>Fazer engenharia reversa do site</li>
                    <li>Copiar, reproduzir ou distribuir conteúdo sem autorização</li>
                    <li>Usar robôs, scrapers ou ferramentas automatizadas</li>
                    <li>Interferir no funcionamento normal do site</li>
                    <li>Representar-se falsamente ou ocultar sua identidade</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Serviços e Produtos */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Serviços e Produtos</h2>
              
              <div className="ml-11 space-y-4 text-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1. Informações de Produtos</h3>
                  <p>
                    Fazemos esforços para garantir que as informações sobre produtos e serviços sejam precisas. No entanto, não garantimos que descrições, preços, imagens ou outras informações sejam completas, atuais ou livres de erros.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2. Disponibilidade</h3>
                  <p>
                    A disponibilidade de produtos está sujeita a alterações sem aviso prévio. Reservamo-nos o direito de limitar quantidades ou descontinuar produtos a qualquer momento.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3. Preços</h3>
                  <p>
                    Os preços apresentados no site são meramente indicativos e podem variar. Preços finais serão confirmados em orçamento formal. Reservamo-nos o direito de alterar preços a qualquer momento.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.4. Orçamentos e Propostas</h3>
                  <p>
                    Orçamentos fornecidos têm validade limitada conforme especificado. Não constituem compromisso vinculativo até a emissão de contrato formal assinado por ambas as partes.
                  </p>
                </div>
              </div>
            </div>

            {/* Propriedade Intelectual */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">5. Propriedade Intelectual</h2>
              </div>
              
              <div className="ml-11 space-y-3 text-gray-600">
                <p>
                  Todo o conteúdo do site, incluindo mas não limitado a textos, gráficos, logos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade do Grupo Venda Forte ou de seus fornecedores de conteúdo e é protegido por leis de direitos autorais.
                </p>
                <p>
                  As marcas registradas, logos e marcas de serviço exibidas no site são propriedade do Grupo Venda Forte ou de terceiros. Você não tem permissão para usar essas marcas sem autorização prévia por escrito.
                </p>
              </div>
            </div>

            {/* Limitação de Responsabilidade */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">6. Limitação de Responsabilidade</h2>
              </div>
              
              <div className="ml-11 space-y-3 text-gray-600">
                <p>
                  O Grupo Venda Forte não será responsável por:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso do site</li>
                  <li>Interrupções, erros ou omissões no site</li>
                  <li>Perda de dados ou lucros resultantes do uso ou incapacidade de usar o site</li>
                  <li>Conteúdo ou conduta de terceiros no site</li>
                  <li>Vírus ou outros componentes prejudiciais obtidos através do site</li>
                  <li>Links para sites de terceiros</li>
                </ul>
                <p className="mt-4">
                  Nosso site é fornecido "como está" sem garantias de qualquer tipo, expressas ou implícitas.
                </p>
              </div>
            </div>

            {/* Garantias */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Garantias de Produtos e Serviços</h2>
              <div className="ml-11 space-y-3 text-gray-600">
                <p>
                  As garantias de produtos e serviços são regidas por contratos específicos e pela legislação aplicável. Consulte os documentos contratuais para informações detalhadas sobre garantias.
                </p>
              </div>
            </div>

            {/* Indenização */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Indenização</h2>
              <div className="ml-11 text-gray-600">
                <p>
                  Você concorda em indenizar, defender e isentar o Grupo Venda Forte, seus diretores, funcionários e agentes de quaisquer reivindicações, perdas, responsabilidades, danos, custos ou despesas (incluindo honorários advocatícios) decorrentes de:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                  <li>Seu uso do site</li>
                  <li>Violação destes Termos de Uso</li>
                  <li>Violação de direitos de terceiros</li>
                  <li>Qualquer conteúdo que você enviar ou transmitir através do site</li>
                </ul>
              </div>
            </div>

            {/* Links de Terceiros */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Links para Sites de Terceiros</h2>
              <div className="ml-11 text-gray-600">
                <p>
                  Nosso site pode conter links para sites de terceiros. Não temos controle sobre o conteúdo, políticas de privacidade ou práticas desses sites e não assumimos responsabilidade por eles. Recomendamos que você leia os termos e políticas de qualquer site de terceiro que visitar.
                </p>
              </div>
            </div>

            {/* Privacidade */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacidade e Proteção de Dados</h2>
              <div className="ml-11 text-gray-600">
                <p>
                  O uso de suas informações pessoais é regido por nossa <Link href="/privacidade" className="text-red-600 hover:text-red-700 font-semibold underline">Política de Privacidade</Link>, que faz parte integrante destes Termos de Uso. Ao usar nosso site, você também concorda com nossa Política de Privacidade.
                </p>
              </div>
            </div>

            {/* Rescisão */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">11. Rescisão</h2>
              </div>
              
              <div className="ml-11 text-gray-600">
                <p>
                  Reservamo-nos o direito de suspender ou encerrar seu acesso ao site, sem aviso prévio, se acreditarmos que você violou estes Termos de Uso ou por qualquer outra razão, a nosso exclusivo critério.
                </p>
              </div>
            </div>

            {/* Modificações */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modificações nos Termos</h2>
              <div className="ml-11 text-gray-600">
                <p>
                  Podemos revisar estes Termos de Uso a qualquer momento, atualizando esta página. É sua responsabilidade verificar periodicamente se há alterações. O uso continuado do site após as alterações constitui aceitação dos novos termos.
                </p>
              </div>
            </div>

            {/* Lei Aplicável */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Lei Aplicável e Jurisdição</h2>
              <div className="ml-11 text-gray-600">
                <p className="mb-3">
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa decorrente destes termos será submetida à jurisdição exclusiva dos tribunais de Chapecó - SC.
                </p>
                <p>
                  Caso qualquer disposição destes termos seja considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.
                </p>
              </div>
            </div>

            {/* Disposições Gerais */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Disposições Gerais</h2>
              <div className="ml-11 space-y-3 text-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">14.1. Acordo Completo</h3>
                  <p>
                    Estes Termos de Uso, juntamente com a Política de Privacidade, constituem o acordo completo entre você e o Grupo Venda Forte.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">14.2. Renúncia</h3>
                  <p>
                    A falha em exercer qualquer direito previsto nestes termos não constituirá renúncia a esse direito.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">14.3. Transferência</h3>
                  <p>
                    Você não pode transferir seus direitos ou obrigações sob estes termos sem nosso consentimento prévio por escrito.
                  </p>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border-l-4 border-red-600">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Informações de Contato</h2>
              <p className="text-gray-600 mb-4">
                Para questões sobre estes Termos de Uso, entre em contato:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Grupo Venda Forte</strong></p>
                <p>E-mail: <a href="mailto:comercial@grupovendaforte.com" className="text-red-600 hover:text-red-700 font-semibold">comercial@grupovendaforte.com</a></p>
                <p>Telefone: <a href="tel:+554933239050" className="text-red-600 hover:text-red-700 font-semibold">(49) 3323-9050</a></p>
                <p>Endereço: Chapecó - SC</p>
              </div>
            </div>

            {/* Aceitação Final */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <p className="text-gray-700 text-center">
                Ao continuar a usar nosso site e serviços, você confirma que leu, compreendeu e concordou em estar vinculado a estes Termos de Uso.
              </p>
            </div>
          </motion.div>

          {/* Back Button */}
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
              ← Voltar para o site
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
