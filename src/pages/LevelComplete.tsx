import { useParams, Link } from 'react-router-dom'
import { Header } from '../components/Layout/Header'
import { levels } from '../data/levels'
import { allExercises } from '../data/exercises'
import { loadProgress, getLevelProgress } from '../lib/progress'

export function LevelComplete() {
  const { id } = useParams<{ id: string }>()
  const levelId = Number(id)
  const level = levels.find((l) => l.id === levelId)
  const progress = loadProgress()
  const lp = getLevelProgress(progress, levelId)
  const nextLevel = levels.find((l) => l.id === levelId + 1)

  const exercises = allExercises.filter((e) => e.levelId === levelId)
  const results = exercises.map((e) => progress.completedExercises[e.id])
  const hintsUsed = results.reduce((sum, r) => sum + (r?.hintsUsed ?? 0), 0)
  const solutionsViewed = results.filter((r) => r?.solutionViewed).length

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/" className="text-blue-600 hover:underline">חזרה ללוח הבקרה</Link>
      </div>
    )
  }

  const allMastered = lp.mastered === lp.total && lp.total > 0
  const pct = lp.total > 0 ? Math.round((lp.done / lp.total) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="text-6xl mb-4">{allMastered ? '🏆' : '✅'}</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {allMastered ? 'שלטת ברמה!' : 'סיימת את הרמה'}
          </h1>
          <p className="text-slate-500 mb-6">{level.title}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-blue-600">{pct}%</div>
              <div className="text-xs text-slate-400 mt-0.5">דיוק</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-amber-500">{hintsUsed}</div>
              <div className="text-xs text-slate-400 mt-0.5">רמזים</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-purple-500">{solutionsViewed}</div>
              <div className="text-xs text-slate-400 mt-0.5">פתרונות</div>
            </div>
          </div>

          {/* Exercise breakdown */}
          <div className="text-right mb-6">
            <h3 className="text-sm font-semibold text-slate-600 mb-3">פירוט תרגילים</h3>
            <div className="space-y-1.5">
              {exercises.map((ex, i) => {
                const r = progress.completedExercises[ex.id]
                const icon =
                  r?.masteryStatus === 'mastered'
                    ? '⭐'
                    : r?.masteryStatus === 'assisted'
                    ? '⚠️'
                    : r?.masteryStatus === 'learned'
                    ? '📖'
                    : r?.correct
                    ? '✅'
                    : '❌'
                return (
                  <div key={ex.id} className="flex items-center justify-between text-sm py-1 border-b border-slate-100">
                    <span className="text-slate-600">תרגיל {i + 1}: {ex.title}</span>
                    <span>{icon}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {nextLevel && (
              <Link
                to={`/level/${nextLevel.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                רמה הבאה: {nextLevel.title} ←
              </Link>
            )}
            <Link
              to={`/level/${levelId}`}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
            >
              תרגל שוב
            </Link>
            <Link
              to="/"
              className="text-slate-400 hover:text-slate-600 text-sm transition-colors"
            >
              לוח הבקרה
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
