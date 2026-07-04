import { describe, it, expect, beforeAll } from 'vitest'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateAnswer } from './validateAnswer'
import { withTrailingSemicolon } from './errorClassifier'
import { allExercises } from '../data/exercises'

/**
 * Broad content guard: for every non-conceptual exercise, the *exact text the UI
 * shows* under "הצג פתרון" — `withTrailingSemicolon(expectedQuery)` — must pass
 * validateAnswer. This proves each expectedQuery executes against its own schema,
 * self-matches the validator, and can be copied by a student and accepted.
 * It would have caught both the unquoted Hebrew-alias bug (unrecognized token)
 * and the missing-semicolon bug, and guards against either returning.
 */
beforeAll(() => {
  // validateAnswer → runQuery → initSql resolves the WASM relative to
  // document.baseURI. In Node there is no document, so point it at public/
  // (with a trailing slash) where the node-build sql-wasm.wasm lives.
  const publicUrl = pathToFileURL(path.resolve('public') + path.sep).href
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).document = { baseURI: publicUrl }
})

const solvable = allExercises.filter((e) => !e.conceptual)

describe('every displayed solution is executable and passes when copied', () => {
  for (const ex of solvable) {
    it(`${ex.id} — "${ex.title}"`, async () => {
      const displayedSolution = withTrailingSemicolon(ex.expectedQuery)
      const result = await validateAnswer(ex, displayedSolution)
      // On failure, surface the Hebrew error so the failing exercise is obvious.
      expect(result.passed, `${ex.id}: ${result.errorMessage ?? 'did not pass'}`).toBe(true)
    })
  }
})
