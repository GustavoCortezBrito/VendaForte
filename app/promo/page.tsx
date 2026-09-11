import PromoProductStage from "@/components/promo/PromoProductStage";
import PromoHighlights from "@/components/promo/PromoHighlights";
import PromoDS3Highlight from "@/components/promo/PromoDS3Highlight";
import PromoUpgradePath from "@/components/promo/PromoUpgradePath";
import PromoSectors from "@/components/promo/PromoSectors";
import PromoOffersGrid from "@/components/promo/PromoOffersGrid";
import PromoWhyUs from "@/components/promo/PromoWhyUs";
import PromoSpecs from "@/components/promo/PromoSpecs";
import PromoSocialProof from "@/components/promo/PromoSocialProof";
import PromoSalesTeam from "@/components/promo/PromoSalesTeam";
import PromoQuoteForm from "@/components/promo/PromoQuoteForm";
import PromoFAQ from "@/components/promo/PromoFAQ";

/**
 * Landing page de campanha — EP Equipment.
 *
 * A ordem segue docs/promo/README.md. As seções 01 e 02 compartilham um único
 * palco de produto controlado pelo scroll, por isso vêm de um componente só.
 */
export default function PromoPage() {
  return (
    <>
      {/* 01 e 02 — Hero e Veja a DS3 de perto, com animação compartilhada */}
      <PromoProductStage />

      {/* 03 — Destaques rápidos */}
      <PromoHighlights />

      {/* 04 — Prova de economia, lítio contra o convencional */}
      <PromoDS3Highlight />

      {/* 05 — O que você usa hoje */}
      <PromoUpgradePath />

      {/* 06 — Aplicações por setor */}
      <PromoSectors />

      {/* 07 — Linha completa em campanha */}
      <PromoOffersGrid />

      {/* 08 — Por que fechar com o Grupo Venda Forte */}
      <PromoWhyUs />

      {/* 09 — Ficha técnica da DS3 */}
      <PromoSpecs />

      {/* 10 — Prova social */}
      <PromoSocialProof />

      {/* 11 — Time comercial */}
      <PromoSalesTeam />

      {/* 12 — Cotação expressa */}
      <PromoQuoteForm />

      {/* 13 — FAQ */}
      <PromoFAQ />
    </>
  );
}
