import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paper system
        paper: {
          0: "#FDFAF2",
          1: "#F5EDD8",
          2: "#EAE0C8",
          3: "#DDD4B8",
          4: "#CFC5A5",
        },
        kraft:   "#C4975A",
        stage:   "#DDD0B3",
        ink:     "#1C1006",
        "ink-mid":   "#52380E",
        "ink-light": "#8C6E3C",

        // Hummd — construction paper blue
        hummd: {
          DEFAULT: "#2660A4",
          dark:    "#1A4578",
          paper:   "#BDD4EC",
          light:   "#E4EEF7",
          pale:    "#F2F7FC",
          50:  "#F2F7FC",
          100: "#E4EEF7",
          200: "#BDD4EC",
          300: "#8BB4D8",
          400: "#5992C4",
          500: "#2660A4",
          600: "#1E4E88",
          700: "#1A4578",
          800: "#143460",
          900: "#0E2445",
        },
        // Hafsa — construction paper magenta
        hafsa: {
          DEFAULT: "#B82870",
          dark:    "#8C1E54",
          paper:   "#F0C0D4",
          light:   "#F9E0EB",
          pale:    "#FDF4F8",
          50:  "#FDF4F8",
          100: "#F9E0EB",
          200: "#F0C0D4",
          300: "#E490B4",
          400: "#D45C90",
          500: "#B82870",
          600: "#9C2060",
          700: "#8C1E54",
          800: "#701845",
          900: "#501035",
        },
        // Macro colors
        "cal-orange": "#CC4A18",
        "prot-purple": "#5E3A98",
        "fib-green": "#2E7844",
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "Georgia", "serif"],
        kalam:    ["var(--font-kalam)",    "Patrick Hand", "cursive"],
      },
      borderRadius: {
        paper: "4px 8px 5px 7px",
      },
      boxShadow: {
        "paper-xs":
          "1px 1px 0 #D0C49C, 0 2px 6px rgba(28,16,6,0.12)",
        "paper-sm":
          "2px 2px 0 #D0C49C, 4px 4px 0 #C4B890, 1px 6px 14px rgba(28,16,6,0.16)",
        "paper":
          "2px 2px 0 #D0C49C, 4px 4px 0 #C4B890, 6px 6px 0 #B8AC84, 2px 10px 22px rgba(28,16,6,0.20)",
        "paper-lg":
          "2px 2px 0 #D0C49C, 4px 4px 0 #C4B890, 6px 6px 0 #B8AC84, 8px 8px 0 #AC9F78, 4px 14px 30px rgba(28,16,6,0.24)",
        "paper-inset":
          "inset 2px 2px 4px rgba(28,16,6,0.12), inset -1px -1px 2px rgba(255,250,240,0.6)",
      },
      keyframes: {
        "ring-fill": {
          "0%":   { strokeDashoffset: "var(--circumference)" },
          "100%": { strokeDashoffset: "var(--target-offset)" },
        },
        "paper-drop": {
          "0%":   { transform: "translateY(-24px) rotate(-2deg)", opacity: "0" },
          "70%":  { transform: "translateY(4px) rotate(0.5deg)", opacity: "1" },
          "100%": { transform: "translateY(0) rotate(var(--card-tilt, 0deg))", opacity: "1" },
        },
        "paper-unfold": {
          "0%":   { transform: "scaleY(0.1) translateY(-10px)", opacity: "0", transformOrigin: "top" },
          "60%":  { transform: "scaleY(1.04) translateY(2px)", opacity: "1", transformOrigin: "top" },
          "100%": { transform: "scaleY(1) translateY(0)", opacity: "1", transformOrigin: "top" },
        },
      },
      animation: {
        "ring-fill":    "ring-fill 1.4s cubic-bezier(0.34, 1.0, 0.64, 1) forwards",
        "paper-drop":   "paper-drop 0.5s cubic-bezier(0.34, 1.1, 0.64, 1) forwards",
        "paper-unfold": "paper-unfold 0.35s cubic-bezier(0.34, 1.0, 0.64, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
