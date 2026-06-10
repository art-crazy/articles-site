import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
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
        description: 'Короткая часть ссылки на страницу категории.',
      },
      required: true,
      unique: true,
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
    },
  ],
  labels: {
    plural: 'Категории',
    singular: 'Категория',
  },
}
