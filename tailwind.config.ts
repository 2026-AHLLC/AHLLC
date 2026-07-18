import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],

  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#8B5CF6",
        accent: "#06B6D4",
        background: "#09090B",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      boxShadow: {
        glow: "0 0 50px rgba(37,99,235,.25)",
      },

      animation: {
        float: "float 6s ease-in-out infinite",
      },

      keyframes: {
        float: {
          "0%,100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-12px)",
          },
        },
      },
    },
  },

  plugins: [],
};

keyframes: {
  float: {
    "0%,100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-12px)" },
  },

  "accordion-down": {
    from: {
      height: "0",
    },
    to: {
      height:
        "var(--radix-accordion-content-height)",
    },
  },

  "accordion-up": {
    from: {
      height:
        "var(--radix-accordion-content-height)",
    },
    to: {
      height: "0",
    },
  },
},

animation: {
  float: "float 6s ease-in-out infinite",

  "accordion-down":
    "accordion-down .25s ease-out",

  "accordion-up":
    "accordion-up .25s ease-out",
},

export default config;
