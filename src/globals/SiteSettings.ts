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
      admin: {
        description: 'Показывается в шапке сайта и используется как название проекта.',
      },
      required: true,
      defaultValue: 'Личный журнал',
    },
    {
      name: 'siteDescription',
      label: 'Описание сайта',
      type: 'textarea',
      admin: {
        description: 'Коротко объясняет, о чем сайт. Используется на главной и в метаданных.',
      },
      required: true,
      defaultValue: 'Статьи, заметки и размышления.',
    },
    {
      name: 'authorName',
      label: 'Имя автора',
      type: 'text',
      admin: {
        description: 'Показывается на странице "Об авторе" и в данных статьи для поисковиков.',
      },
      required: true,
      defaultValue: 'Автор',
    },
    {
      name: 'authorBio',
      label: 'Короткое описание автора',
      type: 'textarea',
      admin: {
        description: 'Главный текст страницы "Об авторе": кто пишет и почему этому можно доверять.',
      },
      defaultValue: 'Здесь можно рассказать об авторе, темах статей и редакторском фокусе сайта.',
    },
    {
      name: 'authorTopics',
      label: 'Темы автора',
      type: 'textarea',
      admin: {
        description: 'Необязательный абзац: о каких темах автор пишет чаще всего.',
      },
    },
    {
      name: 'contactText',
      label: 'Текст для связи',
      type: 'textarea',
      admin: {
        description: 'Необязательный абзац: как предложить тему, задать вопрос или связаться с автором.',
      },
    },
    {
      name: 'authorPhoto',
      label: 'Фото автора',
      type: 'upload',
      admin: {
        description: 'Портрет для страницы "Об авторе". Лучше вертикальное фото без мелкого текста.',
      },
      relationTo: 'media',
    },
    {
      name: 'defaultOgImage',
      label: 'Картинка для соцсетей по умолчанию',
      type: 'upload',
      admin: {
        description: 'Используется для ссылок в соцсетях, если у конкретной статьи нет своей картинки.',
      },
      relationTo: 'media',
    },
    {
      name: 'socialLinks',
      label: 'Ссылки',
      type: 'array',
      admin: {
        description: 'Ссылки на соцсети, почту, Telegram или другие страницы автора.',
      },
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
