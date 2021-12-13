import * as yup from 'yup'

const postPhotoValidation = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, 'Mínimo de 3 caracteres.')
    .max(50, 'Máximo de 50 caracteres.')
    .required('Título é obrigatório.'),
  description: yup
    .string()
    .trim()
    .max(2000, 'Máximo de 2000 caracteres.')
    .optional(),
  image: yup
    .mixed()
    .test('file required', 'Foto obrigatória', (images: FileList) =>
      Boolean(images?.length)
    )
    .test(
      'file size',
      'Tamanho máximo permitido: 10 MB',
      (images: FileList) => {
        if (images?.[0]?.size > 10_485_760) return false
        else if (typeof images?.length !== 'number') return false
        else return true
      }
    ),
})

export { postPhotoValidation }
