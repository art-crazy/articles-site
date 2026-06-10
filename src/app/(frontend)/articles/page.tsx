import { ArticleCard } from '@/entities/article/ui/ArticleCard/ArticleCard'
import { getPayloadClient } from '@/shared/api/payload'

export const metadata = {
  title: 'Статьи',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
  const payload = await getPayloadClient()
  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 30,
    sort: '-publishedAt',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return (
    <section>
      <p className="eyebrow">Архив</p>
      <h1>Статьи</h1>
      <div className="section article-list">
        {articles.docs.length > 0 ? (
          articles.docs.map((article) => <ArticleCard article={article} key={article.id} />)
        ) : (
          <div className="empty-state">Пока нет опубликованных статей.</div>
        )}
      </div>
    </section>
  )
}
