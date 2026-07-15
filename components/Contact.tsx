'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Chapecó - SC (Matriz)',
      info: '49 3323-9050',
      link: 'tel:+554933239050'
    },
    {
      icon: <Phone size={24} />,
      title: 'Joinville - SC',
      info: '47 3842-3333',
      link: 'tel:+554738423333'
    },
    {
      icon: <Phone size={24} />,
      title: 'WhatsApp',
      info: '49 98839-5635',
      link: 'https://wa.me/5549988395635'
    },
    {
      icon: <Mail size={24} />,
      title: 'E-mail',
      info: 'comercial@grupovendaforte.com',
      link: 'mailto:comercial@grupovendaforte.com'
    }
  ]

  return (
    <section id="contact" ref={ref} className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorative Elements - Hidden on Mobile */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-red-100 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-red-100 rounded-full blur-3xl opacity-30"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <span className="text-red-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Entre em Contato
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-3 sm:mb-4 md:mb-6 px-4 leading-tight">
            Vamos Conversar sobre suas{' '}
            <span className="text-red-600">Necessidades</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Nossa equipe está pronta para oferecer as melhores soluções em equipamentos industriais
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-10 sm:mb-12 md:mb-16">
          {contactInfo.map((item, index) => (
            <motion.a
              key={item.title}
              href={item.link}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ 
                delay: 0.1 * index, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.05,
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-sm md:shadow-md hover:shadow-lg md:hover:shadow-2xl transition-all text-center border border-gray-100 relative overflow-hidden"
            >
              <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100" />
              
              {/* Animated Pulse Ring - Hidden on Mobile */}
              <motion.div
                className="hidden md:block absolute inset-0 border-2 border-red-500 rounded-xl sm:rounded-2xl"
                initial={{ scale: 1, opacity: 0 }}
                whileHover={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-100 to-red-50 text-red-600 rounded-xl mb-2 sm:mb-3 md:mb-4">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                    {item.icon}
                  </div>
                </div>
                <div className="font-bold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm leading-tight">{item.title}</div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-tight">{item.info}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative"
        >
          {/* Decorative Background Card */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl transform rotate-1" />
          
          {/* Main Form Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Left Sidebar - Info */}
              <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-10 text-white relative overflow-hidden">
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '30px 30px'
                  }} />
                </div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold mb-4">
                      Entre em Contato
                    </div>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                      Preencha o formulário ao lado e receba uma proposta personalizada em até 24 horas.
                    </p>
                  </motion.div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.8 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Telefones</h4>
                        <p className="text-sm text-gray-300">Chapecó: (49) 3323-9050</p>
                        <p className="text-sm text-gray-300">Joinville: (47) 3842-3333</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.9 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">E-mail</h4>
                        <p className="text-sm text-gray-300">comercial@grupovendaforte.com</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1.0 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Cobertura</h4>
                        <p className="text-sm text-gray-300">Todo o Sul do Brasil</p>
                        <p className="text-xs text-gray-400 mt-1">6 cidades de atendimento</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Horário</h4>
                        <p className="text-sm text-gray-300">Segunda - Sexta: 8h às 18h</p>
                        <p className="text-sm text-gray-300">Sábado: 8h às 12h</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Trust Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.2 }}
                    className="mt-10 pt-8 border-t border-gray-700"
                  >
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Resposta garantida em até 24h</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="md:col-span-3 p-8 md:p-10">
                <form className="space-y-6">
                  {/* Nome Completo */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Digite seu nome completo"
                      required
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                    />
                  </motion.div>

                  {/* Email e Telefone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.8 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        required
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.9 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        placeholder="(00) 00000-0000"
                        required
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </motion.div>
                  </div>

                  {/* Empresa e Cidade */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.0 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Empresa
                      </label>
                      <input
                        type="text"
                        placeholder="Nome da empresa"
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.1 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        placeholder="Sua cidade"
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </motion.div>
                  </div>

                  {/* Tipo de Equipamento */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.2 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Equipamento
                    </label>
                    <select className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white outline-none transition-all text-gray-900">
                      <option value="">Selecione uma opção</option>
                      <option value="eletrica">Empilhadeira Elétrica</option>
                      <option value="gas">Empilhadeira a Gás</option>
                      <option value="diesel">Empilhadeira a Diesel</option>
                      <option value="pecas">Peças e Acessórios</option>
                      <option value="manutencao">Manutenção</option>
                      <option value="locacao">Locação</option>
                    </select>
                  </motion.div>

                  {/* Mensagem */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      placeholder="Descreva suas necessidades e como podemos ajudar..."
                      rows={5}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.4 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-5 px-8 rounded-xl font-bold text-lg hover:shadow-2xl transition-all shadow-xl relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Enviar Solicitação
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </motion.button>
                    
                    <p className="text-xs text-gray-500 text-center mt-4">
                      * Campos obrigatórios • Seus dados estão seguros conosco
                    </p>
                  </motion.div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
