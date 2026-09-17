"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { whatsappUrl } from "./promo.config";
import { EASE_OUT, Eyebrow, Reveal, TITLE, WhatsAppLink } from "./ui";

/**
 * Seção 13 — FAQ.
 * Perguntas por máquina, com os números das fichas oficiais da EP Equipment,
 * e as dúvidas de compra. Filtro por assunto e cartão de contato ao lado.
 *
 * Fontes: ep-equipment.com/product/ds3, /br/product/efl302b3 e /br/product/f4
 * Especificação: docs/promo/13-faq.md
 */

const TOPICS = ["DS3", "EFL302 B3", "F4", "Compra e suporte"] as const;
type Topic = (typeof TOPICS)[number];

interface FAQItem {
  topic: Topic;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  /* ---------------- DS3 ---------------- */
  {
    topic: "DS3",
    question: "Quanto a DS3 levanta e até que altura?",
    answer:
      "Capacidade nominal de 1.500 kg com centro de carga de 600 mm e mastro de corrente dupla de 3 m a 3,9 m de elevação, conforme a configuração. Quando o mastro sobe, a velocidade de deslocamento é reduzida automaticamente para manter a estabilidade.",
  },
  {
    topic: "DS3",
    question: "A DS3 trabalha em corredor estreito?",
    answer:
      "Sim. O chassi é curto (1.727 × 834 mm) e o raio de giro é de 1.470 mm. O corredor mínimo é de 2.302 mm para pallet 1.000 × 1.200 atravessado e de 2.235 mm para pallet 800 × 1.200 no sentido longitudinal.",
  },
  {
    topic: "DS3",
    question: "Como é a recarga da bateria da DS3?",
    answer:
      "O carregador é embarcado: basta conectar a máquina na tomada, sem sala de baterias. A versão de lítio usa bateria de 24 V / 40 Ah com carregador de 15 A, e o sistema dispensa manutenção.",
  },
  {
    topic: "DS3",
    question: "A DS3 sobe rampa carregada?",
    answer:
      "Ela vence rampas de até 3% com carga e 10% sem carga, então é indicada para piso plano de armazém, loja e área de produção. Para rampas mais íngremes ou pátio externo, a EFL302 B3 é a escolha.",
  },
  {
    topic: "DS3",
    question: "Quais recursos de segurança a DS3 tem?",
    answer:
      "Redução automática de velocidade com o mastro elevado, grade de proteção em malha de aço, modo tartaruga para manobras precisas, freio eletromagnético e timão grande com comandos na ponta dos dedos. O ruído no posto do operador fica abaixo de 74 dB(A).",
  },

  /* ---------------- EFL302 B3 ---------------- */
  {
    topic: "EFL302 B3",
    question: "A EFL302 B3 pode trabalhar em área externa e na chuva?",
    answer:
      "Sim. Ela tem proteção contra água IPX4, pneus pneumáticos grandes e 150 mm de vão livre ao solo. Foi desenvolvida para aplicações exigentes em ambientes internos e externos, como pátios logísticos, canteiros de obras e fábricas, sob chuva ou sol.",
  },
  {
    topic: "EFL302 B3",
    question: "Qual a capacidade e a altura de elevação da EFL302 B3?",
    answer:
      "Capacidade de 3.000 kg com centro de carga de 500 mm e mastro de 3.000 a 6.000 mm, com inclinação de 6° para a frente e 10° para trás. Com carga, eleva a 0,29 m/s.",
  },
  {
    topic: "EFL302 B3",
    question: "Qual é a bateria e o carregador da EFL302 B3?",
    answer:
      "Bateria de lítio de 80 V / 205 Ah, instalada na parte de baixo para dar mais estabilidade, com carregador de 35 A ou 60 A. Os motores são AC: 10 kW de tração e 16 kW no sistema hidráulico.",
  },
  {
    topic: "EFL302 B3",
    question: "Qual a velocidade e quanto de rampa ela vence?",
    answer:
      "Anda a 11 km/h com carga e 12 km/h sem carga, e vence rampas de 15% nas duas condições. O raio de giro é de 2.437 mm e o corredor mínimo é de 4.118 mm para pallet 1.000 × 1.200.",
  },

