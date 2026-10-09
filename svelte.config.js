import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  // TypeScript (and any future preprocessor needs) inside <script lang="ts">
  preprocess: vitePreprocess(),
};
