import { level01Exercises } from './level01'
import { level02Exercises } from './level02'
import { level03Exercises } from './level03'
import { level04Exercises } from './level04'
import { level05Exercises } from './level05'
import { level06Exercises } from './level06'
import { level07Exercises } from './level07'
import { level08Exercises } from './level08'
import { level09Exercises } from './level09'
import { level10Exercises } from './level10'
import { level11Exercises } from './level11'
import { level12Exercises } from './level12'
import { level13Exercises } from './level13'
import { level14Exercises } from './level14'
import type { Exercise } from '../../types'

export const allExercises: Exercise[] = [
  ...level01Exercises,
  ...level02Exercises,
  ...level03Exercises,
  ...level04Exercises,
  ...level05Exercises,
  ...level06Exercises,
  ...level07Exercises,
  ...level08Exercises,
  ...level09Exercises,
  ...level10Exercises,
  ...level11Exercises,
  ...level12Exercises,
  ...level13Exercises,
  ...level14Exercises,
]

export function getExercisesForLevel(levelId: number): Exercise[] {
  return allExercises.filter((e) => e.levelId === levelId)
}

export function getExercise(exerciseId: string): Exercise | undefined {
  return allExercises.find((e) => e.id === exerciseId)
}
