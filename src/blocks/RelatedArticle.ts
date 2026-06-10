import type { Block } from 'payload'

export const RelatedArticle: Block = {
  slug: 'relatedArticle',
  fields: [
    {
      name: 'article',
      label: 'Какую статью рекомендовать',
      type: 'relationship',
      admin: {
        description: 'Выберите статью, которую читателю стоит открыть из этого места текста.',
      },
      relationTo: 'articles',
      required: true,
    },
  ],
  labels: {
    plural: 'Рекомендуемые статьи',
    singular: 'Рекомендуемая статья',
  },
}
