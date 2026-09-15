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
        // Campanha /promo, toda escura: `ink` é a cor do estúdio do vídeo da DS3,
        // para as fotos se fundirem no fundo sem borda; `raised` é o fundo dos cartões.
        ink: { DEFAULT: "#0D0D0D", raised: "#151515" },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
