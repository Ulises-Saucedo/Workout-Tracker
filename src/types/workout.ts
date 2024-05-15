export type WorkoutType = {
  value: string
  text: string
}

type TypeCardio = {
  id: string
  cardio_type: string
  distance: string
  duration: string
  pace: string
}

type TypeStrength = {
  id: string
  exercise: string
  sets: number
  reps: number
  weight: number
}

export type WorkoutFromSupabase = {
  id: string
  created_at: string
  updated_at: string
  workout_name: string
  workout_type: 'strength' | 'cardio'
  exercises: Array<TypeCardio | TypeStrength>
}
