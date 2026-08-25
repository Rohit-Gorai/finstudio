import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { copyFileSync, renameSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function spaEntry() {
  return {
    name: "finstudio-spa-entry",
    closeBundle() {
      const dist = resolve(import.meta.dirname, "dist");
      const appEntry = resolve(dist, "app.html");
      const indexEntry = resolve(dist, "index.html");
      if (existsSync(appEntry)) renameSync(appEntry, indexEntry);
      if (existsSync(indexEntry)) copyFileSync(indexEntry, resolve(dist, "404.html"));
    },
  };
}

// GitHub Pages project sites are served from /<repo>/. Override for a
// user/organization site or custom domain with VITE_BASE=/.
const base = process.env.VITE_BASE ?? "/finstudio/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), spaEntry()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      input: fileURLToPath(new URL("./app.html", import.meta.url)),
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react")) return "react";
          if (id.includes("/src/engine/")) return "engine";
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
  },
});
