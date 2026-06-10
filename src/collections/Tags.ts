import type { CollectionConfig } from 'payload'

import { populateSlug } from './hooks/populateSlug'
import { slugDescription, validateSlug } from '../utilities/validateSlug'

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
        description: slugDescription,
      },
      required: true,
      validate: validateSlug,
      unique: true,
    },
  ],
  labels: {
    plural: 'Теги',
    singular: 'Тег',
  },
  hooks: {
    beforeValidate: [populateSlug],
  },
}
