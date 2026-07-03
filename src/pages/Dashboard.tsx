import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Layout/Header'
import { LevelCard } from '../components/Dashboard/LevelCard'
import { ProgressStats } from '../components/Dashboard/ProgressStats'
import { SmartRecommendation } from '../components/Dashboard/SmartRecommendation'
import { levels } from '../data/levels'
import { allExercises } from '../data/exercises'
import { loadProgress, getOverallStats, getLevelProgress, isLevelUnlocked } from '../lib/progress'
import type { UserProgress } from '../types'

export function Dashboard() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress())

  // Refresh on focus (localStorage may have changed)
  useEffect(() => {
    const onFocus = () => setProgress(loadProgress())
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const stats = getOverallStats(progress)
  const levelsCompleted = levels.filter((l) => {
    const lp = getLevelProgress(progress, l.id)
    return lp.done === lp.total && lp.total > 0
  }).length

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            🎓 SQL Coach
          </h1>
          <p className="text-slate-500 text-lg">
            מאמן ה-SQL האישי שלך — קורס ניהול ועיצוב בסיסי נתונים
          </p>
        </div>

        {/* Stats */}
        <ProgressStats
          total={stats.total}
          correct={stats.correct}
          mastered={stats.mastered}
          accuracy={stats.accuracy}
          levelsCompleted={levelsCompleted}
          totalLevels={levels.length}
        />

        {/* Smart recommendation */}
        <SmartRecommendation progress={progress} />

        {/* Level grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-700 mb-4">רמות לימוד</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {levels.map((level) => {
              const lp = getLevelProgress(progress, level.id)
              const unlocked = isLevelUnlocked(progress, level.id)
              const exercises = allExercises.filter((e) => e.levelId === level.id)
              const hasAssisted = exercises.some(
                (e) => progress.completedExercises[e.id]?.masteryStatus === 'assisted'
              )
              const hasSolutionViewed = exercises.some(
                (e) => progress.completedExercises[e.id]?.solutionViewed
              )

              return (
                <LevelCard
                  key={level.id}
                  level={level}
                  exerciseCount={lp.total}
                  completedCount={lp.done}
                  masteredCount={lp.mastered}
                  unlocked={unlocked}
                  hasAssisted={hasAssisted}
                  hasSolutionViewed={hasSolutionViewed}
                />
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-xs text-slate-500">
          <span>⭐ שלטתי</span>
          <span>✅ הושלם</span>
          <span>⚠️ הושלם עם עזרה</span>
          <span>📖 למדתי (ראיתי פתרון)</span>
          <span>▶ בתהליך</span>
          <span>🔒 נעול</span>
        </div>
      </main>
    </div>
  )
}
