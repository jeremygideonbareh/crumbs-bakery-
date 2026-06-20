/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
        main: "var(--main)",
        overlay: "var(--overlay)",
        bg: "var(--bg)",
        bw: "var(--bw)",
        blank: "var(--blank)",
        text: "var(--text)",
        mtext: "var(--mtext)",
        secondaryBlack: "#212121",
      },
      fontFamily: {
        sans: ["Satoshi", "Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["Fraunces", "Georgia", "ui-serif", "serif"],
        input: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        caption: ["13px", { lineHeight: "1.5", letterSpacing: "-0.037px" }],
        body: ["16px", { lineHeight: "1.35", letterSpacing: "-0.011px" }],
        subheading: ["18px", { lineHeight: "1.34", letterSpacing: "-0.011px" }],
        "heading-sm": ["23px", { lineHeight: "1.22", letterSpacing: "-0.011px" }],
        heading: ["34px", { lineHeight: "1.11", letterSpacing: "-0.011px" }],
        "heading-lg": ["44px", { lineHeight: "1.05", letterSpacing: "-0.48px" }],
        display: ["63px", { lineHeight: "0.95", letterSpacing: "-0.69px" }],
      },
      borderRadius: {
        base: "5px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        badge: "8px",
        card: "20px",
        pill: "99px",
        button: "8px",
      },
      spacing: {
        4.5: "18px",
      },
      boxShadow: {
        shadow: "var(--box-shadow-x) var(--box-shadow-y) 0px 0px var(--border)",
      },
      translate: {
        boxShadowX: "4px",
        boxShadowY: "4px",
        reverseBoxShadowX: "-4px",
        reverseBoxShadowY: "-4px",
      },
      fontWeight: {
        base: "500",
        heading: "700",
      },
    },
  },
  plugins: [],
}
