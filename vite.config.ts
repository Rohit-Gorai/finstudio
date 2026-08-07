import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { copyFileSync, renameSync } from "node:fs";
import { resolve } from "node:path";

/**
 * The source entry is app.html so it doesn't collide with the repo root's
 * index.html (the v1 site, still live). A deployed SPA must be served as
 * index.html though, or the entry filename leaks into the router path and
 * every visit resolves to the 404 route.
 *
 * Also copies it to 404.html: GitHub Pages serves that for unmatched paths,
 * which is how a client-side router survives a deep link or a refresh.
 */
function spaEntry() {
  return {
    name: "finschool-spa-entry",
    closeBundle() {
      const dist = resolve(import.meta.dirname, "dist");
      renameSync(resolve(dist, "app.html"), resolve(dist, "index.html"));
      copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
    },
  };
}

// base must match the GitHub Pages path. A project site is served from
// /<repo>/, so the built asset URLs need that prefix; override with
// VITE_BASE=/ for a user site or custom domain.
const base = process.env.VITE_BASE ?? "/finschool/";

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
      // The Vite entry is app.html, not index.html: the repo root's
      // index.html is the v1 vanilla site, still live via Pages
      // deploy-from-branch. Renaming happens at milestone 10, when the
      // Actions deploy takes over — until then nothing that ships breaks.
      input: fileURLToPath(new URL("./app.html", import.meta.url)),
      output: {
        // keep the engine and the curriculum in separate chunks so a lesson
        // page never drags the whole course in — the payload defect in
        // PROJECT_ANALYSIS.md §3.1
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
