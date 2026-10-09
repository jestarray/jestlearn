import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Svelte's recommended build tool is Vite (via @sveltejs/vite-plugin-svelte).
// Rollup is still what Vite uses under the hood, but it is no longer configured
// (or depended on) directly.
export default defineConfig({
  // Courses are served from a sub path (e.g. https://jestlearn.com/how_to_code/),
  // so every asset reference has to stay relative instead of root-absolute.
  base: "./",
  plugins: [svelte()],
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
