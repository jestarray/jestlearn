# jestlearn
## serverless website for interactive educational content
[![Netlify Status](https://api.netlify.com/api/v1/badges/4250a53b-cc48-482c-ae06-c07cbffd75f6/deploy-status)](https://app.netlify.com/sites/jestlearn/deploys)
Make multichoice/input problems with ease!

## Develop / build:
Svelte 5 + TypeScript 7 (native), built with [Vite](https://vite.dev) (what Svelte
recommends; no Rollup config to maintain):
```
npm install
npm run dev        # dev server with HMR
npm run build      # production build -> ./dist
npm run preview    # serve the production build locally
npm run check      # svelte-check: TS 7 native diagnostics + Svelte templates
npm run typecheck  # TS 7 native compiler only, .ts files (fast)
```
`index.html` lives at the project root (Vite's entry HTML) and the static files
that are copied as-is (`prism.js`, `global.css`, sounds, ...) live in `public/`.
The build output in `dist/` is what gets deployed — the repo root's
`update_jestlearn_htc.sh` copies it to `./howtocode`, and `server.js` serves
`jestlearn/dist` for the "Example Course".

### Why there are two TypeScript packages
TypeScript 7 is the Go/native compiler. It no longer ships the JavaScript compiler
API, and `svelte-check` (plus the VS Code Svelte extension, which uses the same
machinery to turn `.svelte` files into TypeScript) needs that API, so both are
installed:

| package | version | used for |
| --- | --- | --- |
| `typescript` | `~6.0.3` | the JS API: `svelte-check`'s transform pipeline and editor tooling. `svelte-check` refuses to start if this one is v7 |
| `@typescript/native` (alias of `typescript`) | `^7.0.2` | the actual type checker: `npm run check` passes `--tsgo`, and `npm run typecheck` runs it directly |

`--tsgo` writes transpiled Svelte files to `.svelte-check/` (gitignored) and has
the same limitations as `--incremental`. `npm run check:ts6` runs the old
JS-based pipeline if you ever need to compare, and `npx tsc` resolves to the
native 7 compiler (use `npm run typecheck` for a guaranteed TS 7 invocation).

## How to use:
`data.ts` is the active file read by the rest of the program, so just copy and paste your course data into it and generate the `dist` folder and distribute that! (note: typescript/something will try to auto-fix imports! make sure every component is only reading `./data` and not `./data_computer_systems`, etc)
Edit `course_name` in `data.ts`, should be unique
Edit `data.ts` with problem sets and such and that's mostly it
If you want cloud syncing change the `website_sync_point` and self host the server. For now it's pointed at my server
If you want to support more languages, just replace prism.js and prism.css

## Data model:
`Problem`/`ProblemSet`/`gen_amount` live in `src/model.svelte.ts` (a `.svelte.ts`
module, so the classes can use runes and stay deeply reactive — Svelte 5 no longer
makes class instances reactive implicitly). `src/ProblemSet.ts` re-exports them, so
`import { ProblemSet, Problem } from "./ProblemSet"` keeps working in your course
data files.

## Legend:
✅ - for correct answer
❌ - for incorrect answer
⚠️ - for corrected incorrect answer
❓ - for unanswered

## Todo:
* Anki spaced alg.
* consider removing choice problem because all select problems are choice problems, but not all choice problems are select ones, maybe there's a way to limit the checkbox selection
* pure offline support
* Add more documentation, make it easier to set up a sync server, a video to show how to set it up
* GUI editor for problems? (too lazy atm, just edit js)
* Analytics page for teachers
* provide a way to add comments other than github comments?
* better device scaling support, use tachyons or something.. my css is terrible 

## Motivation:
< 1000 lines of code
I just want something super simple, fast, flexible(open source), and offline to make small educational exercise content. Google classroom and everything else is too bloat, not to mention I don't really care about grades. Instead of focusing on grades, focus on constant repitition, ergo Anki, because memory is fragile.

Mistranslated quote but emphasis on doing always rather than listening/watching
> What I hear, I forget; What I see, I remember; What I do, I understand. —Confucius, 551–479 BC
> What I cannot create I do not understand - Feynman
## Credits:
* Favicon provided by https://twemoji.twitter.com/
