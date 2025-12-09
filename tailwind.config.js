/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
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
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "ring-ring": "ring-ring 2s ease-in-out infinite",
        "pulse-strong": "pulse-strong 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        "ring-ring": {
          "0%, 100%": { transform: "rotate(0)" },
          "10%": { transform: "rotate(30deg)" },
          "20%": { transform: "rotate(-25deg)" },
          "30%": { transform: "rotate(20deg)" },
          "40%": { transform: "rotate(-15deg)" },
          "50%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(-5deg)" },
          "70%": { transform: "rotate(0)" },
        },
        "pulse-strong": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.7)",
          },
          "70%": {
            transform: "scale(1.1)",
            boxShadow: "0 0 10px 20px rgba(37, 211, 102, 0)",
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};
