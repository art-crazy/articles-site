import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Загружайте изображения для обложек и текста статей. Перед публикацией обязательно проверьте описание изображения.',
    group: 'Контент',
  },
  fields: [
    {
      name: 'alt',
      label: 'Описание изображения',
      type: 'text',
      admin: {
        description:
          'Коротко опишите, что изображено: например "Портрет автора у окна". Не пишите "картинка" или "фото".',
      },
      required: true,
    },
    {
      name: 'caption',
      label: 'Подпись под изображением',
      type: 'text',
      admin: {
        description:
          'Необязательная подпись для читателя. Используйте, если нужно объяснить контекст изображения.',
      },
    },
    {
      name: 'credit',
      label: 'Источник или автор изображения',
      type: 'text',
      admin: {
        description:
          'Необязательное поле для автора фото, архива или источника. На сайте можно использовать позже.',
      },
    },
  ],
  labels: {
    plural: 'Изображения и файлы',
    singular: 'Изображение или файл',
  },
  upload: {
    imageSizes: [
      {
        name: 'card',
        width: 832,
        height: 520,
        position: 'centre',
      },
      {
        name: 'cover',
        width: 1280,
        height: 720,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
}
