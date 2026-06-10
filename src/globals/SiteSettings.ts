import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Настройки',
  },
  fields: [
    {
      name: 'siteTitle',
      label: 'Название сайта',
      type: 'text',
      required: true,
      defaultValue: 'Личный журнал',
    },
    {
      name: 'siteDescription',
      label: 'Описание сайта',
      type: 'textarea',
      required: true,
      defaultValue: 'Статьи, заметки и размышления.',
    },
    {
      name: 'authorName',
      label: 'Имя автора',
      type: 'text',
      required: true,
      defaultValue: 'Автор',
    },
    {
      name: 'authorBio',
      label: 'Короткое описание автора',
      type: 'textarea',
      defaultValue: 'Здесь можно рассказать об авторе, темах статей и редакторском фокусе сайта.',
    },
    {
      name: 'authorPhoto',
      label: 'Фото автора',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'defaultOgImage',
      label: 'Картинка для соцсетей по умолчанию',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socialLinks',
      label: 'Ссылки',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Название',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'Ссылка',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  label: 'Настройки сайта',
}
