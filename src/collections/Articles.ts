import type { CollectionConfig } from 'payload'

import { populateSlug } from './hooks/populateSlug'
import { calculateReadingTime } from '../utilities/readingTime'
import { slugDescription, validateSlug } from '../utilities/validateSlug'

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
    description:
      'Здесь создаются статьи. Для черновика достаточно заголовка и текста. Перед публикацией откройте предпросмотр, проверьте чеклист и только потом меняйте статус публикации.',
  },
  fields: [
    {
      name: 'title',
      label: 'Заголовок',
      type: 'text',
      admin: {
        description: 'Главное название статьи. Показывается на сайте, в списках и в верхней части страницы.',
      },
      required: true,
    },
    {
      name: 'slug',
      label: 'Адрес страницы',
      type: 'text',
      admin: {
        description: slugDescription,
      },
      validate: validateSlug,
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
      name: 'workflowStatus',
      label: 'Рабочий статус',
      type: 'select',
      admin: {
        description:
          'Внутренний статус для автора. Он помогает вести работу над текстом и не публикует статью сам по себе.',
      },
      defaultValue: 'draft',
      options: [
        {
          label: 'Идея',
          value: 'idea',
        },
        {
          label: 'Черновик',
          value: 'draft',
        },
        {
          label: 'На вычитке',
          value: 'review',
        },
        {
          label: 'Готово к публикации',
          value: 'ready',
        },
      ],
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
        description:
          'Главное изображение статьи. Лучше горизонтальное фото примерно 1280x720 или крупнее. Не используйте картинку с важным текстом по краям.',
      },
      relationTo: 'media',
    },
    {
      name: 'content',
      label: 'Текст статьи',
      type: 'richText',
      admin: {
        description:
          'Основной текст. В редакторе можно добавить изображение, врезку, разделитель или блок "Рекомендуемая статья" для ручной рекомендации.',
      },
      required: true,
    },
    {
      name: 'category',
      label: 'Категория',
      type: 'relationship',
      admin: {
        description: 'Одна главная тема статьи. Помогает читателю найти похожие материалы.',
      },
      relationTo: 'categories',
    },
    {
      name: 'tags',
      label: 'Теги',
      type: 'relationship',
      admin: {
        description: 'Дополнительные темы статьи. Можно выбрать несколько.',
      },
      hasMany: true,
      relationTo: 'tags',
    },
    {
      name: 'publishedAt',
      label: 'Дата публикации',
      type: 'date',
      admin: {
        description:
          'Если оставить пустой при публикации, дата заполнится автоматически текущим временем.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      type: 'group',
      name: 'publishChecklist',
      label: 'Чеклист перед публикацией',
      admin: {
        description:
          'Мягкая проверка перед публикацией. Она не блокирует сохранение, но помогает не забыть важные детали.',
      },
      fields: [
        {
          name: 'checkedExcerpt',
          label: 'Краткое описание проверено',
          type: 'checkbox',
        },
        {
          name: 'checkedCover',
          label: 'Обложка выбрана и подходит по смыслу',
          type: 'checkbox',
        },
        {
          name: 'checkedCategory',
          label: 'Категория и теги проверены',
          type: 'checkbox',
        },
        {
          name: 'checkedSlug',
          label: 'Адрес страницы проверен',
          type: 'checkbox',
        },
        {
          name: 'checkedPreview',
          label: 'Предпросмотр открыт и текст выглядит правильно',
          type: 'checkbox',
        },
      ],
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
          admin: {
            description: 'Можно оставить пустым: тогда будет использован обычный заголовок статьи.',
          },
        },
        {
          name: 'description',
          label: 'Описание для поисковиков',
          type: 'textarea',
          admin: {
            description: 'Короткий текст для поисковиков и соцсетей. Можно оставить пустым: тогда будет взято краткое описание.',
          },
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
