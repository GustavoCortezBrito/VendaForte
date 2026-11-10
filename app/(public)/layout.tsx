import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/site/WhatsAppFab";
import { PromoMotion } from "@/components/promo/ui";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // O mesmo invólucro da campanha /promo: fundo ink, seleção vermelha e movimento que respeita
    // `prefers-reduced-motion`. `overflow-x-clip` corta vazamento lateral sem virar contêiner de
    // rolagem (que quebraria o palco com `position: sticky`).
    <div id="top" className="theme-ink min-h-screen overflow-x-clip bg-ink font-sans text-white antialiased selection:bg-red-600 selection:text-white">
      <PromoMotion>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-red-600 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <Navbar />
        <div id="conteudo" className="scroll-mt-24">
          {children}
        </div>
        <Footer />
        <WhatsAppFab />
      </PromoMotion>
    </div>
  );
}
