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
    rollupOptions: {
      output: {
        // Vite's default content hashes (index-DZGXvjqi.js) change on every
        // build, but the built dist/ is committed and deployed by git, so a
        // hashed name means index.html points at a file that is not in the
        // repo until someone remembers to re-commit it. That is what broke
        // /how_to_code/ in production (blank page, 404 on the entry script).
        // Stable names keep index.html valid across rebuilds.
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
