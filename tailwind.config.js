import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        accent: {
          purple: "#7366ff",
          blue: "#3e97ff",
          pink: "#f65f80",
          orange: "#ff9f43",
          green: "#42ba96",
        },
        sidebar: {
          bg: "#1e2035",
          hover: "#2a2c42",
          active: "#3f4061",
          text: "#a9b3cd",
          highlight: "#ffffff",
        },
        content: {
          light: "#f7f7ff",
          DEFAULT: "#ffffff",
          dark: "#0f0f1a",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dotted-pattern': 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(114, 101, 255, 0.15)',
        'inner-top': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          background: "#FFFFFF",
          foreground: "#18181B",
          primary: {
            50: "#f6f6f6",
            100: "#e7e7e7",
            200: "#d1d1d1",
            300: "#b0b0b0",
            400: "#888888",
            500: "#0f0f0f", // Primary button background (black)
            600: "#0c0c0c",
            700: "#070707",
            800: "#050505",
            900: "#030303",
            DEFAULT: "#0f0f0f",
            foreground: "#FFFFFF" // Primary button text (white)
          },
          default: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
            DEFAULT: "#6B7280",
            foreground: "#333"
          }
        }
      }
    }
  })],
};

module.exports = config;
