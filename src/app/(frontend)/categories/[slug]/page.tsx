import { notFound } from 'next/navigation'

import { ArticleCard } from '@/entities/article/ui/ArticleCard/ArticleCard'
import { getPayloadClient } from '@/shared/api/payload'

export const revalidate = 60
export const dynamic = 'force-dynamic'

type CategoryPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const categories = await payload.find({
    collection: 'categories',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const category = categories.docs[0]

  if (!category) {
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
          category: {
            equals: category.id,
          },
        },
      ],
    },
  })

  return (
    <section>
      <p className="eyebrow">Категория</p>
      <h1>{category.title}</h1>
      {category.description && <p className="lead">{category.description}</p>}
      <div className="section article-list">
        {articles.docs.length > 0 ? (
          articles.docs.map((article) => <ArticleCard article={article} key={article.id} />)
        ) : (
          <div className="empty-state">В этой теме пока нет опубликованных материалов.</div>
        )}
      </div>
    </section>
  )
}
