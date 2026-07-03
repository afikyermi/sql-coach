# SQL Coach 🎓

A browser-based app for practicing SQL in Hebrew (RTL). SQLite runs entirely in
your browser via [sql.js](https://sql.js.org/) (WebAssembly) — there is no backend,
and progress is saved in the browser's localStorage.

14 progressive levels take you from `SELECT` through `JOIN` to `INSERT/UPDATE/DELETE`,
each with graded exercises, hints, instant feedback against a real SQLite engine,
and an optional per-level exam.

## Run locally
```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm test         # run the test suite
```

## Deploy (GitHub Pages)
Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes it to GitHub Pages. Enable it once under **Settings → Pages → Build and
deployment → Source → GitHub Actions**.

## Tech
Vite + React + TypeScript + Tailwind CSS + sql.js (SQLite/WASM), routed with
`react-router-dom` (HashRouter, so it works under any GitHub Pages sub-path).
