# Unreleased
- TypeScript upgraded to 7 (native compiler): installed as `@typescript/native`
  (npm alias of `typescript@7`) and used for diagnostics via
  `svelte-check --tsgo` / `npm run typecheck`. `typescript` itself is pinned to
  `~6.0.3` because svelte-check (and the editor's Svelte tooling) still needs the
  JavaScript compiler API, which TS 7 no longer ships; both are required by
  svelte-check for TS 7 support. No source changes were needed — TS 7 reports the
  same diagnostics as TS 6 on this codebase
- Migrated from Svelte 3 to Svelte 5 (latest), with all components rewritten in runes
  mode (`$state`/`$derived`/`$effect`/`$props`), callback props instead of
  `createEventDispatcher`, `onclick`-style event attributes, dynamic components
  instead of `<svelte:component>`, and `mount()` instead of `new App()`
- Replaced the Rollup build with Vite + `@sveltejs/vite-plugin-svelte` (Svelte's
  recommended toolchain): `npm run dev` / `build` / `preview`; TypeScript 5 +
  `svelte-check` 4; `index.html` moved to the project root and the build output is
  now `dist/` (deploy scripts and `server.js` updated accordingly)
- `Problem`/`ProblemSet` moved to `src/model.svelte.ts` so their fields can be
  `$state` (Svelte 5 does not make class instances reactive on its own). They gained
  `toJSON()` because rune class fields compile to private fields + accessors, which
  `JSON.stringify` would otherwise skip. `src/ProblemSet.ts` re-exports them, so
  course data files keep importing from `./ProblemSet`
- The `TOC` copy is now built with `clone_problem_set()` rather than
  `JSON.parse(JSON.stringify(...))` + `Object.assign` + `__proto__` patching, and the
  `svelte/internal` import was dropped (that module no longer exists in Svelte 5)
- Replaced `afterUpdate()` with `$effect()` and made the answer input actually clear
  on every next/reset (the old boolean reset flag only fired on the first transition)
- `public/prism.js` is now used only through its global (`window.Prism`), because Vite
  cannot import JavaScript out of the `public/` folder

# 0.6.1
- Critical Fix bug where problems would not generate at all
+ Fixed semantic versioning

# 0.0.6
- Switched to giscus using github discussion feature instead of issues(turns out utterances doesn't work at all due to re-direct)
- Using giscus to store and review student submissions for now
- TODO: when github discussions introduce templates, use those to force correct submission structure
- Added code submission/discussion problems

# 0.0.5
- Now titles are used for comparisons rather than ids since ids are hard to make unique and are tied to section-ids(maybe crc32 the titles for uids)
- Prevent re-doing of problems that are already marked correct when the user did not click "Next" to proceed.
- Added clear cache button
- Added show answer button
- Added cloudflare analytics
- Input answers are now space insensitive
- Input answer hints now can take html
- Breaking ProblemSet constructor because search tags are kinda optional and should be last
# 0.0.4
- Fixed TOC not updating
- Merged back other deleted props rather than just .gen()
- Page no longer refreshes after logging in
- Added support for hitting enter key to proceed for InputProblems
- No longer using + - ! ? , all emoji now
# 0.0.3
- No longer saving problems that have not been worked on in localstorage
- Fixed diffing algorithim to merge ones that dont exist along with getting rid of duplicates
- Fixed issues with the discussions page for single domain courses
- Added hover effect to select answers
- Added async support to fetch problems from an api and an example on how to do so
- Removed num of problems from the problem set in favor closures that hold that privately since it was not used anywhere else
- Fixed input problems not supporting syntax highlighting