import { notFound } from 'next/navigation'

import { ArticleCard } from '@/entities/article/ui/ArticleCard/ArticleCard'
import { getPayloadClient } from '@/shared/api/payload'

export const revalidate = 60
export const dynamic = 'force-dynamic'

type TagPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const tags = await payload.find({
    collection: 'tags',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const tag = tags.docs[0]

  if (!tag) {
    notFound()
  }

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 30,
    sort: '-publishedAt',
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          tags: {
            contains: tag.id,
          },
        },
      ],
    },
  })

  return (
    <section>
      <p className="eyebrow">Тег</p>
      <h1>{tag.title}</h1>
      <div className="section article-list">
        {articles.docs.length > 0 ? (
          articles.docs.map((article) => <ArticleCard article={article} key={article.id} />)
        ) : (
          <div className="empty-state">По этому тегу пока нет опубликованных статей.</div>
        )}
      </div>
    </section>
  )
}
