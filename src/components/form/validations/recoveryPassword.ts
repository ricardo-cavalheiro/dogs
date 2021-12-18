import * as Yup from 'yup'

const recoveryPasswordValidation = Yup.object({
  password: Yup.string()
    .min(8, 'Mínimo de 8 caracteres.')
    .max(400, 'Máximo de 400 caracteres.')
    .required('Senha obrigatória.'),
  confirmPassword: Yup.string()
    .equals([Yup.ref('password')], 'As senhas devem ser as mesmas.')
    .required('Confirme a senha.'),
})

export { recoveryPasswordValidation }
