/// <reference types="svelte" />

// public/prism.js is loaded as a classic <script> in index.html, so it is a
// global rather than something we import (assets in the public/ folder cannot be
// imported from JavaScript by Vite).
declare const Prism: {
  highlightAll(): void;
  highlightElement(element: Element): void;
};
