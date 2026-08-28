import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
