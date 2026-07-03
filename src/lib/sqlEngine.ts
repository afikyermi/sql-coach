import type { Row } from '../types'

// sql.js is loaded dynamically to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SQL: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let loadingPromise: Promise<any> | null = null

/**
 * Loads sql.js exactly once, even when called concurrently. Callers that race
 * (e.g. two queries run in parallel via Promise.all) share the same in-flight
 * load instead of each independently invoking the WASM loader — a previous
 * version only cached the *resolved* value, so concurrent cold-start calls
 * could trigger sql.js's WASM loader twice at once. If the load fails, the
 * cached promise is cleared so the next call retries cleanly instead of
 * re-awaiting an already-rejected promise forever.
 */
export async function initSql() {
  if (SQL) return SQL
  if (!loadingPromise) {
    loadingPromise = (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = (await import('sql.js')) as any
      const factory = typeof mod.default === 'function' ? mod.default : mod
      return factory({
        // Resolve the WASM relative to the page's base URL so it loads whether
        // the app is served from a root domain or a GitHub Pages sub-path.
        locateFile: (file: string) => new URL(file, document.baseURI).href,
      })
    })()
  }
  try {
    SQL = await loadingPromise
    return SQL
  } catch (err) {
    loadingPromise = null
    throw err
  }
}

/** Run a query on an ephemeral database created from schema SQL.
 *  Returns { columns, rows } or throws on SQL error. */
export async function runQuery(
  schema: string,
  query: string
): Promise<{ columns: string[]; rows: Row[] }> {
  const sql = await initSql()
  const db = new sql.Database()
  try {
    db.run(schema)
    const normalized = normalizeCourseDialect(query)
    const results = db.exec(normalized)
    if (!results || results.length === 0) {
      return { columns: [], rows: [] }
    }
    const { columns, values } = results[results.length - 1]
    const rows: Row[] = values.map((v: (string | number | null)[]) => {
      const row: Row = {}
      columns.forEach((col: string, i: number) => {
        row[col] = v[i]
      })
      return row
    })
    return { columns, rows }
  } finally {
    db.close()
  }
}

/** Run a DML query then verify state with a SELECT. */
export async function runDmlAndVerify(
  schema: string,
  dmlQuery: string,
  verifyQuery: string
): Promise<{ columns: string[]; rows: Row[] }> {
  const sql = await initSql()
  const db = new sql.Database()
  try {
    db.run(schema)
    const normalizedDml = normalizeCourseDialect(dmlQuery)
    db.run(normalizedDml)
    const normalizedVerify = normalizeCourseDialect(verifyQuery)
    const results = db.exec(normalizedVerify)
    if (!results || results.length === 0) return { columns: [], rows: [] }
    const { columns, values } = results[0]
    const rows: Row[] = values.map((v: (string | number | null)[]) => {
      const row: Row = {}
      columns.forEach((col: string, i: number) => { row[col] = v[i] })
      return row
    })
    return { columns, rows }
  } finally {
    db.close()
  }
}

/**
 * Maps course-dialect SQL to SQLite-compatible SQL transparently.
 * Students write course-style SQL; the engine translates behind the scenes.
 *
 * Mappings:
 *   YEAR(col)       → strftime('%Y', col) cast as INTEGER
 *   MONTH(col)      → strftime('%m', col) cast as INTEGER
 *   DAY(col)        → strftime('%d', col) cast as INTEGER
 *   <> operator     → SQLite supports this natively ✓
 *
 * Note: FULL OUTER JOIN and RIGHT JOIN need NO translation — the SQLite build
 * bundled with sql.js (3.39+) supports both natively, so Level 13 runs them
 * as-is. (A previous string-rewrite emulation was removed: it was fragile and
 * never actually triggered, since native support already covers these.)
 */
export function normalizeCourseDialect(query: string): string {
  let q = query

  // YEAR(col) → CAST(strftime('%Y', col) AS INTEGER)
  q = q.replace(/\bYEAR\s*\(\s*([^)]+)\s*\)/gi, "CAST(strftime('%Y', $1) AS INTEGER)")

  // MONTH(col) → CAST(strftime('%m', col) AS INTEGER)
  q = q.replace(/\bMONTH\s*\(\s*([^)]+)\s*\)/gi, "CAST(strftime('%m', $1) AS INTEGER)")

  // DAY(col) → CAST(strftime('%d', col) AS INTEGER)
  q = q.replace(/\bDAY\s*\(\s*([^)]+)\s*\)/gi, "CAST(strftime('%d', $1) AS INTEGER)")

  return q
}

/**
 * Compare two result sets by VALUES (column position + column count + row count),
 * ignoring the result column NAMES. This way a correct query that omits an exact
 * `AS` alias (e.g. Hebrew aliases) still matches, while wrong column counts or
 * wrong values still fail. Order-insensitive unless orderSensitive=true.
 *
 * Row objects are built in column order (see runQuery), so Object.values(row)
 * yields the selected columns left-to-right.
 */
export function compareResults(
  expected: Row[],
  actual: Row[],
  orderSensitive = false
): boolean {
  if (expected.length !== actual.length) return false
  if (expected.length === 0) return true

  // Join values with a control char (unlikely to appear in data) so that
  // e.g. ["12","3"] and ["1","23"] do not collide, and prefix with the column
  // count so "same values, different number of columns" is still a mismatch.
  const SEP = ''
  const serialize = (r: Row) => {
    const vals = Object.values(r)
    return `${vals.length}::${vals.map((v) => String(v)).join(SEP)}`
  }

  if (orderSensitive) {
    return expected.every((row, i) => serialize(row) === serialize(actual[i]))
  }

  const expectedSorted = [...expected].map(serialize).sort()
  const actualSorted = [...actual].map(serialize).sort()
  return expectedSorted.every((v, i) => v === actualSorted[i])
}
