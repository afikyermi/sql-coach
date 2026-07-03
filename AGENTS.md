# SQL Coach — project guide

A single-page web app for learning SQL, in Hebrew (RTL). SQLite runs entirely in
the browser via sql.js (WebAssembly) — there is no backend or database server.

## Stack
- Vite + React 18 + TypeScript
- Tailwind CSS
- sql.js (SQLite compiled to WASM) — the binary is served from `public/sql-wasm.wasm`
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
