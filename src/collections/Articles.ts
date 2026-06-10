import type { CollectionConfig } from 'payload'

import { populateSlug } from './hooks/populateSlug'
import { calculateReadingTime } from '../utilities/readingTime'

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
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
  },
  fields: [
    {
      name: 'title',
      label: 'Заголовок',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Адрес страницы',
      type: 'text',
      admin: {
        description:
          'Заполнится автоматически из заголовка, если оставить поле пустым. Используется в ссылке на статью.',
      },
      unique: true,
    },
    {
      name: 'excerpt',
      label: 'Краткое описание',
      type: 'textarea',
      admin: {
        description:
          'Показывается в списке статей, на главной странице и в описании для поисковиков. Лучше уложиться в 1-2 предложения.',
      },
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Подзаголовок',
      type: 'text',
      admin: {
        description: 'Необязательная строка под заголовком. Используйте, если нужно раскрыть тему статьи.',
      },
    },
    {
      name: 'readingTime',
      label: 'Время чтения',
      type: 'number',
      admin: {
        description: 'Заполняется автоматически по длине текста.',
        readOnly: true,
      },
    },
    {
      name: 'featured',
      label: 'Избранная статья',
      type: 'checkbox',
      admin: {
        description: 'Если включено, статья может показываться крупнее на главной странице.',
      },
      defaultValue: false,
    },
    {
      name: 'coverImage',
      label: 'Обложка',
      type: 'upload',
      admin: {
        description: 'Главное изображение статьи. Показывается на странице статьи и в карточках.',
      },
      relationTo: 'media',
    },
    {
      name: 'content',
      label: 'Текст статьи',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      label: 'Категория',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'tags',
      label: 'Теги',
      type: 'relationship',
      hasMany: true,
      relationTo: 'tags',
    },
    {
      name: 'publishedAt',
      label: 'Дата публикации',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      type: 'group',
      name: 'seo',
      label: 'Для поисковиков и соцсетей',
      fields: [
        {
          name: 'title',
          label: 'Заголовок для поисковиков',
          type: 'text',
        },
        {
          name: 'description',
          label: 'Описание для поисковиков',
          type: 'textarea',
        },
        {
          name: 'ogImage',
          label: 'Картинка для соцсетей',
          admin: {
            description: 'Если не выбрать отдельную картинку, будет использована обложка статьи.',
          },
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
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
