// types
import type { RegisterOptions } from 'react-hook-form'

type FormInputs = {
  [key: string]: RegisterOptions
}
const postPhotoValidation: FormInputs = {
  title: {
    required: 'Título obrigatório.',
    minLength: {
      value: 3,
      message: 'Mínimo de 3 caracteres.',
    },
    maxLength: {
      value: 30,
      message: 'Máximo de 30 caracteres.',
    },
  },
  description: {
    maxLength: {
      value: 2000,
      message: 'Máximo de 2000 caracteres.',
    },
  },
  image: {
    validate: {
      required: (files: FileList) => files.length > 0 || 'Imagem obrigatória.',
      fileSize: (files: FileList) => {
        const imageFile = files.item(0)

        return (
          (imageFile && imageFile.size < 10_485_760) || 'Tamanho máximo: 10 MB'
        )
      },
    },
  },
}

export { postPhotoValidation }
