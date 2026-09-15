"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { CONTATO, whatsappUrl } from "./promo.config";
import { EASE_OUT, Eyebrow, Reveal, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 13 — FAQ.
 * Perguntas agrupadas por assunto, com filtro e um cartão de contato ao lado.
 *
 * Especificação: docs/promo/13-faq.md
 */

const TOPICS = ["Compra e entrega", "Bateria e recarga", "Assistência"] as const;
type Topic = (typeof TOPICS)[number];

interface FAQItem {
  topic: Topic;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    topic: "Compra e entrega",
    question: "Como funciona a entrega das empilhadeiras e paleteiras?",
    answer:
      "Trabalhamos com pronta entrega para os modelos em campanha. O despacho é feito por transportadoras especializadas em maquinário pesado, com seguro total da carga.",
  },
  {
    topic: "Compra e entrega",
    question: "Quais são as condições de financiamento?",
    answer:
      "Faturamos direto para pessoa jurídica com linhas BNDES Finame, parcelamento bancário em até 60 vezes e leasing.",
  },
  {
    topic: "Compra e entrega",
    question: "Consigo testar o equipamento antes de fechar?",
    answer:
      "Sim. Agendamos demonstração técnica na sua operação para validar altura de elevação, largura de corredor e ciclo de trabalho antes do pedido.",
  },
  {
    topic: "Bateria e recarga",
    question: "Como funciona a garantia da bateria de lítio?",
    answer:
      "A tecnologia de íon-lítio da EP Equipment tem até 5 anos de garantia de fábrica na bateria. Não exige água desmineralizada nem manutenção de ácido, e entrega vida útil acima de 3.000 ciclos com recarga de oportunidade.",
  },
  {
    topic: "Bateria e recarga",
    question: "A bateria de lítio funciona em câmara fria?",
    answer:
      "Sim. A bateria de lítio mantém desempenho em baixa temperatura, situação em que o chumbo-ácido perde capacidade de forma acentuada. Confirme a faixa exata com o consultor técnico conforme a temperatura da sua câmara.",
  },
  {
    topic: "Bateria e recarga",
    question: "Preciso de instalação elétrica especial para carregar?",
    answer:
      "Não. A DS3 recarrega em tomada comum no próprio setor, o que dispensa a sala de baterias exigida pelo chumbo-ácido. Confirme a bitola e o ponto disponível com o nosso técnico.",
  },
  {
    topic: "Assistência",
    question: "Vocês fornecem assistência técnica e peças?",
    answer:
      "Sim. Somos representantes oficiais da EP Equipment, com estoque de peças multimarcas e equipe técnica especializada em manutenção preventiva e corretiva.",
  },
];

/** Dados estruturados para resultado enriquecido de FAQ. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const QUESTION_URL = whatsappUrl("Olá! Tenho uma dúvida sobre os equipamentos da campanha promocional.");

export default function PromoFAQ() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [open, setOpen] = useState<string | null>(FAQS[0].question);

  const visible = topic ? FAQS.filter((faq) => faq.topic === topic) : FAQS;

  return (
    <section id="faq" className="scroll-mt-24 border-t border-white/[0.06] bg-ink py-24 lg:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <Eyebrow>Tire suas dúvidas</Eyebrow>
            <h2 className={`mt-4 ${TITLE} text-white`}>Perguntas frequentes</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-400">
              Modelo, prazo, bateria ou financiamento: as respostas que mais pedem antes de fechar.
            </p>

            <div className="mt-10 max-w-md rounded-[28px] border border-white/10 bg-ink-raised p-7">
              <p className="text-lg font-semibold tracking-tight text-white">Não achou a sua pergunta?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
                Um consultor responde em minutos, em horário comercial.
              </p>
              <WhatsAppLink href={QUESTION_URL} className="mt-6 w-full">
                Perguntar no WhatsApp
              </WhatsAppLink>
              <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 text-sm text-neutral-400">
                <a
                  href="tel:+554933239050"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                  Chapecó {CONTATO.chapeco}
                </a>
                <a
                  href={`mailto:${CONTATO.email}`}
                  className="flex items-center gap-3 break-all transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
                  {CONTATO.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar perguntas por assunto">
            {[null, ...TOPICS].map((item) => {
              const isActive = topic === item;
              return (
                <button
                  key={item ?? "todas"}
                  type="button"
                  onClick={() => setTopic(item)}
                  aria-pressed={isActive}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 ${
                    isActive
                      ? "border-white bg-white text-ink"
                      : "border-white/10 text-neutral-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {item ?? "Todas"}
                </button>
              );
            })}
          </div>

          <ul className="mt-6 space-y-3">
            {visible.map((faq, index) => {
              const isOpen = open === faq.question;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;

              return (
                <motion.li
                  key={faq.question}
                  layout="position"
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className={`rounded-3xl border transition-colors duration-300 ${
                    isOpen
                      ? "border-white/15 bg-ink-raised"
                      : "border-white/[0.07] hover:border-white/15 hover:bg-white/[0.02]"
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      onClick={() => setOpen(isOpen ? null : faq.question)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full cursor-pointer items-center gap-5 rounded-3xl px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 sm:px-7 sm:py-6"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-medium text-red-500">{faq.topic}</span>
                        <span className="mt-1.5 block text-[17px] font-semibold leading-snug tracking-tight text-white">
                          {faq.question}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                          isOpen ? "rotate-180 bg-white text-ink" : "bg-white/[0.06] text-neutral-300"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl px-6 pb-6 text-[15px] leading-relaxed text-neutral-400 sm:px-7 sm:pb-7">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
