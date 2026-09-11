import type { Metadata } from "next";
import PromoHeader from "@/components/promo/PromoHeader";
import PromoFooter from "@/components/promo/PromoFooter";
import { PromoMotion } from "@/components/promo/ui";

export const metadata: Metadata = {
  title: "Campanha Promocional EP Equipment | Grupo Venda Forte",
  description:
    "Empilhadeira elétrica EP DS3 de 1.500 kg com bateria de lítio, pronta entrega e faturamento BNDES e Finame.",
};

export default function PromoLayout({ children }: { children: React.ReactNode }) {
  return (
    // `overflow-x-clip` corta qualquer vazamento lateral sem virar contêiner de
    // rolagem, o que quebraria os palcos com `position: sticky`
    <div className="min-h-screen overflow-x-clip bg-ink font-sans text-white antialiased selection:bg-red-600 selection:text-white">
      <PromoMotion>
        <PromoHeader />
        {/* Sem recuo no topo: o hero ocupa a tela toda e o header só entra depois dele */}
        <main>{children}</main>
        <PromoFooter />
      </PromoMotion>
    </div>
  );
}
