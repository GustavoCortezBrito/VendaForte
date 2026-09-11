"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { whatsappUrl } from "./promo.config";
import { EASE_OUT, Eyebrow, Reveal, TITLE, WhatsAppLink } from "./ui";

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
      "Faturamos direto para pessoa jurídica com linhas BNDES Finame, parcelamento bancário em até 60 vezes e leasing.",
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
    <section id="faq" className="scroll-mt-24 border-t border-white/[0.06] bg-ink py-24 lg:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-4">
          <Reveal className="lg:sticky lg:top-28">
            <Eyebrow>Tire suas dúvidas</Eyebrow>
            <h2 className={`mt-4 ${TITLE} text-white`}>Perguntas frequentes</h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-400">
              Ficou alguma dúvida sobre modelo, prazo ou financiamento? Um consultor responde em
              minutos.
            </p>
            <WhatsAppLink
              href={whatsappUrl("Olá! Tenho uma dúvida sobre os equipamentos da campanha promocional.")}
              className="mt-8"
            >
              Falar com um consultor
            </WhatsAppLink>
          </Reveal>
        </div>

        <ul className="border-t border-white/10 lg:col-span-8">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <li key={faq.question} className="border-b border-white/10">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-lg font-semibold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                  >
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-white bg-white text-ink"
                          : "border-white/15 text-neutral-400"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
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
                      <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-neutral-400">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
