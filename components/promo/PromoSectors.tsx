"use client";

import PromoMediaSlot, { hasMedia } from "./PromoMediaSlot";
import { MEDIA } from "./promo.config";
import { Eyebrow, Reveal, Shot, TITLE } from "./ui";

/**
 * Seção 06 — Aplicações por setor.
 * Setores escolhidos a partir dos segmentos que a empresa já atende. A foto de
 * cada setor entra sozinha quando o arquivo existir em `MEDIA`.
 * Especificação: docs/promo/06-aplicacoes.md
 */

interface Sector {
  title: string;
  desc: string;
  mediaKey: keyof typeof MEDIA;
}

const SECTORS: Sector[] = [
  {
    title: "Armazém e centro de distribuição",
    desc: "Verticaliza o terceiro nível do porta-pallets em corredor estreito, sem obra civil.",
    mediaKey: "setorArmazem",
  },
  {
    title: "Frigorífico e câmara fria",
    desc: "A bateria de lítio mantém desempenho no frio, onde o chumbo-ácido perde capacidade.",
    mediaKey: "setorFrigorifico",
  },
  {
    title: "Indústria alimentícia",
    desc: "Abastece a linha sem gás de escape dentro do galpão.",
    mediaKey: "setorIndustria",
  },
  {
    title: "Agronegócio e cooperativa",
    desc: "Movimentação pesada em armazém de grãos e insumos.",
    mediaKey: "setorAgro",
  },
  {
    title: "Varejo e atacado",
    desc: "Operação silenciosa permite reposição com a loja aberta.",
    mediaKey: "setorVarejo",
  },
];

export default function PromoSectors() {
  return (
    <section id="aplicacoes" className="scroll-mt-24 bg-ink py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <Eyebrow>Onde a DS3 trabalha</Eyebrow>
              <h2 className={`mt-4 ${TITLE} text-white`}>Feita para a sua operação</h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-400">
                Os setores que a gente atende todo dia no Sul do Brasil.
              </p>
            </Reveal>
            <Shot
              shot="tresQuartosTras"
              className="mt-6 aspect-square w-full max-w-md"
              sizes="(max-width: 1024px) 90vw, 36vw"
              parallax={30}
            />
          </div>
        </div>

        <ul className="lg:col-span-7 lg:pt-2">
          {SECTORS.map((sector, index) => (
            <li key={sector.title} className="border-t border-white/10 last:border-b">
              <Reveal delay={index * 0.04} className="py-8 lg:py-10">
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white lg:text-3xl">
                  {sector.title}
                </h3>
                <p className="mt-3 max-w-lg leading-relaxed text-neutral-400">{sector.desc}</p>
                {hasMedia(sector.mediaKey) && (
                  <PromoMediaSlot
                    media={sector.mediaKey}
                    className="mt-6 aspect-[16/9] w-full rounded-2xl border-0"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
