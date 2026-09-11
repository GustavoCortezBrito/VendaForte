import type { Metadata } from "next";
import PromoHeader from "@/components/promo/PromoHeader";
import PromoFooter from "@/components/promo/PromoFooter";

export const metadata: Metadata = {
  title: "Campanha Promocional EP Equipment | Grupo Venda Forte",
  description:
    "Ofertas exclusivas de empilhadeiras e paleteiras elétricas com bateria de lítio. Destaque: EP DS3 1.500kg com pronta entrega e faturamento BNDES.",
};

export default function PromoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05070B] text-white font-sans selection:bg-red-500 selection:text-white">
      <PromoHeader />
      {/* pt para compensar o header fixo (urgency bar + navbar) */}
      <main className="pt-[calc(1.5rem+1rem+4rem)]">{children}</main>
      <PromoFooter />
    </div>
  );
}
