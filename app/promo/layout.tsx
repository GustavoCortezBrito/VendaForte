import type { Metadata } from "next";
import PromoHeader from "@/components/promo/PromoHeader";
import PromoFooter from "@/components/promo/PromoFooter";
import { PromoMotion } from "@/components/promo/ui";

export const metadata: Metadata = {
  // `absolute` ignora o template "%s | Grupo Venda Forte" do layout raiz, que
  // repetia o nome da empresa e passava do limite de 580 px dos buscadores
  title: { absolute: "Promoção EP DS3, EFL302 B3 e F4 | Venda Forte" },
  description:
    "Promoção Venda Forte: empilhadeira EP DS3 de 1.500 kg, EFL302 B3 de 3.000 kg e paleteira F4, todas de lítio, com pronta entrega e faturamento direto para CNPJ.",
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
