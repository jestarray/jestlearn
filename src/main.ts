import { mount } from "svelte";
import App from "./App.svelte";

// Svelte 5: components are mounted with `mount` instead of `new App(...)`
const app = mount(App, {
  target: document.body,
});

export default app;
