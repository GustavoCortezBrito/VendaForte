import PromoProductStage from "@/components/promo/PromoProductStage";
import PromoCloseUp from "@/components/promo/PromoCloseUp";
import PromoHighlights from "@/components/promo/PromoHighlights";
import PromoProductMotion from "@/components/promo/PromoProductMotion";
import PromoProductDetails from "@/components/promo/PromoProductDetails";
import PromoDS3Highlight from "@/components/promo/PromoDS3Highlight";
import PromoWhyUs from "@/components/promo/PromoWhyUs";
import PromoQuoteForm from "@/components/promo/PromoQuoteForm";
import PromoFAQ from "@/components/promo/PromoFAQ";
import PromoMainSite from "@/components/promo/PromoMainSite";

/**
 * Landing page de campanha — EP Equipment.
 *
 * Três máquinas em sequência, cada uma com a sua animação controlada pelo scroll
 * seguida de informações, ficha técnica e preço: a DS3 gira, a EFL302 B3 chega
 * andando e a F4 é revelada pela luz. Depois vêm economia, fornecedor, cotação,
 * perguntas frequentes e o site principal.
 */
export default function PromoPage() {
  return (
    <>
      {/* 1 e 2 — DS3: giro com o preço letra a letra, detalhes, ficha e preço */}
      <PromoProductStage />
      <PromoCloseUp />
      <PromoHighlights />

      {/* 3 e 4 — EFL302 B3: chegada de perfil, informações, ficha e preço */}
      <div id="efl302b3" className="scroll-mt-24">
        <PromoProductMotion productId="efl302b3" />
        <PromoProductDetails productId="efl302b3" />
      </div>

      {/* 5 e 6 — F4: revelação pela luz, informações, ficha e preço */}
      <div id="f4" className="scroll-mt-24">
        <PromoProductMotion productId="f4" />
        <PromoProductDetails productId="f4" />
      </div>

      {/* 7 — Demais seções */}
      <PromoDS3Highlight />
      <PromoWhyUs />
      <PromoQuoteForm />
      <PromoFAQ />
      <PromoMainSite />
    </>
  );
}
