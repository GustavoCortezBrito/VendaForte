import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
        <Navbar />
        {children}
        <Footer />
      </PromoMotion>
    </div>
  );
}
