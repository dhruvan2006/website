import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': '#ededed',
        'blue': '#0057ff',
        'darkerblue': '#004ee5',
        'red': '#d64933',
        'green': '#0c7c59',
        'lightblack': '#0c0f17',
      },
      backgroundImage: {
        "usa": "url('/usa.svg')",
      },
    },
  },
  plugins: [],
};
export default config;
