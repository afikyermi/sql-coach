import { Link } from 'react-router-dom'
import { getOverallStats, loadProgress } from '../../lib/progress'

export function Header() {
  const progress = loadProgress()
  const stats = getOverallStats(progress)

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors">
          <span className="text-2xl">🎓</span>
          <span>SQL Coach</span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          {stats.total > 0 && (
            <>
              <span className="hidden sm:block">
                ✅ {stats.correct}/{stats.total} תרגילים
              </span>
              <span className="font-semibold text-blue-600">
                {stats.accuracy}% דיוק
              </span>
            </>
          )}
          <Link
            to="/"
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            לוח הבקרה
          </Link>
        </div>
      </div>
    </header>
  )
}
