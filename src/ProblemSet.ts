/**
 * The course data model lives in `model.svelte.ts` because it needs runes
 * (reactive class fields).
 *
 * This module is kept as the public entry point so that existing course data
 * files can keep doing `import { Problem, ProblemSet } from "./ProblemSet"`.
 */
export * from "./model.svelte.js";
