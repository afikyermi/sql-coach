import { useLocation, Link, useParams } from 'react-router-dom'
import { Header } from '../components/Layout/Header'
import { levels } from '../data/levels'
import type { ValidationResult, Exercise } from '../types'

interface LocationState {
  examResults: Record<string, ValidationResult>
  exercises: Exercise[]
}

export function ExamReport() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const state = location.state as LocationState | null
  const levelId = Number(id)
  const level = levels.find((l) => l.id === levelId)

  if (!state || !level) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">לא נמצאו תוצאות בחינה</p>
          <Link to="/" className="text-blue-600 hover:underline">חזרה ללוח הבקרה</Link>
        </div>
      </div>
    )
  }

  const { examResults, exercises } = state
  const total = exercises.length
  const correct = exercises.filter((e) => examResults[e.id]?.passed).length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  // Group by concept
  const conceptStats: Record<string, { correct: number; total: number }> = {}
  for (const ex of exercises) {
    for (const c of ex.requiredConcepts) {
      const key = c.keyword ?? c.type
      if (!conceptStats[key]) conceptStats[key] = { correct: 0, total: 0 }
      conceptStats[key].total++
      if (examResults[ex.id]?.passed) conceptStats[key].correct++
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">{accuracy >= 80 ? '🎉' : accuracy >= 60 ? '💪' : '📚'}</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">דוח בחינה</h1>
            <p className="text-slate-500">{level.title}</p>
          </div>

          {/* Score */}
          <div className="bg-slate-50 rounded-2xl p-5 text-center mb-6">
            <div className="text-5xl font-bold text-blue-600 mb-1">{accuracy}%</div>
            <div className="text-slate-500 text-sm">{correct} נכון מתוך {total} שאלות</div>
          </div>

          {/* Per-concept breakdown */}
          {Object.keys(conceptStats).length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-700 mb-3">ביצועים לפי נושא</h2>
              <div className="space-y-2">
                {Object.entries(conceptStats).map(([concept, stats]) => {
                  const pct = Math.round((stats.correct / stats.total) * 100)
                  const icon = pct === 100 ? '✅' : pct >= 50 ? '⚠️' : '❌'
                  return (
                    <div key={concept} className="flex items-center gap-3">
                      <span className="w-4">{icon}</span>
                      <span className="flex-1 text-sm text-slate-700 font-mono">{concept}</span>
                      <span className="text-sm text-slate-500">{stats.correct}/{stats.total}</span>
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Per-exercise breakdown */}
          <div className="mb-8">
            <h2 className="text-base font-bold text-slate-700 mb-3">פירוט שאלות</h2>
            <div className="space-y-2">
              {exercises.map((ex, i) => {
                const r = examResults[ex.id]
                const passed = r?.passed
                return (
                  <div
                    key={ex.id}
                    className={`flex items-start gap-3 rounded-xl px-4 py-3 ${
                      passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <span className="text-lg">{passed ? '✅' : '❌'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">שאלה {i + 1}: {ex.title}</p>
                      {!passed && r?.errorMessage && (
                        <p className="text-xs text-red-700 mt-0.5">{r.errorMessage}</p>
                      )}
                      {!passed && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-slate-500 mb-1">פתרון:</p>
                          <pre className="sql-editor text-xs bg-slate-100 rounded px-2 py-1 overflow-x-auto text-slate-800">
                            {ex.expectedQuery}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to={`/level/${levelId}`}
              className="text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              חזור ללמוד את הרמה
            </Link>
            <Link
              to="/"
              className="text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
            >
              לוח הבקרה
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
