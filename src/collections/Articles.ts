import type { CollectionConfig } from 'payload'

import { articleFields } from './articles/articleFields'
import { populateSlug } from './hooks/populateSlug'
import { calculateReadingTime } from '../utilities/readingTime'

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    delete: () => false,
    read: () => true,
  },
  admin: {
    defaultColumns: ['title', 'category', '_status', 'publishedAt'],
    group: 'Контент',
    preview: (doc) => {
      const slug = typeof doc.slug === 'string' ? doc.slug : ''
      const secret = process.env.PREVIEW_SECRET || ''

      if (!slug || !secret) {
        return null
      }

      return `/preview?slug=${encodeURIComponent(slug)}&secret=${encodeURIComponent(secret)}`
    },
    useAsTitle: 'title',
    description:
      'Здесь создаются статьи. Памятка автора: /admin-help. Перед публикацией откройте предпросмотр, проверьте чеклист и только потом меняйте статус публикации.',
  },
  fields: articleFields,
  labels: {
    plural: 'Статьи',
    singular: 'Статья',
  },
  hooks: {
    beforeValidate: [populateSlug],
    beforeChange: [
      ({ data }) => {
        if (data.content) {
          data.readingTime = calculateReadingTime(data.content)
        }

        if (data._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
