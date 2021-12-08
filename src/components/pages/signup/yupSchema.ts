import * as yup from 'yup'

const signupValidation = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, 'Mínimo de 3 caracteres.')
    .max(20, 'Máximo de 20 caracteres.')
    .required('Usuário é obrigatório.'),
  email: yup
    .string()
    .trim()
    .email('Preencha um e-amil válido.')
    .required('E-mail é obrigatório.'),
  password: yup
    .string()
    .min(8, 'Mínimo de 8 caracteres.')
    .max(400, 'Máximo de 400 caracteres.')
    .required('A senha é obrigatória.'),
  confirmPassword: yup
    .string()
    .equals([yup.ref('password')], 'As senhas devem ser as mesmas.')
    .required('Confirme a senha.'),
})

export { signupValidation }
