import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Контент',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Название',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Адрес страницы',
      type: 'text',
      admin: {
        description: 'Короткая часть ссылки на страницу тега.',
      },
      required: true,
      unique: true,
    },
  ],
  labels: {
    plural: 'Теги',
    singular: 'Тег',
  },
}
