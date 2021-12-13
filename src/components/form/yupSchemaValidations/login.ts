import * as yup from 'yup'

const loginValidation = yup.object({
  email: yup
    .string()
    .email('Preencha um e-amil válido.')
    .required('E-mail obrigatório.'),
  password: yup.string().required('Senha obrigatória.'),
})

export { loginValidation }
