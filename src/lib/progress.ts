import type { UserProgress, ExerciseResult, MasteryStatus } from '../types'
// ExamAttempt is stored via recordExamResult below.
import { levels } from '../data/levels'
import { allExercises } from '../data/exercises'

const STORAGE_KEY = 'sql-coach-progress'

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as UserProgress
  } catch {
    // ignore
  }
  return { completedExercises: {}, examResults: {}, lastVisited: new Date().toISOString() }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // ignore
  }
}

export function recordExerciseResult(
  progress: UserProgress,
  exerciseId: string,
  result: Omit<ExerciseResult, 'masteryStatus'>
): UserProgress {
  const masteryStatus = computeMastery(result)
  const existing = progress.completedExercises[exerciseId]

  // Keep best result
  const best = existing
    ? betterResult(existing, { ...result, masteryStatus })
    : { ...result, masteryStatus }

  const updated: UserProgress = {
    ...progress,
    completedExercises: {
      ...progress.completedExercises,
      [exerciseId]: best,
    },
    lastVisited: new Date().toISOString(),
  }
  saveProgress(updated)
  return updated
}

/**
 * Records an exam attempt in a SEPARATE store (progress.examResults) so it never
 * touches completedExercises — passing an exam does not mint practice mastery,
 * and the dashboard keeps reflecting practice progress only.
 */
export function recordExamResult(
  progress: UserProgress,
  exerciseId: string,
  result: { passed: boolean; errorTypes: string[] }
): UserProgress {
  const updated: UserProgress = {
    ...progress,
    examResults: {
      ...(progress.examResults ?? {}),
      [exerciseId]: {
        passed: result.passed,
        errorTypes: result.errorTypes,
        timestamp: Date.now(),
      },
    },
    lastVisited: new Date().toISOString(),
  }
  saveProgress(updated)
  return updated
}

function computeMastery(result: Omit<ExerciseResult, 'masteryStatus'>): MasteryStatus {
  if (!result.correct) return 'failed'
  if (result.solutionViewed) return 'learned'
  if (result.hintsUsed > 0) return 'assisted'
  if (result.attempts > 1) return 'completed'
  return 'mastered'
}

function betterResult(a: ExerciseResult, b: ExerciseResult): ExerciseResult {
  const rank: Record<MasteryStatus, number> = {
    mastered: 5, completed: 4, assisted: 3, learned: 2, failed: 1, unattempted: 0,
  }
  return rank[a.masteryStatus] >= rank[b.masteryStatus] ? a : b
}

export function getLevelProgress(progress: UserProgress, levelId: number) {
  const exercises = allExercises.filter((e) => e.levelId === levelId)
  const total = exercises.length
  const done = exercises.filter((e) => {
    const r = progress.completedExercises[e.id]
    return r && r.correct
  })
  const mastered = done.filter((e) => progress.completedExercises[e.id]?.masteryStatus === 'mastered')

  return { total, done: done.length, mastered: mastered.length }
}

export function isLevelUnlocked(progress: UserProgress, levelId: number): boolean {
  if (levelId === 1) return true
  const prev = getLevelProgress(progress, levelId - 1)
  return prev.done === prev.total
}

export function computeWeakTopics(progress: UserProgress): string[] {
  const topicErrors: Record<string, number> = {}
  const topicAttempts: Record<string, number> = {}

  for (const [exerciseId, result] of Object.entries(progress.completedExercises)) {
    const exercise = allExercises.find((e) => e.id === exerciseId)
    if (!exercise) continue
    const level = levels.find((l) => l.id === exercise.levelId)
    if (!level) continue
    const topic = level.title

    topicAttempts[topic] = (topicAttempts[topic] ?? 0) + 1
    if (!result.correct || result.solutionViewed || result.hintsUsed > 1) {
      topicErrors[topic] = (topicErrors[topic] ?? 0) + 1
    }
  }

  return Object.entries(topicErrors)
    .filter(([topic, count]) => {
      const attempts = topicAttempts[topic] ?? 0
      return attempts > 0 && count / attempts > 0.3
    })
    .sort(([, a], [, b]) => b - a)
    .map(([topic]) => topic)
    .slice(0, 5)
}

export function getOverallStats(progress: UserProgress) {
  const results = Object.values(progress.completedExercises)
  const total = results.length
  const correct = results.filter((r) => r.correct).length
  const mastered = results.filter((r) => r.masteryStatus === 'mastered').length
  return { total, correct, mastered, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 }
}
