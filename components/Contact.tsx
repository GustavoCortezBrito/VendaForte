'use client'

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { CircleCheckBig, Clock, Loader2, Mail, MessageCircle, Phone, Send, type LucideIcon } from 'lucide-react'
import { CONTATO, WHATSAPP_CENTRAL, WHATSAPP_DISPLAY } from '@/components/promo/promo.config'
import { Reveal } from '@/components/promo/ui'
import { BTN_PRIMARY, CONTAINER, EYEBROW, INPUT, LABEL, LEAD, SECTION, TITLE } from '@/components/site/styles'

/** Contato no formato da cotação da campanha: atendimento à esquerda, formulário à direita. */

const EMPTY = { nome: '', email: '', telefone: '', empresa: '', cidade: '', equipamento: '', mensagem: '' }

const EQUIPAMENTOS = [
  { value: 'eletrica', label: 'Empilhadeira Elétrica' },
  { value: 'gas', label: 'Empilhadeira a Gás' },
  { value: 'diesel', label: 'Empilhadeira a Diesel' },
  { value: 'pecas', label: 'Peças e Acessórios' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'locacao', label: 'Locação' },
]

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error' }

function Field({ id, label, required, className = '', children }: { id: string; label: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  )
}

function ContactItem({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/10 text-red-500">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0 text-sm leading-relaxed text-neutral-400">
        <p className="font-semibold text-white">{title}</p>
        {children}
      </div>
    </li>
  )
}

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus({ kind: 'sending' })
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error(String(response.status))
      setStatus({ kind: 'sent' })
      setFormData(EMPTY)
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error)
      setStatus({ kind: 'error' })
    }
  }

  return (
    <section id="contact" className={SECTION}>
      <div className={CONTAINER}>
        <Reveal className="max-w-3xl">
          <p className={EYEBROW}>Fale com nossa equipe</p>
          <h2 className={`mt-4 ${TITLE} text-white`}>Vamos conversar sobre suas necessidades</h2>
          <p className={`mt-5 max-w-xl ${LEAD}`}>Conte o que precisa e receba uma proposta personalizada.</p>
        </Reveal>

        <Reveal className="mt-12 grid overflow-hidden rounded-[32px] border border-white/10 bg-ink-raised lg:grid-cols-12">
          {/* Atendimento: no celular vem depois do formulário */}
          <div className="relative order-last overflow-hidden border-t border-white/10 bg-ink p-8 sm:p-10 lg:order-first lg:col-span-4 lg:border-r lg:border-t-0">
            <span aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-red-600/15 blur-3xl" />
            <div className="relative flex h-full flex-col">
              <h3 className="text-2xl font-semibold tracking-tight text-white">Atendimento</h3>

              <ul className="mt-8 space-y-6">
                <ContactItem icon={Phone} title="Telefones">
                  <span className="block">
                    Chapecó:{' '}
                    <a href="tel:+554933239050" className="transition-colors hover:text-white">
                      {CONTATO.chapeco}
                    </a>
                  </span>
                  <span className="block">
                    Joinville:{' '}
                    <a href="tel:+554738423333" className="transition-colors hover:text-white">
                      {CONTATO.joinville}
                    </a>
                  </span>
                </ContactItem>
                <ContactItem icon={MessageCircle} title="WhatsApp">
                  <span className="block">{WHATSAPP_DISPLAY}</span>
                  <a
                    href={`https://wa.me/${WHATSAPP_CENTRAL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white underline-offset-4 transition-colors hover:underline"
                  >
                    Iniciar conversa
                  </a>
                </ContactItem>
                <ContactItem icon={Mail} title="E-mail">
                  <a href={`mailto:${CONTATO.email}`} className="block break-all transition-colors hover:text-white">
                    {CONTATO.email}
                  </a>
                </ContactItem>
                <ContactItem icon={Clock} title="Horário">
                  <span className="block">Segunda a sexta, 8h às 18h</span>
                  <span className="block">Sábado, 8h às 12h</span>
                </ContactItem>
              </ul>

              <div className="mt-10 lg:mt-auto lg:pt-10">
                <p className="flex items-center gap-2.5 border-t border-white/10 pt-6 text-sm font-medium text-neutral-300">
                  <CircleCheckBig className="h-4 w-4 text-green-500" aria-hidden="true" />
                  Resposta garantida em até 24h
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:col-span-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="contato-nome" label="Nome completo" required className="sm:col-span-2">
                  <input id="contato-nome" name="nome" value={formData.nome} onChange={handleChange} required autoComplete="name" placeholder="Digite seu nome completo" className={INPUT} />
                </Field>
                <Field id="contato-email" label="E-mail" required>
                  <input id="contato-email" type="email" name="email" spellCheck={false} value={formData.email} onChange={handleChange} required autoComplete="email" placeholder="nome@empresa.com.br" className={INPUT} />
                </Field>
                <Field id="contato-telefone" label="Telefone" required>
                  <input id="contato-telefone" type="tel" inputMode="tel" name="telefone" value={formData.telefone} onChange={handleChange} required autoComplete="tel" placeholder="(49) 99999-9999" className={INPUT} />
                </Field>
                <Field id="contato-empresa" label="Empresa">
                  <input id="contato-empresa" name="empresa" value={formData.empresa} onChange={handleChange} autoComplete="organization" placeholder="Nome da empresa" className={INPUT} />
                </Field>
                <Field id="contato-cidade" label="Cidade">
                  <input id="contato-cidade" name="cidade" value={formData.cidade} onChange={handleChange} autoComplete="address-level2" placeholder="Sua cidade" className={INPUT} />
                </Field>
                <Field id="contato-equipamento" label="Tipo de equipamento" className="sm:col-span-2">
                  <select id="contato-equipamento" name="equipamento" value={formData.equipamento} onChange={handleChange} className={INPUT}>
                    <option value="">Selecione uma opção</option>
                    {EQUIPAMENTOS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="contato-mensagem" label="Mensagem" required className="sm:col-span-2">
                  <textarea
                    id="contato-mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Descreva o que você precisa e como podemos ajudar…"
                    className={`${INPUT} resize-none`}
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-relaxed text-ink-muted sm:max-w-sm" role="status" aria-live="polite">
                  {status.kind === 'sent' && <span className="font-medium text-green-500">Mensagem enviada. Entraremos em contato em breve.</span>}
                  {status.kind === 'error' && (
                    <span className="font-medium text-red-400">
                      Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp {WHATSAPP_DISPLAY}.
                    </span>
                  )}
                  {(status.kind === 'idle' || status.kind === 'sending') && '* Campos obrigatórios. Seus dados estão seguros conosco.'}
                </p>
                <button
                  type="submit"
                  disabled={status.kind === 'sending'}
                  className={`${BTN_PRIMARY} shrink-0 cursor-pointer px-8 py-4 text-base disabled:cursor-wait disabled:opacity-70`}
                >
                  {status.kind === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
                  {status.kind === 'sending' ? 'Enviando…' : 'Enviar solicitação'}
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
