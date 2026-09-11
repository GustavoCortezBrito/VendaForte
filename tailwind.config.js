/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Campanha /promo: `ink` é a cor do estúdio do vídeo da DS3, para as fotos
        // se fundirem no fundo sem borda; `paper` é o fundo das seções claras.
        ink: { DEFAULT: "#0D0D0D", raised: "#151515" },
        paper: { DEFAULT: "#F4F3F1", card: "#FFFFFF" },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
