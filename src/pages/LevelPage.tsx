import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Layout/Header'
import { TableViewer } from '../components/Exercise/TableViewer'
import { SqlEditor } from '../components/Exercise/SqlEditor'
import { FeedbackPanel } from '../components/Exercise/FeedbackPanel'
import { HintPanel } from '../components/Exercise/HintPanel'
import { JoinVisualizer } from '../components/Exercise/JoinVisualizer'
import { levels } from '../data/levels'
import { getExercisesForLevel } from '../data/exercises'
import { validateAnswer } from '../lib/validateAnswer'
import { loadProgress, recordExerciseResult, isLevelUnlocked } from '../lib/progress'
import type { Exercise, ValidationResult, UserProgress } from '../types'

export function LevelPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const levelId = Number(id)
  const level = levels.find((l) => l.id === levelId)
  const exercises = getExercisesForLevel(levelId)

  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [solutionRevealed, setSolutionRevealed] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress())
  // Conceptual question state
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [conceptAnswered, setConceptAnswered] = useState(false)
  // Level intro is expanded by default on the first exercise, collapsed (but
  // still available) on the rest.
  const [showIntro, setShowIntro] = useState(true)

  const exercise: Exercise | undefined = exercises[exerciseIdx]

  useEffect(() => {
    setQuery('')
    setResult(null)
    setHintsRevealed(0)
    setSolutionRevealed(false)
    setAttempts(0)
    setSelectedOption(null)
    setConceptAnswered(false)
    setShowIntro(exerciseIdx === 0)
  }, [exerciseIdx])

  const handleSubmit = useCallback(async () => {
    if (!exercise || !query.trim() || loading) return

    // Semicolon + DML-no-WHERE guards live in validateAnswer so learning and
    // exam modes behave identically.
    setLoading(true)
    try {
      const validation = await validateAnswer(exercise, query)
      setResult(validation)
      setAttempts((a) => a + 1)

      if (validation.passed) {
        const updated = recordExerciseResult(progress, exercise.id, {
          correct: true,
          hintsUsed: hintsRevealed,
          solutionViewed: solutionRevealed,
          attempts: attempts + 1,
          errorTypes: [],
          timestamp: Date.now(),
        })
        setProgress(updated)
      } else {
        const updated = recordExerciseResult(progress, exercise.id, {
          correct: false,
          hintsUsed: hintsRevealed,
          solutionViewed: solutionRevealed,
          attempts: attempts + 1,
          errorTypes: validation.errorType ? [validation.errorType] : [],
          timestamp: Date.now(),
        })
        setProgress(updated)
      }
    } finally {
      setLoading(false)
    }
  }, [exercise, query, loading, hintsRevealed, solutionRevealed, attempts, progress])

  const handleConceptSubmit = useCallback(() => {
    if (!exercise?.conceptual || selectedOption === null) return
    setConceptAnswered(true)
    const correct = selectedOption === exercise.conceptual.correctIndex
    const updated = recordExerciseResult(progress, exercise.id, {
      correct,
      hintsUsed: 0,
      solutionViewed: false,
      attempts: 1,
      errorTypes: [],
      timestamp: Date.now(),
    })
    setProgress(updated)
  }, [exercise, selectedOption, progress])

  const handleRevealHint = () => {
    if (hintsRevealed < (exercise?.hints.length ?? 0)) {
      setHintsRevealed((h) => h + 1)
    }
  }

  const handleRevealSolution = () => {
    setSolutionRevealed(true)
    if (exercise) {
      const updated = recordExerciseResult(progress, exercise.id, {
        correct: false,
        hintsUsed: hintsRevealed,
        solutionViewed: true,
        attempts,
        errorTypes: [],
        timestamp: Date.now(),
      })
      setProgress(updated)
    }
  }

  const goNext = () => {
    if (exerciseIdx + 1 < exercises.length) {
      setExerciseIdx(exerciseIdx + 1)
    } else {
      navigate(`/level/${levelId}/complete`)
    }
  }

  if (!level || !exercise) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">רמה לא נמצאה</p>
          <Link to="/" className="text-blue-600 hover:underline">חזרה ללוח הבקרה</Link>
        </div>
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

  const isJoinLevel = levelId === 13
  const isDone = result?.passed ?? false

  // Never surface a hint that is the literal solution — the full answer stays
  // behind "show solution" only. Drops a trailing hint equal to expectedQuery.
  const normalizeSql = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/;+\s*$/, '')
  const ladderHints = exercise.hints.filter(
    (h, i) => !(i === exercise.hints.length - 1 && normalizeSql(h) === normalizeSql(exercise.expectedQuery))
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:text-blue-600">לוח הבקרה</Link>
          <span>›</span>
          <span className="text-slate-700 font-medium">{level.title}</span>
        </div>

        {/* Exercise dots */}
        <div className="flex items-center gap-1.5 mb-6 overflow-x-auto">
          {exercises.map((ex, i) => {
            const res = progress.completedExercises[ex.id]
            let dotColor = 'bg-slate-200'
            if (res?.correct) {
              dotColor = res.masteryStatus === 'mastered' ? 'bg-green-500' : 'bg-blue-400'
            } else if (res) {
              dotColor = 'bg-red-300'
            }
            if (i === exerciseIdx) dotColor = 'bg-blue-600 ring-2 ring-blue-300'

            return (
              <button
                key={ex.id}
                onClick={() => setExerciseIdx(i)}
                className={`w-3 h-3 rounded-full flex-shrink-0 transition-all ${dotColor}`}
                title={`תרגיל ${i + 1}`}
              />
            )
          })}
          <span className="text-xs text-slate-400 mr-2 whitespace-nowrap">
            תרגיל {exerciseIdx + 1} מתוך {exercises.length}
            {' · '}
            הושלמו {exercises.filter((e) => progress.completedExercises[e.id]?.correct).length}/{exercises.length}
          </span>
        </div>

        {/* Level intro — collapsible, available on every exercise */}
        <div className="bg-white border border-slate-200 rounded-2xl mb-6">
          <button
            onClick={() => setShowIntro((v) => !v)}
            className="w-full flex items-center justify-between gap-3 p-5 text-right"
            aria-expanded={showIntro}
          >
            <div>
              <h1 className="text-xl font-bold text-slate-800">{level.title}</h1>
              <p className="text-sm text-slate-500">{level.subtitle}</p>
            </div>
            <span className="text-xs text-slate-400 flex-shrink-0">
              {showIntro ? 'הסתר הסבר ▲' : 'הצג הסבר ▼'}
            </span>
          </button>
          {showIntro && (
            <div className="px-5 pb-5">
              <p className="text-sm text-slate-700 leading-relaxed">{level.intro}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {level.concepts.map((c) => (
                  <span key={c} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Conceptual exercise */}
        {exercise.conceptual ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="mb-1">
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">שאלת הבנה</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">{exercise.title}</h2>
            <p className="text-slate-700 mb-6">{exercise.conceptual.question}</p>
            <div className="space-y-3 mb-6">
              {exercise.conceptual.options.map((opt, i) => {
                let cls = 'border border-slate-200 bg-slate-50 hover:bg-slate-100'
                if (conceptAnswered) {
                  if (i === exercise.conceptual!.correctIndex) cls = 'border-green-400 bg-green-50'
                  else if (i === selectedOption) cls = 'border-red-300 bg-red-50'
                } else if (i === selectedOption) {
                  cls = 'border-blue-400 bg-blue-50'
                }

                return (
                  <button
                    key={i}
                    disabled={conceptAnswered}
                    onClick={() => setSelectedOption(i)}
                    className={`w-full text-right px-4 py-3 rounded-xl transition-all text-sm font-medium ${cls}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            {!conceptAnswered ? (
              <button
                onClick={handleConceptSubmit}
                disabled={selectedOption === null}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                בדוק תשובה
              </button>
            ) : (
              <div className="space-y-4">
                <div className={`rounded-xl p-4 ${selectedOption === exercise.conceptual.correctIndex ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-semibold mb-1">
                    {selectedOption === exercise.conceptual.correctIndex ? '✅ נכון!' : '❌ לא נכון'}
                  </p>
                  <p className="text-sm">{exercise.conceptual.explanation}</p>
                </div>
                <button onClick={goNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
                  {exerciseIdx + 1 < exercises.length ? 'תרגיל הבא ←' : 'סיום רמה 🎉'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* SQL exercise */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Task + tables */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="mb-1">
                  <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">תרגיל {exerciseIdx + 1}</span>
                </div>
                <h2 className="text-base font-bold text-slate-800 mb-2">{exercise.title}</h2>
                <p className="text-sm text-slate-700 leading-relaxed">{exercise.description}</p>
              </div>

              {/* JOIN visualizer or regular table viewers */}
              {isJoinLevel && exercise.sampleData.length >= 2 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-slate-600 mb-3">טבלאות לחיבור</h3>
                  <JoinVisualizer
                    leftTable={exercise.sampleData[0]}
                    rightTable={exercise.sampleData[1]}
                    joinKey="dept_id"
                    joinType={
                      /RIGHT JOIN/i.test(exercise.expectedQuery)
                        ? 'RIGHT'
                        : /LEFT JOIN/i.test(exercise.expectedQuery)
                        ? 'LEFT'
                        : /FULL/i.test(exercise.expectedQuery)
                        ? 'FULL'
                        : 'INNER'
                    }
                  />
                </div>
              ) : (
                exercise.sampleData.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-slate-600 mb-3">נתוני הטבלה</h3>
                    {exercise.sampleData.map((t) => (
                      <TableViewer key={t.tableName} table={t} />
                    ))}
                  </div>
                )
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
                  disabled={isDone && !result?.alternativeAccepted}
                />
              </div>

              {/* Hints */}
              {!isDone && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <HintPanel
                    hints={ladderHints}
                    hintsRevealed={hintsRevealed}
                    onRevealHint={handleRevealHint}
                    onRevealSolution={handleRevealSolution}
                    solutionRevealed={solutionRevealed}
                    solution={exercise.expectedQuery}
                  />
                </div>
              )}

              {/* Feedback */}
              {result && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <FeedbackPanel result={result} />
                </div>
              )}

              {/* Explanation + Next */}
              {(isDone || solutionRevealed) && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  {exercise.explanation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                      <p className="text-xs font-semibold text-blue-600 mb-1">הסבר</p>
                      <p className="text-sm text-blue-900 leading-relaxed">{exercise.explanation}</p>
                    </div>
                  )}
                  <button
                    onClick={goNext}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    {exerciseIdx + 1 < exercises.length ? 'תרגיל הבא ←' : 'סיום רמה 🎉'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
