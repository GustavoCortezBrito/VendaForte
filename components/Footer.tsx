'use client'

import { motion } from 'framer-motion'
import { Share2, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: <Share2 size={20} />, href: 'https://www.instagram.com/vendaforte/', label: 'Instagram' },
    { icon: <Share2 size={20} />, href: 'https://www.linkedin.com/company/grupo-venda-forte/', label: 'LinkedIn' },
    { icon: <Share2 size={20} />, href: 'https://www.facebook.com/grupovendaforte', label: 'Facebook' },
    { icon: <Share2 size={20} />, href: 'https://wa.me/5549988395635', label: 'WhatsApp' },
  ]

  const quickLinks = [
    { label: 'Início', href: '#home' },
    { label: 'Sobre Nós', href: '#about' },
    { label: 'Serviços', href: '#services' },
    { label: 'Depoimentos', href: '#testimonials' },
    { label: 'Contato', href: '#contact' },
  ]

  const services = [
    { label: 'Venda de Empilhadeiras', href: '#services' },
    { label: 'Locação de Equipamentos', href: '#services' },
    { label: 'Assistência Técnica', href: '#services' },
    { label: 'Peças Originais', href: '#services' },
    { label: 'Contratos de Manutenção', href: '#services' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold mb-4 text-red-500"
            >
              Venda Forte
            </motion.h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Importação e distribuição de máquinas e equipamentos industriais para movimentação de cargas. Atuamos em todo o Sul do Brasil com matriz em Chapecó-SC.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.2 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2" />
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <motion.li
                  key={service.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                >
                  <a
                    href={service.href}
                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2" />
                    {service.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-4">
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-start text-gray-400"
              >
                <MapPin size={20} className="mr-3 mt-1 flex-shrink-0 text-red-600" />
                <span>Chapecó-SC (Matriz), Joinville-SC,<br />Itajaí-SC, Maringá-PR, Seberi-RS, Esteio-RS</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center text-gray-400"
              >
                <Phone size={20} className="mr-3 flex-shrink-0 text-red-600" />
                <div>
                  <a href="tel:+554933239050" className="hover:text-red-500 transition-colors block">
                    49 3323-9050 (Chapecó)
                  </a>
                  <a href="tel:+554738423333" className="hover:text-red-500 transition-colors block">
                    47 3842-3333 (Joinville)
                  </a>
                </div>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center text-gray-400"
              >
                <Mail size={20} className="mr-3 flex-shrink-0 text-red-600" />
                <a href="mailto:comercial@grupovendaforte.com" className="hover:text-red-500 transition-colors">
                  comercial@grupovendaforte.com
                </a>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 mt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Grupo Venda Forte. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacidade" className="text-gray-400 hover:text-red-500 transition-colors">
                Política de Privacidade
              </a>
              <a href="/termos" className="text-gray-400 hover:text-red-500 transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
