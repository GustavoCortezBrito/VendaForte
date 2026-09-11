"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronDown, CircleQuestionMark, MessageCircle } from "lucide-react";
import { whatsappUrl } from "./promo.config";

/**
 * Seção 13 — FAQ.
 * Especificação: docs/promo/13-faq.md
 */

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Como funciona a entrega das empilhadeiras e paleteiras?",
    answer:
      "Trabalhamos com pronta entrega para os modelos em campanha. O despacho é feito por transportadoras especializadas em maquinário pesado, com seguro total da carga.",
  },
  {
    question: "Como funciona a garantia da bateria de lítio?",
    answer:
      "A tecnologia de íon-lítio da EP Equipment tem até 5 anos de garantia de fábrica na bateria. Não exige água desmineralizada nem manutenção de ácido, e entrega vida útil acima de 3.000 ciclos com recarga de oportunidade.",
  },
  {
    question: "Quais são as condições de financiamento?",
    answer:
      "Faturamos direto para pessoa jurídica com linhas BNDES Finame, parcelamento bancário em até 60 vezes e leasing. Para a linha de paleteiras também há condição no cartão de crédito em até 12 vezes.",
  },
  {
    question: "Vocês fornecem assistência técnica e peças?",
    answer:
      "Sim. Somos representantes oficiais da EP Equipment, com estoque de peças multimarcas e equipe técnica especializada em manutenção preventiva e corretiva.",
  },
  {
    question: "Consigo testar o equipamento antes de fechar?",
    answer:
      "Sim. Agendamos demonstração técnica na sua operação para validar altura de elevação, largura de corredor e ciclo de trabalho antes do pedido.",
  },
  {
    question: "A bateria de lítio funciona em câmara fria?",
    answer:
      "Sim. A bateria de lítio mantém desempenho em baixa temperatura, situação em que o chumbo-ácido perde capacidade de forma acentuada. Confirme a faixa exata com o consultor técnico conforme a temperatura da sua câmara.",
  },
  {
    question: "Preciso de instalação elétrica especial para carregar?",
    answer:
      "Não. A DS3 recarrega em tomada comum no próprio setor, o que dispensa a sala de baterias exigida pelo chumbo-ácido. Confirme a bitola e o ponto disponível com o nosso técnico.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

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

export default function PromoFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#05070B] py-24 text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-red-600/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            <CircleQuestionMark className="h-3.5 w-3.5" />
            Tire suas dúvidas
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Perguntas frequentes
          </h2>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <motion.div
                key={faq.question}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                className={`overflow-hidden rounded-2xl border backdrop-blur-xl transition-colors ${
                  isOpen
                    ? "border-red-500/25 bg-white/[0.04]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left text-base font-bold text-white sm:p-6 sm:text-lg"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-red-500" : "text-neutral-500"
                      }`}
                    />
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
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-white/5 px-5 pb-6 pt-4 text-sm leading-relaxed text-neutral-400 sm:px-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center backdrop-blur-xl sm:flex-row sm:text-left"
        >
          <p className="text-sm text-neutral-300">
            Ficou alguma dúvida sobre modelo, prazo ou financiamento? Um consultor responde em
            minutos.
          </p>
          <a
            href={whatsappUrl(
              "Olá! Tenho uma dúvida sobre os equipamentos da campanha promocional."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] hover:bg-emerald-500"
          >
            <MessageCircle className="h-4 w-4" />
            Falar com um consultor
          </a>
        </motion.div>
      </div>
    </section>
  );
}