  /* ---------------- F4 ---------------- */
  {
    topic: "F4",
    question: "Dá para trocar a bateria da F4 durante o turno?",
    answer:
      "Sim. A bateria de lítio de 24 V / 20 Ah é removível e pesa só 5 kg, e a F4 aceita até duas baterias para estender a autonomia. O carregador é de 5 A.",
  },
  {
    topic: "F4",
    question: "A F4 serve para empilhar pallets?",
    answer:
      "Não. A F4 é uma paleteira para transporte no nível do chão: os garfos sobem 105 mm, o suficiente para tirar o pallet do piso e levar até 1.500 kg. Para empilhar em altura, a indicada é a DS3.",
  },
  {
    topic: "F4",
    question: "Em que tipo de operação a F4 se encaixa?",
    answer:
      "Varejo, armazéns e centros de transporte, em manuseio ocasional e operações gerais. Com 120 kg, largura de 560 ou 685 mm e raio de giro de 1.360 mm, circula bem em corredores estreitos. Vence rampas de 6% com carga e 16% sem carga.",
  },
  {
    topic: "F4",
    question: "Quais opções de configuração a F4 oferece?",
    answer:
      "Rodas estabilizadoras opcionais, que reduzem o risco de tombamento em piso irregular, garfos em vários comprimentos e larguras e timão com altura de 645 a 1.145 mm. O botão tartaruga permite andar mesmo com o timão na posição vertical, útil em espaços apertados.",
  },

  /* ---------------- Compra e suporte ---------------- */
  {
    topic: "Compra e suporte",
    question: "Como funciona a entrega das máquinas da campanha?",
    answer:
      "Trabalhamos com pronta entrega para os modelos em campanha. O despacho é feito por transportadoras especializadas em maquinário pesado, com seguro total da carga.",
  },
  {
    topic: "Compra e suporte",
    question: "Quais são as formas de pagamento?",
    answer:
      "Faturamos direto para pessoa jurídica, com nota fiscal. As condições são combinadas caso a caso: o consultor envia as opções junto com a proposta formal.",
  },
  {
    topic: "Compra e suporte",
    question: "Consigo testar o equipamento antes de fechar?",
    answer:
      "Sim. Agendamos demonstração técnica na sua operação para validar altura de elevação, largura de corredor e ciclo de trabalho antes do pedido.",
  },
  {
    topic: "Compra e suporte",
    question: "Vocês fornecem assistência técnica e peças?",
    answer:
      "Sim. Somos representantes oficiais da EP Equipment, com estoque de peças e equipe técnica especializada em manutenção preventiva e corretiva.",
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
  const [topic, setTopic] = useState<Topic>(TOPICS[0]);
  const [open, setOpen] = useState<string | null>(FAQS[0].question);

  const visible = FAQS.filter((faq) => faq.topic === topic);

  const selectTopic = (next: Topic) => {
    setTopic(next);
    // Abre a primeira pergunta do assunto, para a troca mostrar conteúdo na hora
    setOpen(FAQS.find((faq) => faq.topic === next)?.question ?? null);
  };

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
              Capacidade, bateria, corredor e rampa de cada máquina, com os números da ficha oficial
              da EP Equipment.
            </p>

            <div className="mt-10 max-w-md rounded-[28px] border border-white/10 bg-ink-raised p-7">
              <p className="text-lg font-semibold tracking-tight text-white">Não achou a sua pergunta?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
                Um consultor responde em minutos, em horário comercial.
              </p>
              <WhatsAppLink href={QUESTION_URL} className="mt-6 w-full">
                Perguntar no WhatsApp
              </WhatsAppLink>
              {/* Telefones e e-mail ficam no formulário de cotação e no rodapé */}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar perguntas por assunto">
            {TOPICS.map((item) => {
              const isActive = topic === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => selectTopic(item)}
                  aria-pressed={isActive}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 ${
                    isActive
                      ? "border-white bg-white text-ink"
                      : "border-white/10 text-neutral-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {item}
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
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

          <p className="mt-6 text-xs text-neutral-600">
            Especificações conforme as fichas oficiais da EP Equipment. Configurações e opcionais
            podem variar por lote; confirme com o consultor.
          </p>
        </div>
      </div>
    </section>
  );
}
