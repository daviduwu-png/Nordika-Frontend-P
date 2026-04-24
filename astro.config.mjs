// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: vercel(),

  server: {
    port: 4321,
  },

  vite: {
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/client", "@astrojs/react/client.js", "sileo"],
    },
    ssr: {
      noExternal: ["sileo"],
    },
    plugins: [
      // @ts-expect-error - Ignorando disparidad interna de tipos de Vite entre Astro y Tailwind
      tailwindcss(),
    ],
  },
});
