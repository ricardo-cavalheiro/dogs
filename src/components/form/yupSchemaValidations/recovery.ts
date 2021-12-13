import * as Yup from 'yup'

const emailValidation = Yup.object({
  email: Yup.string()
    .email('Preencha um e-mail válido.')
    .required('E-mail é obrigatório.'),
})

export { emailValidation }
