
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0.25rem)",
        sm: "calc(var(--radius) - 0.5rem)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "border-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 rgba(124, 58, 237, 0.5)",
            borderColor: "rgba(124, 58, 237, 0.5)" 
          },
          "50%": { 
            boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.2)",
            borderColor: "rgba(124, 58, 237, 0.8)"
          },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(124, 58, 237, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.8)" },
        },
        "wave-1": {
          "0%, 100%": { height: "0.5rem" },
          "50%": { height: "1.5rem" }
        },
        "wave-2": {
          "0%, 100%": { height: "0.75rem" },
          "25%": { height: "2rem" },
          "75%": { height: "1.25rem" }
        },
        "wave-3": {
          "0%, 100%": { height: "1.25rem" },
          "50%": { height: "0.75rem" }
        },
        "wave-4": {
          "0%, 100%": { height: "0.85rem" },
          "35%": { height: "2rem" },
          "70%": { height: "1rem" }
        },
        "wave-5": {
          "0%, 100%": { height: "0.5rem" },
          "50%": { height: "1.5rem" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-pulse": "border-pulse 2s ease infinite",
        "border-flow": "border-flow 4s ease infinite",
        "glow": "glow 2s ease-in-out infinite",
        "wave-1": "wave-1 1s ease-in-out infinite",
        "wave-2": "wave-2 1.2s ease-in-out infinite",
        "wave-3": "wave-3 1.3s ease-in-out infinite",
        "wave-4": "wave-4 1.4s ease-in-out infinite",
        "wave-5": "wave-5 1.5s ease-in-out infinite",
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundImage: {
        'glow-btn': 'linear-gradient(45deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
