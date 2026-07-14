import type { Config } from "tailwindcss";

/**
 * Colors are intentionally NOT extended into the Tailwind theme as named
 * tokens (e.g. `gold-500`) — components use arbitrary-value classes like
 * `bg-[#C9A227]` that reference the exact hex codes from
 * shared/design-tokens/tokens.css directly. This is a deliberate choice:
 * a named Tailwind token is one more place the two design systems could
 * drift apart. If that becomes painful as the component count grows,
 * revisit by generating this file's `theme.colors` FROM tokens.css at
 * build time, rather than hand-maintaining a parallel copy here.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        arabic: ["Cairo", "IBM Plex Sans Arabic", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
