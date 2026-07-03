import { Link } from 'react-router-dom'
import type { UserProgress, ExerciseResult } from '../../types'
import { computeWeakTopics } from '../../lib/progress'
import { levels } from '../../data/levels'
import { getExercisesForLevel } from '../../data/exercises'

interface Props {
  progress: UserProgress
}

export function SmartRecommendation({ progress }: Props) {
  const weakTopics = computeWeakTopics(progress)

  // Find levels with solution viewed or high hint usage
  const reviewLevels: { levelId: number; title: string; reason: string }[] = []

  for (const level of levels) {
    // Match by the real exercise list, not a fragile string prefix — exercise
    // IDs are zero-padded (e.g. "level01-ex01"), which never matched "level1-".
    const results = getExercisesForLevel(level.id)
      .map((ex) => progress.completedExercises[ex.id])
      .filter((r): r is ExerciseResult => Boolean(r))
    if (results.length === 0) continue

    const hasSolution = results.some((r) => r.solutionViewed)
    const hintRate =
      results.filter((r) => r.hintsUsed > 0).length / results.length

    if (hasSolution) {
      reviewLevels.push({ levelId: level.id, title: level.title, reason: 'ראית פתרון' })
    } else if (hintRate > 0.5) {
      reviewLevels.push({ levelId: level.id, title: level.title, reason: 'השתמשת ברמזים רבים' })
    }
  }

  if (weakTopics.length === 0 && reviewLevels.length === 0) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎯</span>
        <h2 className="font-bold text-amber-800 text-base">מומלץ לתרגל</h2>
      </div>

      {weakTopics.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-amber-700 mb-2">נושאים חלשים שאותרו:</p>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((topic) => (
              <span
                key={topic}
                className="bg-amber-200 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {reviewLevels.length > 0 && (
        <div>
          <p className="text-sm text-amber-700 mb-2">רמות לחזרה:</p>
          <div className="flex flex-col gap-2">
            {reviewLevels.slice(0, 4).map((r) => (
              <Link
                key={r.levelId}
                to={`/level/${r.levelId}`}
                className="flex items-center justify-between bg-white border border-amber-200 rounded-lg px-3 py-2 hover:bg-amber-50 transition-colors group"
              >
                <span className="text-sm font-medium text-slate-700">{r.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    {r.reason}
                  </span>
                  <span className="text-slate-400 group-hover:text-blue-600 transition-colors">←</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
