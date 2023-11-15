/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      primary: {
        50: "#F1EEF6",
        100: "#E4DDEE",
        200: "#CBBFDE",
        300: "#B09ECC",
        400: "#9780BD",
        500: "#7C5EAB",
        600: "#63498D",
        700: "#493668",
        800: "#322546",
        900: "#181122",
        950: "#0C0911"
      },
      controls: {
        input: {
          background: "#dddddd",
          text: "#aaaaaa"
        },
        button: {
          submit: {
            background: "#B09ECC",
            text: "#181122"
          },
          close: {
            background: "#E4DDEE",
            text: "#181122"
          },
          suppress: {
            background: "#E4DDEE",
            text: "#EF5350"
          }
        }
      },
      error: {
        light: '#EF5350',
        dark: '#C62828',
      },
      warning: {
        light: '#FFB74D',
        dark: '#FF9800',
      },
      success: {
        light: '#66BB6A',
        dark: '#2E7D32',
      },
      info: {
        light: '#64B5F6',
        dark: '#1976D2',
      },
    },
    extend: {
      backgroundImage: {
        'radial-gradient': 'radial-gradient(100% 100% at 0 0%, #c8b4ff 0%, #a078d7 100%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/forms')],
}