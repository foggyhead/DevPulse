import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#121212",
          50: "#1a1a1a",
          100: "#222222",
          200: "#2a2a2a",
          300: "#333333",
        },
        lavender: {
          DEFAULT: "#E6E6FA",
          dim: "#C4C4E8",
          muted: "#9d8fcd",
          ghost: "rgba(230,230,250,0.06)",
          border: "rgba(230,230,250,0.08)",
          glow: "rgba(230,230,250,0.12)",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.03)",
          hover: "rgba(255,255,255,0.06)",
          active: "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Fira Code", "monospace"],
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      backgroundImage: {
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(230,230,250,0.04) 50%, transparent 100%)",
        "lavender-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(157,143,205,0.15), transparent)",
        "hero-mesh":
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(157,143,205,0.08), transparent 70%), radial-gradient(ellipse 40% 30% at 80% 70%, rgba(230,230,250,0.04), transparent 60%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(230,230,250,0.06)",
        "glass-lg": "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(230,230,250,0.08)",
        glow: "0 0 40px rgba(157,143,205,0.15)",
        "glow-sm": "0 0 20px rgba(157,143,205,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
