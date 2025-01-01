import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "var(--main)",
        overlay: "var(--overlay)",
        bg: "var(--bg)",
        bw: "var(--bw)",
        blank: "var(--blank)",
        text: "var(--text)",
        mtext: "var(--mtext)",
        border: "var(--border)",
        ring: "var(--ring)",
        ringOffset: "var(--ring-offset)",

        secondaryBlack: "#212121",
      },
      borderRadius: {
        base: "5px",
      },
      boxShadow: {
        shadow: "var(--shadow)",
      },
      translate: {
        boxShadowX: "5px",
        boxShadowY: "4px",
        reverseBoxShadowX: "-5px",
        reverseBoxShadowY: "-4px",
      },
      fontWeight: {
        base: "500",
        heading: "700",
      },
      marquee: "marquee 25s linear infinite",
      "marquee-reverse": "marquee-reverse 25s linear infinite",
    },
    keyframes: {
      marquee: {
        "0%": { transform: "translateY(0%)" },
        "100%": { transform: "translateY(-50%)" },
      },
      "marquee-reverse": {
        "0%": { transform: "translateY(-50%)" },
        "100%": { transform: "translateY(0%)" },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
