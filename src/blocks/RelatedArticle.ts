import type { Block } from 'payload'

export const RelatedArticle: Block = {
  slug: 'relatedArticle',
  fields: [
    {
      name: 'article',
      label: 'Статья',
      type: 'relationship',
      relationTo: 'articles',
      required: true,
    },
  ],
  labels: {
    plural: 'Связанные статьи',
    singular: 'Связанная статья',
  },
}
