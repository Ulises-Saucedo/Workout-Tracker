import * as yup from 'yup'

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email('Formato de email no válido')
    .required('Campo requerido')
    .typeError('Campo de tipo caracter'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('Campo requerido')
    .typeError('Campo de tipo caracter'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .typeError('Campo de tipo caracter')
})

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Formato de email no válido')
    .required('Campo requerido')
    .typeError('Campo de tipo caracter'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('Campo requerido')
    .typeError('Campo de tipo caracter')
})
