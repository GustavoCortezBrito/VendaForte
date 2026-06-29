import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import LoadingScreen from "@/components/LoadingScreen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grupo Venda Forte - Empilhadeiras em Santa Catarina",
  description: "Venda, locação, assistência técnica e peças para empilhadeiras em Chapecó e Joinville. Equipamentos de qualidade com mais de 20 anos de experiência.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={inter.className}>
        <LoadingScreen />
        <Navbar />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
