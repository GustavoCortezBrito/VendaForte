"use client";

import Image from "next/image";
import { CLIENTES, NUMEROS } from "./promo.config";
import { Eyebrow, Reveal, TITLE } from "./ui";

/**
 * Seção 10 — Prova social. Seção clara.
 * Credencia o Grupo Venda Forte, não a EP.
 *
 * Regra da especificação: nenhum número sem lastro. Os quatro exibidos já são
 * publicados pela empresa no site principal. O depoimento fica fora do ar até
 * existir citação real com autorização por escrito.
 *
 * Especificação: docs/promo/10-prova-social.md
 */

/** Depoimento pendente de coleta e autorização. Ver docs/promo/10-prova-social.md */
const DEPOIMENTO: { quote: string; name: string; role: string; company: string } | null = null;

export default function PromoSocialProof() {
  return (
    <section
      id="clientes"
      className="scroll-mt-24 border-t border-ink/[0.08] bg-paper py-24 text-ink lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow tone="light">Quem confia</Eyebrow>
          <h2 className={`mt-4 ${TITLE}`}>Empresas que operam com a gente</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
            Indústria alimentícia, cooperativa, frigorífico, varejo e transporte no Sul do Brasil.
          </p>
        </Reveal>

        <Reveal>
          <dl className="mt-14 grid grid-cols-2 gap-y-10 border-y border-ink/10 py-10 lg:grid-cols-4">
            {NUMEROS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col-reverse justify-end gap-2 lg:border-l lg:border-ink/10 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <dt className="text-sm text-stone-500">{item.label}</dt>
                <dd className="text-5xl font-bold tabular-nums tracking-[-0.045em] lg:text-6xl">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CLIENTES.map((cliente, index) => (
            <li key={cliente.name}>
              <Reveal
                delay={(index % 4) * 0.05}
                className="group flex h-28 items-center justify-center rounded-[22px] bg-paper-card"
              >
                <span className="relative h-14 w-36">
                  <Image
                    src={cliente.file}
                    alt={cliente.name}
                    fill
                    sizes="144px"
                    className="object-contain opacity-80 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                </span>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-stone-500">
          Uso dos logos sujeito a autorização de cada cliente para peça publicitária.
        </p>

        {DEPOIMENTO && (
          <Reveal className="mt-14 max-w-3xl">
            <figure className="rounded-[28px] bg-paper-card p-10">
              <blockquote className="text-2xl font-medium leading-snug tracking-tight">
                {DEPOIMENTO.quote}
              </blockquote>
              <figcaption className="mt-6 text-sm text-stone-500">
                <cite className="font-semibold not-italic text-ink">{DEPOIMENTO.name}</cite>
                {", "}
                {DEPOIMENTO.role} na {DEPOIMENTO.company}
              </figcaption>
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  );
}
