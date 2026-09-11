import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
