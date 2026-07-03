export interface TableDisplay {
  tableName: string
  columns: string[]
  rows: (string | number | null)[][]
}

export interface ConceptCheck {
  type: 'requiresKeyword' | 'forbidsPattern'
  keyword?: string
  pattern?: string
  message: string
}

export interface Exercise {
  id: string
  levelId: number
  title: string
  description: string
  schema: string
  sampleData: TableDisplay[]
  expectedQuery: string
  requiredConcepts: ConceptCheck[]
  hints: string[]
  explanation: string
  /** For DML: what SELECT to run to verify state after the DML */
  verifyQuery?: string
  /** For conceptual (multiple choice) DML safety exercises */
  conceptual?: ConceptualQuestion
}

export interface ConceptualQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Level {
  id: number
  title: string
  subtitle: string
  intro: string
  concepts: string[]
  color: string
}

export type MasteryStatus = 'mastered' | 'assisted' | 'learned' | 'completed' | 'failed' | 'unattempted'

export interface ExerciseResult {
  correct: boolean
  hintsUsed: number
  solutionViewed: boolean
  attempts: number
  masteryStatus: MasteryStatus
  errorTypes: string[]
  timestamp: number
}

/** A single exam attempt, stored separately from practice progress so exams
 *  never mint practice mastery (⭐) or alter dashboard learning stats. */
export interface ExamAttempt {
  passed: boolean
  errorTypes: string[]
  timestamp: number
}

export interface UserProgress {
  completedExercises: Record<string, ExerciseResult>
  /** Keyed by exercise id — exam outcomes, kept apart from completedExercises. */
  examResults?: Record<string, ExamAttempt>
  lastVisited: string
}

export interface ValidationResult {
  passed: boolean
  conceptPassed: boolean
  resultMatch: boolean
  errorType?: string
  errorMessage?: string
  userRows?: Row[]
  expectedRows?: Row[]
  userColumns?: string[]
  expectedColumns?: string[]
  /** True when result matches but required concept keyword was missing */
  alternativeAccepted?: boolean
  alternativeMessage?: string
}

export type Row = Record<string, string | number | null>
