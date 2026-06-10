import { draftMode } from 'next/headers'

import { getPayloadClient } from '@/shared/api/payload'
import { getRelationId } from '@/shared/lib/format'

export async function getArticle(slug: string) {
  const { isEnabled } = await draftMode()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    draft: isEnabled,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const article = result.docs[0] || null

  if (!article || (!isEnabled && article._status !== 'published')) {
    return null
  }

  return article
}

export async function getRelatedArticles(article: NonNullable<Awaited<ReturnType<typeof getArticle>>>) {
  const payload = await getPayloadClient()
  const categoryId = getRelationId(article.category)
  const tagIds = Array.isArray(article.tags)
    ? article.tags.map(getRelationId).filter((id): id is string | number => id !== null)
    : []

  if (!categoryId && tagIds.length === 0) {
    return []
  }

  const result = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 8,
    sort: '-publishedAt',
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          or: [
            ...(categoryId
              ? [
                  {
                    category: {
                      equals: categoryId,
                    },
                  },
                ]
              : []),
            ...tagIds.map((tagId) => ({
              tags: {
                contains: tagId,
              },
            })),
          ],
        },
      ],
    },
  })

  return result.docs.filter((relatedArticle) => relatedArticle.id !== article.id).slice(0, 3)
}

export async function getAdjacentArticles(article: NonNullable<Awaited<ReturnType<typeof getArticle>>>) {
  const payload = await getPayloadClient()
  const publishedAt = article.publishedAt || article.createdAt

  const [previous, next] = await Promise.all([
    payload.find({
      collection: 'articles',
      depth: 0,
      limit: 1,
      sort: '-publishedAt',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            publishedAt: {
              less_than: publishedAt,
            },
          },
        ],
      },
    }),
    payload.find({
      collection: 'articles',
      depth: 0,
      limit: 1,
      sort: 'publishedAt',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            publishedAt: {
              greater_than: publishedAt,
            },
          },
        ],
      },
    }),
  ])

  return {
    next: next.docs[0] || null,
    previous: previous.docs[0] || null,
  }
}
