import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", "Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Roboto Mono", "monospace"]
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // The Christman AI Project — Signature Brand Colors
        primary: '#37C8FF',         // Electric Cyan - Primary accent / Logo lightning
        darkbg: '#080C18',          // Deep Night Blue - Background / foundation  
        indigo: '#111828',          // Indigo Black - Card & modal backgrounds
        highlight: '#35E4B9',       // Sky Glow Teal - Highlight for interaction
        iceblue: '#B5E6FF',         // Neon Ice Blue - Secondary text / description
        
        // Standard shadcn colors for compatibility
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        'power-gradient': 'linear-gradient(145deg, #28A6F5, #2B6CFF)',
        'christman-glow': 'linear-gradient(to right, #37C8FF, #35E4B9)',
        'neon-flow': 'linear-gradient(135deg, #37C8FF, #B5E6FF, #35E4B9)',
      },
      boxShadow: {
        'christman': '0 10px 20px rgba(55, 200, 255, 0.4)',
        'power': '0 8px 32px rgba(40, 166, 245, 0.3)',
        'glow': '0 0 20px rgba(53, 228, 185, 0.5)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "christman-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(55, 200, 255, 0.3)"
          },
          "50%": {
            boxShadow: "0 0 40px rgba(53, 228, 185, 0.6)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "christman-pulse": "christman-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
