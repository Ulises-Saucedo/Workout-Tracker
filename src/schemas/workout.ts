import * as yup from 'yup'

export const createWorkout = yup.object().shape({
  workout_name: yup
    .string()
    .min(8, 'Minimo 8 caracteres')
    .required('Campo requerido')
    .typeError('Campo de tipo caracter'),
  workout_type: yup
    .string()
    .oneOf(['strength', 'cardio'], 'Seleccione una opcion válida')
    .required('Campo requerido')
    .typeError('Campo de tipo caracter'),
  exercises: yup.array().when('workout_type', {
    is: (val: string) => val === 'strength',
    then: () =>
      yup.array().of(
        yup.object().shape({
          exercise: yup
            .string()
            .min(5, 'Minimo 5 caracteres')
            .max(55, 'Maximo 55 caracteres')
            .required('Campo requerido')
            .typeError('Campo de tipo caracter'),
          sets: yup
            .number()
            .min(1, 'Minimo 1 serie')
            .required('Campo requerido')
            .typeError('Campo de tipo numerico'),
          reps: yup
            .number()
            .min(1, 'Minimo 1 repeticion')
            .required('Campo requerido')
            .typeError('Campo de tipo numerico'),
          weight: yup
            .number()
            .min(1, 'Minimo 1 kg')
            .required('Campo requerido')
            .typeError('Campo de tipo numerico')
        })
      ),
    otherwise: () =>
      yup.array().of(
        yup.object().shape({
          cardio_type: yup
            .string()
            .oneOf(['run', 'walk'], 'Seleccione una opcion válida')
            .required('Campo requerido')
            .typeError('Campo de tipo caracter'),
          distance: yup
            .number()
            .min(1, 'Minimo 1 km')
            .required('Campo requerido')
            .typeError('Campo de tipo numerico'),
          duration: yup
            .number()
            .min(1, 'Minimo 1 minuto')
            .required('Campo requerido')
            .typeError('Campo de tipo numerico'),
          pace: yup
            .number()
            .min(1, 'Minimo 1')
            .required('Campo requerido')
            .typeError('Campo de tipo numerico')
        })
      )
  })
})
