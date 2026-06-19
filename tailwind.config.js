/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
      },
    },
    extend: {
      colors: {
        fairy: {
          50: "#FFF8F0",
          100: "#FFF0E0",
          200: "#FFE4CC",
          300: "#FFD4B3",
          pink: "#FFD4E5",
          purple: "#D4A5FF",
          sky: "#A5D8FF",
          mint: "#B5EAD7",
          gold: "#FFD700",
          rose: "#FFB6C1",
          lavender: "#E6E6FA",
        },
      },
      fontFamily: {
        fairy: ['"Ma Shan Zheng"', '"ZCOOL KuaiLe"', "cursive"],
        body: ['"Noto Sans SC"', '"PingFang SC"', "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "twinkle": "twinkle 2s ease-in-out infinite",
        "bounce-soft": "bounce-soft 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "page-turn": "page-turn 0.6s ease-in-out",
        "shimmer": "shimmer 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(212, 165, 255, 0.5), 0 0 10px rgba(212, 165, 255, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(212, 165, 255, 0.8), 0 0 30px rgba(255, 212, 229, 0.5)" },
        },
        "page-turn": {
          "0%": { transform: "rotateY(0deg)", opacity: "1" },
          "50%": { transform: "rotateY(-90deg)", opacity: "0.5" },
          "100%": { transform: "rotateY(0deg)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      backgroundImage: {
        "gradient-fairy": "linear-gradient(135deg, #D4A5FF 0%, #FFD4E5 50%, #A5D8FF 100%)",
        "gradient-sunset": "linear-gradient(135deg, #FFB6C1 0%, #FFD4E5 50%, #FFD700 100%)",
        "gradient-mint": "linear-gradient(135deg, #B5EAD7 0%, #A5D8FF 100%)",
        "gradient-gold": "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
        "gradient-rainbow": "linear-gradient(135deg, #FF6B6B 0%, #FFD93D 25%, #6BCB77 50%, #4D96FF 75%, #9B59B6 100%)",
        "gradient-bookshelf": "linear-gradient(180deg, #8B4513 0%, #A0522D 50%, #6B3410 100%)",
        "parchment": "linear-gradient(180deg, #FFF8E7 0%, #F5E6D3 100%)",
      },
      boxShadow: {
        fairy: "0 10px 40px rgba(212, 165, 255, 0.3), 0 4px 12px rgba(255, 212, 229, 0.2)",
        "fairy-lg": "0 20px 60px rgba(212, 165, 255, 0.4), 0 8px 24px rgba(255, 212, 229, 0.3)",
        "book": "0 8px 20px rgba(139, 69, 19, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3)",
      },
    },
  },
  plugins: [],
};
