# SQL Coach — project guide

A single-page web app for learning SQL, in Hebrew (RTL). SQLite runs entirely in
the browser via sql.js (WebAssembly) — there is no backend or database server.

## Stack
- Vite + React 18 + TypeScript
- Tailwind CSS
- sql.js (SQLite compiled to WASM) — see the WASM note below for the binaries
- react-router-dom for client-side routing

## Layout
- `src/lib/` — SQL engine (`sqlEngine.ts`), answer validation (`validateAnswer.ts`,
  `errorClassifier.ts`), progress + localStorage (`progress.ts`)
- `src/data/` — curriculum: `levels.ts` and `exercises/level01..14.ts`
- `src/pages/` — Dashboard, LevelPage (learning), LevelExam, ExamReport, LevelComplete
- `src/components/` — Exercise and Dashboard UI

## Commands
- `npm run dev` — start the dev server
- `npm run build` — type-check (`tsc`) + production build

## Notes
- UI text is Hebrew and the page is RTL; the SQL editor and result tables are LTR.
- Course-dialect helpers (`YEAR`/`MONTH`/`DAY`) are mapped to SQLite equivalents in
  `normalizeCourseDialect` (`src/lib/sqlEngine.ts`). FULL OUTER / RIGHT JOIN are
  supported natively by the bundled SQLite and need no translation.

## WASM binaries (important — read before upgrading sql.js)
`public/` must contain **both** WASM files, because sql.js resolves a different
build per environment via its `exports` map:
- `public/sql-wasm-browser.wasm` — the **browser** build (`sql-wasm-browser.js`)
  that Vite bundles for the app; `initSql`'s `locateFile` fetches it at runtime.
  **Without this file the live app cannot load the engine** (submit stays disabled
  with "לא ניתן היה לטעון את מנוע ה-SQL").
- `public/sql-wasm.wasm` — the **node** build, used by the Vitest suite
  (`src/lib/logic.test.ts` loads `sql.js/dist/sql-wasm.js` directly).

For the installed version these two files are byte-identical, but the browser glue
requests them by **name**. `sql.js` is therefore **pinned to an exact version**
(`package.json`) so `npm install` can't bundle a build that expects a differently
named/versioned wasm. When bumping sql.js, re-copy both from
`node_modules/sql.js/dist/` and confirm the browser build's expected filename
(check the built `assets/sql-wasm-browser-*.js` chunk) still matches.
