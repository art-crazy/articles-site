import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
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
  ],
  labels: {
    plural: 'Изображения и файлы',
    singular: 'Изображение или файл',
  },
  upload: true,
}
