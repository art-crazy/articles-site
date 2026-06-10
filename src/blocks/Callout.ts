import type { Block } from 'payload'

export const Callout: Block = {
  slug: 'callout',
  fields: [
    {
      name: 'tone',
      label: 'Тип',
      type: 'select',
      defaultValue: 'note',
      options: [
        {
          label: 'Заметка',
          value: 'note',
        },
        {
          label: 'Важно',
          value: 'important',
        },
        {
          label: 'Цитата',
          value: 'quote',
        },
      ],
    },
    {
      name: 'text',
      label: 'Текст',
      type: 'textarea',
      required: true,
    },
  ],
  labels: {
    plural: 'Врезки',
    singular: 'Врезка',
  },
}
