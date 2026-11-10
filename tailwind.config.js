/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Cores das redes e dos andamentos ficam em lib/social.ts, fora das pastas acima
    "./lib/social.ts",
  ],
  theme: {
    extend: {
      colors: {
        // Campanha /promo, toda escura: `ink` é a cor do estúdio do vídeo da DS3,
        // para as fotos se fundirem no fundo sem borda; `raised` é o fundo dos cartões.
        ink: { DEFAULT: "#0D0D0D", raised: "#151515", muted: "#8C8C8C" },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
