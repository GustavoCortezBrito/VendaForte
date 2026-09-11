import PromoProductStage from "@/components/promo/PromoProductStage";
import PromoCloseUp from "@/components/promo/PromoCloseUp";
import PromoHighlights from "@/components/promo/PromoHighlights";
import PromoDS3Highlight from "@/components/promo/PromoDS3Highlight";
import PromoUpgradePath from "@/components/promo/PromoUpgradePath";
import PromoSectors from "@/components/promo/PromoSectors";
import PromoOffersGrid from "@/components/promo/PromoOffersGrid";
import PromoSpecs from "@/components/promo/PromoSpecs";
import PromoWhyUs from "@/components/promo/PromoWhyUs";
import PromoSocialProof from "@/components/promo/PromoSocialProof";
import PromoSalesTeam from "@/components/promo/PromoSalesTeam";
import PromoQuoteForm from "@/components/promo/PromoQuoteForm";
import PromoFAQ from "@/components/promo/PromoFAQ";

/**
 * Landing page de campanha — EP Equipment.
 *
 * Abre com o giro da DS3 sozinho na tela e segue direto para os detalhes.
 * Seções escuras e claras se alternam para dar ritmo à leitura.
 */
export default function PromoPage() {
  return (
    <>
      {/* Hero: só o giro da DS3, controlado pelo scroll */}
      <PromoProductStage />

      {/* A DS3 por dentro, com a câmera aproximando de cada peça */}
      <PromoCloseUp />

      {/* Destaques rápidos */}
      <PromoHighlights />

      {/* Seções claras: economia e caminho de troca */}
      <PromoDS3Highlight />
      <PromoUpgradePath />

      {/* Aplicações por setor */}
      <PromoSectors />

      {/* Vitrine e ficha técnica */}
      <PromoOffersGrid />
      <PromoSpecs />

      {/* Seções claras: fornecedor e prova social */}
      <PromoWhyUs />
      <PromoSocialProof />

      {/* Conversão */}
      <PromoSalesTeam />
      <PromoQuoteForm />
      <PromoFAQ />
    </>
  );
}
