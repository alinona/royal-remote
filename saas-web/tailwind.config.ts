import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dynamic intelligent color system
        primary: {
          50:  "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
          300: "hsl(var(--primary-300))",
          400: "hsl(var(--primary-400))",
          500: "hsl(var(--primary-500))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          800: "hsl(var(--primary-800))",
          900: "hsl(var(--primary-900))",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        surface: {
          0:   "hsl(var(--surface-0))",
          50:  "hsl(var(--surface-50))",
          100: "hsl(var(--surface-100))",
          200: "hsl(var(--surface-200))",
          300: "hsl(var(--surface-300))",
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          muted:   "hsl(var(--ink-muted))",
          subtle:  "hsl(var(--ink-subtle))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger:  "hsl(var(--danger))",
        info:    "hsl(var(--info))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.4)" },
          "50%":      { boxShadow: "0 0 0 8px hsl(var(--primary) / 0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        "shimmer": {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition: "200% 0" },
        },
        "counter": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in":      "fade-in 0.4s ease-out",
        "slide-in-left":"slide-in-left 0.4s ease-out",
        "scale-in":     "scale-in 0.3s ease-out",
        "pulse-glow":   "pulse-glow 2s ease-in-out infinite",
        "float":        "float 3s ease-in-out infinite",
        "shimmer":      "shimmer 2s linear infinite",
        "counter":      "counter 0.6s ease-out",
        "rotate-slow":  "rotate-slow 20s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":   "radial-gradient(at 40% 20%, hsl(var(--primary-300)) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(var(--accent)) 0px, transparent 50%), radial-gradient(at 0% 50%, hsl(var(--primary-200)) 0px, transparent 50%)",
        "shimmer-gradient": "linear-gradient(90deg, transparent, hsl(var(--surface-100) / 0.8), transparent)",
      },
      boxShadow: {
        "glow":    "0 0 20px -5px hsl(var(--primary) / 0.3)",
        "glow-lg": "0 0 40px -10px hsl(var(--primary) / 0.4)",
        "card":    "0 1px 3px hsl(var(--ink) / 0.04), 0 4px 16px hsl(var(--ink) / 0.06)",
        "card-hover": "0 4px 12px hsl(var(--ink) / 0.08), 0 16px 40px hsl(var(--ink) / 0.1)",
        "inner-glow": "inset 0 1px 0 hsl(var(--surface-0) / 0.6)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
