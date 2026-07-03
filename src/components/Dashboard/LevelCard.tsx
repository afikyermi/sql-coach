import { Link } from 'react-router-dom'
import type { Level } from '../../types'

interface Props {
  level: Level
  exerciseCount: number
  completedCount: number
  masteredCount: number
  unlocked: boolean
  hasAssisted: boolean
  hasSolutionViewed: boolean
}

export function LevelCard({
  level,
  exerciseCount,
  completedCount,
  masteredCount,
  unlocked,
  hasAssisted,
  hasSolutionViewed,
}: Props) {
  const pct = exerciseCount > 0 ? Math.round((completedCount / exerciseCount) * 100) : 0
  const allMastered = masteredCount === exerciseCount && exerciseCount > 0
  const fullyDone = completedCount === exerciseCount && exerciseCount > 0

  let statusIcon = '🔒'
  let statusLabel = 'נעול'
  let cardClass = 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'

  if (unlocked) {
    if (allMastered) {
      statusIcon = '⭐'
      statusLabel = 'שלטתי!'
      cardClass = 'bg-green-50 border-green-300 hover:border-green-400 cursor-pointer'
    } else if (fullyDone && hasSolutionViewed) {
      statusIcon = '📖'
      statusLabel = 'למדתי'
      cardClass = 'bg-blue-50 border-blue-200 hover:border-blue-300 cursor-pointer'
    } else if (fullyDone && hasAssisted) {
      statusIcon = '⚠️'
      statusLabel = 'הושלם עם עזרה'
      cardClass = 'bg-amber-50 border-amber-200 hover:border-amber-300 cursor-pointer'
    } else if (fullyDone) {
      statusIcon = '✅'
      statusLabel = 'הושלם'
      cardClass = 'bg-slate-50 border-slate-300 hover:border-slate-400 cursor-pointer'
    } else if (completedCount > 0) {
      statusIcon = '▶'
      statusLabel = 'בתהליך'
      cardClass = `bg-white border-slate-200 hover:border-blue-300 cursor-pointer`
    } else {
      statusIcon = '○'
      statusLabel = 'לא התחלת'
      cardClass = 'bg-white border-slate-200 hover:border-blue-300 cursor-pointer'
    }
  }

  const content = (
    <div className={`border-2 rounded-2xl p-4 transition-all ${cardClass}`}>
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📘</span>
          <div>
            <div className="text-xs text-slate-400">רמה {level.id}</div>
            <div className="font-bold text-slate-800 text-sm leading-tight">{level.title}</div>
          </div>
        </div>
        <div className="text-lg" title={statusLabel}>{statusIcon}</div>
      </div>

      {/* Subtitle */}
      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{level.subtitle}</p>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>{completedCount}/{exerciseCount} תרגילים</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              !unlocked ? 'bg-slate-300' : allMastered ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Concepts */}
      <div className="flex flex-wrap gap-1 mt-2">
        {level.concepts.slice(0, 3).map((c) => (
          <span key={c} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
            {c}
          </span>
        ))}
        {level.concepts.length > 3 && (
          <span className="text-xs text-slate-400">+{level.concepts.length - 3}</span>
        )}
      </div>

      {/* Locked reason — retained progress stays visible above */}
      {!unlocked && (
        <p className="text-xs text-slate-400 mt-3">🔒 יש להשלים את הרמה הקודמת כדי לפתוח</p>
      )}

      {/* Mode buttons — real links, raised above the full-card overlay */}
      {unlocked && (
        <div className="flex gap-2 mt-3">
          <Link
            to={`/level/${level.id}`}
            className="relative z-10 flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
          >
            לימוד
          </Link>
          <Link
            to={`/level/${level.id}/exam`}
            className="relative z-10 flex-1 text-center bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
          >
            בחינה
          </Link>
        </div>
      )}
    </div>
  )

  if (!unlocked) return content

  return (
    <div className="group relative">
      {content}
      {/* Clicking the card body enters learning mode; sits beneath the mode buttons (z-0 < z-10) */}
      <Link
        to={`/level/${level.id}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={`רמה ${level.id}: ${level.title} — מצב לימוד`}
      >
        <span className="sr-only">{level.title} — לימוד</span>
      </Link>
    </div>
  )
}
