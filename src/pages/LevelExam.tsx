import { useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Layout/Header'
import { TableViewer } from '../components/Exercise/TableViewer'
import { SqlEditor } from '../components/Exercise/SqlEditor'
import { FeedbackPanel } from '../components/Exercise/FeedbackPanel'
import { levels } from '../data/levels'
import { getExercisesForLevel } from '../data/exercises'
import { validateAnswer } from '../lib/validateAnswer'
import { loadProgress, recordExamResult, isLevelUnlocked } from '../lib/progress'
import type { ValidationResult, UserProgress } from '../types'

export function LevelExam() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const levelId = Number(id)
  const level = levels.find((l) => l.id === levelId)
  const exercises = getExercisesForLevel(levelId).filter((e) => !e.conceptual)

  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [answered, setAnswered] = useState(false)
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress())
  const [examResults, setExamResults] = useState<Record<string, ValidationResult>>({})

  const exercise = exercises[exerciseIdx]

  const handleSubmit = useCallback(async () => {
    if (!exercise || !query.trim() || loading || answered) return
    setLoading(true)
    try {
      const validation = await validateAnswer(exercise, query)
      setResult(validation)
      setAnswered(true)
      setExamResults((prev) => ({ ...prev, [exercise.id]: validation }))
      // Exam outcomes go to a separate store — they never mint practice mastery.
      const updated = recordExamResult(progress, exercise.id, {
        passed: validation.passed,
        errorTypes: validation.errorType ? [validation.errorType] : [],
      })
      setProgress(updated)
    } finally {
      setLoading(false)
    }
  }, [exercise, query, loading, answered, progress])

  const goNext = () => {
    if (exerciseIdx + 1 < exercises.length) {
      setExerciseIdx(exerciseIdx + 1)
      setQuery('')
      setResult(null)
      setAnswered(false)
    } else {
      // Navigate to report, passing results via state
      navigate(`/level/${levelId}/exam/report`, { state: { examResults, exercises } })
    }
  }

  if (!level || !exercise) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">
          <Link to="/" className="text-blue-600 hover:underline">חזרה ללוח הבקרה</Link>
        </p>
      </div>
    )
  }

  // Locked levels cannot be opened directly by URL (same rule as the dashboard).
  if (!isLevelUnlocked(progress, levelId)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🔒</p>
          <p className="text-slate-600 mb-4">רמה זו נעולה — יש להשלים את הרמה הקודמת תחילה</p>
          <Link to="/" className="text-blue-600 hover:underline">חזרה ללוח הבקרה</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Exam banner */}
        <div className="bg-slate-800 text-white rounded-2xl px-5 py-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span className="font-semibold">מצב בחינה — {level.title}</span>
          </div>
          <div className="text-sm text-slate-300">
            {exerciseIdx + 1} / {exercises.length}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Task + tables */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="text-base font-bold text-slate-800 mb-2">{exercise.title}</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{exercise.description}</p>
            </div>
            {exercise.sampleData.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                {exercise.sampleData.map((t) => (
                  <TableViewer key={t.tableName} table={t} />
                ))}
              </div>
            )}
          </div>

          {/* Right: Editor + feedback */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <SqlEditor
                value={query}
                onChange={setQuery}
                onSubmit={handleSubmit}
                loading={loading}
                disabled={answered}
              />
            </div>

            {result && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                {/* Exam mode: only show pass/fail + error type, no expected output */}
                <FeedbackPanel result={result} isExamMode />
              </div>
            )}

            {answered && (
              <button
                onClick={goNext}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {exerciseIdx + 1 < exercises.length ? 'שאלה הבאה ←' : 'סיום בחינה וצפייה בדוח'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
