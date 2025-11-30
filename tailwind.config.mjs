/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFE0B5", // beige from logo
        foreground: "#3A1A19", // deep warm text
        brand: {
          DEFAULT: "#D52761", // magenta from logo
          dark: "#A81C4B",
          gray: "#3A1A19",
          accent: "#D52761",
        },
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 500ms var(--ease-soft, cubic-bezier(0.22,0.61,0.36,1)) both',
        'scale-in': 'scale-in 300ms var(--ease-soft, cubic-bezier(0.22,0.61,0.36,1)) both',
      },
    },
  },
  plugins: [],
};
