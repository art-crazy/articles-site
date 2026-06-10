import type { CollectionConfig } from 'payload'

import { populateSlug } from './hooks/populateSlug'
import { slugDescription, validateSlug } from '../utilities/validateSlug'

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
        description: slugDescription,
      },
      required: true,
      validate: validateSlug,
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
  hooks: {
    beforeValidate: [populateSlug],
  },
}
