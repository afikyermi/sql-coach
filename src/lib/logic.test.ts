import { describe, it, expect, beforeAll } from 'vitest'
import path from 'node:path'
import { compareResults, normalizeCourseDialect } from './sqlEngine'
import { isLevelUnlocked, recordExamResult, recordExerciseResult, getOverallStats } from './progress'
import { getExercisesForLevel } from '../data/exercises'
import type { Row, UserProgress } from '../types'

describe('compareResults — positional value comparison', () => {
  it('accepts a correct result even when column aliases differ', () => {
    // Same values/positions, different result column names (missing Hebrew alias).
    const expected: Row[] = [{ first_name: 'עמית', מספר_הזמנות: 2 }]
    const actual: Row[] = [{ first_name: 'עמית', 'COUNT(o.order_id)': 2 }]
    expect(compareResults(expected, actual, false)).toBe(true)
  })

  it('rejects wrong row values', () => {
    expect(compareResults([{ x: 1 }], [{ x: 2 }], false)).toBe(false)
  })

  it('rejects wrong column count', () => {
    expect(compareResults([{ a: 1, b: 2 }], [{ a: 1 }], false)).toBe(false)
  })

  it('honors order sensitivity', () => {
    const e: Row[] = [{ n: 1 }, { n: 2 }]
    const reversed: Row[] = [{ n: 2 }, { n: 1 }]
    expect(compareResults(e, reversed, true)).toBe(false) // order matters
    expect(compareResults(e, reversed, false)).toBe(true) // order ignored
  })
})

describe('progress — unlock rule and exam/practice separation', () => {
  const empty: UserProgress = { completedExercises: {}, examResults: {}, lastVisited: '' }

  it('level 1 is unlocked and level 2 is locked from a fresh start', () => {
    expect(isLevelUnlocked(empty, 1)).toBe(true)
    expect(isLevelUnlocked(empty, 2)).toBe(false)
  })

  it('exam results never touch practice mastery or dashboard stats', () => {
    const afterExam = recordExamResult(empty, 'level09-ex01', { passed: true, errorTypes: [] })
    expect(Object.keys(afterExam.completedExercises)).toHaveLength(0)
    expect(getOverallStats(afterExam).total).toBe(0)
    expect(getOverallStats(afterExam).mastered).toBe(0)

    // Contrast: a real practice result does count.
    const afterPractice = recordExerciseResult(afterExam, 'level09-ex01', {
      correct: true, hintsUsed: 0, solutionViewed: false, attempts: 1, errorTypes: [], timestamp: 0,
    })
    expect(getOverallStats(afterPractice).total).toBe(1)
  })
})

describe('LIMIT / top-N exercises execute and self-validate', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let SQL: any
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initSqlJs = (await import('sql.js/dist/sql-wasm.js' as any)).default
    SQL = await initSqlJs({
      locateFile: () => path.resolve('node_modules/sql.js/dist/sql-wasm.wasm'),
    })
  })

  const run = (schema: string, query: string): Row[] => {
    const db = new SQL.Database()
    try {
      db.run(schema)
      const res = db.exec(normalizeCourseDialect(query))
      if (!res || res.length === 0) return []
      const { columns, values } = res[res.length - 1]
      return values.map((v: (string | number | null)[]) =>
        Object.fromEntries(columns.map((c: string, i: number) => [c, v[i]])) as Row
      )
    } finally {
      db.close()
    }
  }

  it('Level 8 LIMIT expected queries return rows and match themselves', () => {
    for (const id of ['level08-ex09', 'level08-ex10', 'level08-ex11']) {
      const ex = getExercisesForLevel(8).find((e) => e.id === id)!
      const expected = run(ex.schema, ex.expectedQuery)
      expect(expected.length).toBeGreaterThan(0)
      const user = run(ex.schema, ex.expectedQuery)
      const ordered = /ORDER\s+BY/i.test(ex.expectedQuery)
      expect(compareResults(expected, user, ordered)).toBe(true)
    }
  })

  it('a wrong LIMIT count fails validation', () => {
    const ex = getExercisesForLevel(8).find((e) => e.id === 'level08-ex09')!
    const expected = run(ex.schema, ex.expectedQuery)
    const wrong = run(ex.schema, ex.expectedQuery.replace('LIMIT 3', 'LIMIT 5'))
    expect(compareResults(expected, wrong, true)).toBe(false)
  })
})
