'use client'

import { useState, type FormEvent } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Send, X } from 'lucide-react'
import { WHATSAPP_DISPLAY, whatsappUrl } from '@/components/promo/promo.config'
import { EASE_OUT } from '@/components/promo/ui'

/**
 * Atalho de WhatsApp com janela de conversa.
 *
 * Feito com Radix Popover (primitivo acessível e atual: foco preso, Esc, clique fora, posição
 * automática e leitores de tela) e animação do framer-motion. Os assuntos e a mensagem digitada
 * abrem o WhatsApp com o texto pronto por link direto para wa.me, então o clique conta como
 * `click_whatsapp` no GA4 (AnalyticsEvents). O botão usa o verde oficial do WhatsApp (#25D366) e
 * tem 64 px. Some no celular, onde a barra fixa do cabeçalho faz esse papel.
 */

const TOPICS = [
  { label: 'Cotar uma empilhadeira', message: 'Olá! Vim pelo site e quero cotar uma empilhadeira.' },
  { label: 'Locação de equipamentos', message: 'Olá! Vim pelo site e quero saber sobre locação de empilhadeiras.' },
  { label: 'Peças originais EP', message: 'Olá! Vim pelo site e preciso de peças para a minha empilhadeira.' },
  { label: 'Assistência técnica', message: 'Olá! Vim pelo site e preciso de assistência técnica.' },
]

function WhatsAppIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export default function WhatsAppFab() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  const send = (event: FormEvent) => {
    event.preventDefault()
    const message = text.trim()
    if (!message) return
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
    setText('')
    setOpen(false)
  }

  return (
    <div className="hidden md:block">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label={open ? 'Fechar o atendimento por WhatsApp' : 'Abrir o atendimento por WhatsApp'}
            className="fixed bottom-6 right-6 z-40 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.55)] transition duration-300 hover:scale-105 hover:bg-[#1FBE5B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] motion-reduce:hover:scale-100"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'wa'}
                initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {open ? <X className="h-7 w-7" aria-hidden="true" /> : <WhatsAppIcon className="h-8 w-8" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </Popover.Trigger>

        <AnimatePresence>
          {open && (
            <Popover.Portal forceMount>
              <Popover.Content
                forceMount
                asChild
                side="top"
                align="end"
                sideOffset={14}
                collisionPadding={16}
                className="z-50 outline-none"
              >
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  style={{ transformOrigin: 'bottom right' }}
                  className="w-[21rem] overflow-hidden rounded-[24px] border border-white/10 bg-ink-raised shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
                >
                  <div className="flex items-center gap-3 bg-[#075E54] px-5 py-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white">
                      <WhatsAppIcon className="h-5 w-5" />
                    </span>
                    <span className="leading-tight">
                      <Popover.Title className="block text-sm font-semibold text-white">Venda Forte</Popover.Title>
                      <Popover.Description className="block text-xs text-white/85">
                        Atendimento comercial · {WHATSAPP_DISPLAY}
                      </Popover.Description>
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-neutral-200">
                      Olá! Sobre o que você quer falar?
                    </p>
                    <ul className="mt-4 space-y-2">
                      {TOPICS.map((topic, index) => (
                        <motion.li
                          key={topic.label}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.06 + index * 0.05 }}
                        >
                          <a
                            href={whatsappUrl(topic.message)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpen(false)}
                            className="group flex items-center justify-between rounded-full border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#25D366]/60 hover:bg-[#25D366]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#25D366]"
                          >
                            {topic.label}
                            <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-colors group-hover:text-[#25D366]" aria-hidden="true" />
                          </a>
                        </motion.li>
                      ))}
                    </ul>

                    <form onSubmit={send} className="mt-4 flex items-center gap-2">
                      <label htmlFor="whatsapp-mensagem" className="sr-only">
                        Sua mensagem
                      </label>
                      <input
                        id="whatsapp-mensagem"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        autoComplete="off"
                        placeholder="Ou escreva sua mensagem…"
                        className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-ink-muted focus:border-[#25D366]/60 focus:outline-none focus:ring-4 focus:ring-[#25D366]/15"
                      />
                      <button
                        type="submit"
                        disabled={!text.trim()}
                        aria-label="Enviar mensagem pelo WhatsApp"
                        className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-[#25D366] text-ink transition-colors hover:bg-[#1FBE5B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] disabled:cursor-default disabled:opacity-40"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              </Popover.Content>
            </Popover.Portal>
          )}
        </AnimatePresence>
      </Popover.Root>
    </div>
  )
}
