import type { NextConfig } from "next";

/** Arquivos das animações da campanha, versionados na URL por ASSET_VERSION (promo.config.ts). */
const PROMO_VIDEOS = ["ds3-giro-15s", "efl302b3-movimento", "f4-revelacao"];

const nextConfig: NextConfig = {
  // Quadros e vídeos da campanha levam a versão na URL (?v=), então o navegador
  // pode guardá-los por um ano sem revalidar. Ao trocar esses arquivos, suba
  // ASSET_VERSION em components/promo/promo.config.ts.
  async headers() {
    const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/promo/:dir(giro|movimento-efl302b3|revelacao-f4)/:path*", headers: immutable },
      ...PROMO_VIDEOS.flatMap((name) => [
        { source: `/promo/${name}.mp4`, headers: immutable },
        { source: `/promo/${name}-av1.mp4`, headers: immutable },
      ]),
    ];
  },
  images: {
    // AVIF para quem aceita, WebP como reserva
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.ep-portal.net",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      // Redireciona grupovendaforte.com.br → grupovendaforte.com (301 permanente)
      {
        source: "/:path*",
        has: [{ type: "host", value: "grupovendaforte.com.br" }],
        destination: "https://www.grupovendaforte.com/:path*",
        permanent: true,
      },
      // Redireciona www.grupovendaforte.com.br → grupovendaforte.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.grupovendaforte.com.br" }],
        destination: "https://www.grupovendaforte.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Subdomínio promo.grupovendaforte.com carrega a página promocional na raiz
      {
        source: "/",
        has: [{ type: "host", value: "promo.grupovendaforte.com" }],
        destination: "/promo",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "promo.grupovendaforte.com" }],
        destination: "/promo/:path*",
      },
    ];
  },
};

export default nextConfig;
